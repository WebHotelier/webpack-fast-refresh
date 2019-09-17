const webpack = require('webpack');
const version = parseInt(webpack.version.split('.')[0]);

const beforeModule = `
var cleanup = window && window.__RefreshModule ? window.__RefreshModule(moduleId) : function() {};
try {`;

const afterModule = `} finally {
  cleanup();
}`;

const EntryTest = /ReactRefreshEntry/;

function hasReactRefreshEntry(renderContext) {
  if (version > 4) {
    const { chunk, chunkGraph } = renderContext;

    if (chunkGraph.getNumberOfEntryModules(chunk) > 0) {
      for (let entryModule of chunkGraph.getChunkEntryModulesIterable(chunk)) {
        if (EntryTest.test(entryModule.resource)) {
          return true;
        }
      }
    }
  } else {
    const chunk = renderContext;

    if (chunk.entryModule && EntryTest.test(chunk.entryModule._identifier)) {
      return true;
    }
  }

  return false;
}

function createRefreshTemplate(source, renderContext) {
  // Make sure ./ReactRefreshEntry is in the chunk's Entry Modules
  if (!hasReactRefreshEntry(renderContext)) {
    return source;
  }

  const lines = source.split('\n');

  // Webpack generates this line whenever mainTemplate is called
  const moduleInitializationLineNumber = lines.findIndex(line =>
    line.startsWith(version > 4 ? 'execOptions.factory.call' : 'modules[moduleId].call')
  );

  return webpack.Template.asString([
    ...lines.slice(0, moduleInitializationLineNumber),
    beforeModule,
    webpack.Template.indent(lines[moduleInitializationLineNumber]),
    afterModule,
    ...lines.slice(moduleInitializationLineNumber + 1, lines.length),
  ]);
}

module.exports = createRefreshTemplate;
