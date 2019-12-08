const webpack = require('webpack');
const { createRefreshTemplate, injectRefreshEntry } = require('./helpers');
const { refreshUtils } = require('./runtime/globals');

class ReactRefreshPlugin {
  /**
   * Applies the plugin
   * @param {import('webpack').Compiler} compiler A webpack compiler object.
   * @returns {void}
   */
  apply(compiler) {
    // Webpack does not set process.env.NODE_ENV
    // Ref: https://github.com/webpack/webpack/issues/7074
    // Skip processing on non-development mode, but allow manual force-enabling
    if (compiler.options.mode !== 'development' && !this.options.forceEnable) {
      return;
    }

    // Inject react-refresh context to all Webpack entry points
    compiler.options.entry = injectRefreshEntry(compiler.options.entry);

    // Inject refresh utilities to Webpack global scope
    const providePlugin = new webpack.ProvidePlugin({
      [refreshUtils]: require.resolve('./runtime/utils'),
    });
    providePlugin.apply(compiler);

    compiler.hooks.normalModuleFactory.tap(this.constructor.name, nmf => {
      nmf.hooks.afterResolve.tap(this.constructor.name, resolveData => {
        if (!resolveData || !resolveData.createData) {
          return;
        }

        const data = resolveData.createData;

        // Inject refresh loader to all React files
        if (
          /\.([jt]sx)$/.test(data.resource) &&
          !/node_modules/.test(data.resource)
        ) {
          data.loaders.unshift({
            loader: require.resolve('./loader'),
            options: undefined,
          });
        }
      });
    });

    compiler.hooks.compilation.tap(this.constructor.name, compilation => {
      webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(
        compilation
      ).renderRequire.tap(this.constructor.name, createRefreshTemplate);
    });
  }
}

module.exports.ReactRefreshPlugin = ReactRefreshPlugin;
module.exports = ReactRefreshPlugin;
