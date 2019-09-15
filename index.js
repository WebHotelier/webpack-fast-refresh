const createRefreshTemplate = require('./helpers/createRefreshTemplate');
const injectRefreshEntry = require('./helpers/injectRefreshEntry');

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
        if (!resolveData || !resolveData.createData) {
          return;
        }

        const data = resolveData.createData;

        // Inject refresh loader to React files
        if (/\.([jt]sx)$/.test(data.resource) && !/node_modules/.test(data.resource)) {
          data.loaders.unshift({
            loader: require.resolve('./loader/RefreshHotLoader'),
          });
        }
      });
    });

    compiler.hooks.compilation.tap(this.constructor.name, compilation => {
      compilation.mainTemplate.hooks.require.tap(this.constructor.name, createRefreshTemplate);
    });
  }
}

module.exports = ReactRefreshPlugin;
