const { Template } = require('webpack');

/**
 * Code to run before each module, sets up react-refresh.
 *
 * `module.i` is injected by Webpack and should always exist.
 *
 * [Ref](https://github.com/webpack/webpack/blob/master/lib/MainTemplate.js#L233)
 */
const beforeModule = `
let cleanup = function NoOp() {};

if (window && window.$RefreshSetup$) {
  cleanup = window.$RefreshSetup$(module.i);
}

try {`;

/** Code to run after each module, sets up react-refresh */
const afterModule = `} finally {
  cleanup();
}`;

const EntryTest = /ReactRefreshEntry/;

function hasReactRefreshEntry(renderContext) {
  const { chunk, chunkGraph } = renderContext;

  if (chunkGraph.getNumberOfEntryModules(chunk) > 0) {
    for (let entryModule of chunkGraph.getChunkEntryModulesIterable(chunk)) {
      if (EntryTest.test(entryModule.resource)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Creates a module wrapped by a refresh template.
 * @param {string} source The source code of a module.
 * @param {object} renderContext Webpack renderContext.
 * @returns {string} A refresh-wrapped module.
 */
function createRefreshTemplate(source, renderContext) {
  // Make sure ./ReactRefreshEntry is in the chunk's Entry Modules
  if (!hasReactRefreshEntry(renderContext)) {
    return source;
  }

  const lines = source.split('\n');

  // Webpack generates this line whenever the mainTemplate is called
  const moduleInitializationLineNumber = lines.findIndex(line =>
    line.startsWith('execOptions.factory.call')
  );

  return Template.asString([
    ...lines.slice(0, moduleInitializationLineNumber),
    beforeModule,
    Template.indent(lines[moduleInitializationLineNumber]),
    afterModule,
    ...lines.slice(moduleInitializationLineNumber + 1, lines.length),
  ]);
}

module.exports = createRefreshTemplate;
