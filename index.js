//@ts-check
const webpack = require('webpack');

class ReactFreshWebpackPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(this.constructor.name, (compilation) => {
      webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(
        compilation
      ).renderRequire.tap(this.constructor.name, (source) => {
        const lines = source.split('\n');
        const evalIndex = lines.findIndex((l) =>
          l.includes('execOptions.factory.call')
        );
        // Unable to find the module execution, that's OK:
        if (evalIndex === -1) {
          return source;
        }

        return webpack.Template.asString([
          ...lines.slice(0, evalIndex),
          `var hasRefresh = !!self.$RefreshInterceptModuleExecution$;
var cleanup = hasRefresh
  ? self.$RefreshInterceptModuleExecution$(moduleId)
  : function() {};
try {`,
          lines[evalIndex],
          `} finally {
  cleanup();
}`,
          ...lines.slice(evalIndex + 1),
        ]);
      });
    });
  }
}

module.exports = ReactFreshWebpackPlugin;
