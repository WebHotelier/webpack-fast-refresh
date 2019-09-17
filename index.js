const createRefreshTemplate = require('./helpers/createRefreshTemplate');
const injectRefreshEntry = require('./helpers/injectRefreshEntry');
const webpack = require('webpack');
const version = parseInt(webpack.version.split('.')[0]);

class ReactRefreshPlugin {
  constructor(options) {
    this.options = options || {};
  }

  apply(compiler) {
    if (compiler.options.mode !== 'development' && !this.options.forceEnable) {
      return;
    }

    // Inject react-refresh context to all webpack entry points
    compiler.options.entry = injectRefreshEntry(compiler.options.entry);

    compiler.hooks.normalModuleFactory.tap(this.constructor.name, nmf => {
      nmf.hooks.afterResolve.tap(this.constructor.name, resolveData => {
        let data;
        if (version > 4) {
          if (!resolveData || !resolveData.createData) {
            return;
          }

          data = resolveData.createData;
        } else {
          data = resolveData;
        }

        // Inject refresh loader to React files
        if (/\.([jt]sx)$/.test(data.resource) && !/node_modules/.test(data.resource)) {
          data.loaders.unshift({
            loader: require.resolve('./loader'),
          });
        }
      });
    });

    compiler.hooks.compilation.tap(this.constructor.name, compilation => {
      compilation.mainTemplate.hooks.require.tap(this.constructor.name, createRefreshTemplate);

      if (version === 4) {
        // TODO: Support this in webpack@5 as well
        compilation.hooks.normalModuleLoader.tap(this.constructor.name, context => {
          if (!context.hot) {
            throw Error(
              'Hot Module Replacement (HMR) is not enabled! React-Refresh requires HMR to function properly.'
            );
          }
        });
      }
    });
  }
}

module.exports = ReactRefreshPlugin;
