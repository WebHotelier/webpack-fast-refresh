const webpack = require('webpack');
const path = require('path');
const { createRefreshTemplate, injectRefreshEntry } = require('./helpers');
const { refreshUtils } = require('./runtime/globals');

class ReactRefreshPlugin {
  /**
   * Applies the plugin
   * @param {import('webpack').Compiler} compiler A webpack compiler object.
   * @returns {void}
   */
  apply(compiler) {
    // Skip processing on production
    if (
      compiler.options.mode !== 'development' ||
      (process.env.NODE_ENV && process.env.NODE_ENV === 'production')
    ) {
      return;
    }

    // Inject react-refresh context to all Webpack entry points
    compiler.options.entry = injectRefreshEntry(compiler.options.entry);

    // Inject refresh utilities to Webpack's global scope
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

        // Inject refresh loader to all files that probably contain JSX
        if (
          // Test for known JSX extensions
          /\.([jt]sx)$/.test(data.resource) &&
          // Skip all files from node_modules
          !/node_modules/.test(data.resource) &&
          // Skip files related to refresh runtime (to prevent self-referencing)
          // This is useful when using the plugin as a direct dependency
          !data.resource.includes(path.join(__dirname, './runtime'))
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
