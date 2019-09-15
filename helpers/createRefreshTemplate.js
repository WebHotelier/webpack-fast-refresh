const webpack = require('webpack');

const beforeModule = `
var cleanup = window && window.__RefreshModule ? window.__RefreshModule(moduleId) : function() {};
try {`;

const afterModule = `} finally {
  cleanup();
}`;

function createRefreshTemplate(source, renderContext) {
  const { chunk } = renderContext;

  if (chunk.contentHash.javascript === undefined) {
    return source;
  }

  const lines = source.split('\n');

  // Webpack generates this line whenever mainTemplate is called
  const moduleInitializationLineNumber = lines.findIndex(line => line.startsWith('execOptions.factory.call'));

  return webpack.Template.asString([
    ...lines.slice(0, moduleInitializationLineNumber),
    beforeModule,
    webpack.Template.indent(lines[moduleInitializationLineNumber]),
    afterModule,
    ...lines.slice(moduleInitializationLineNumber + 1, lines.length),
  ]);
}

module.exports = createRefreshTemplate;
