# webpack-fast-refresh

React Fast Refresh plugin and loader for webpack@5+

## Usage

### 1. Install this plugin and `react-refresh` in your project

```bash
yarn add -D -E @webhotelier/webpack-fast-refresh react-refresh
# or
npm install -D -E @webhotelier/webpack-fast-refresh react-refresh
```

### 2. Add the plugin in your `webpack.config.js`

The webpack loader is registered internally

```javascript
const ReactRefreshPlugin = require('@webhotelier/webpack-fast-refresh');
config.plugins.unshift(new ReactRefreshPlugin());
```

### 3. Add React's plugin in your babel config

```json
{
  "plugins": ["react-refresh/babel"]
}
```

### 4. Launch the server

Make sure you have [HMR](https://webpack.js.org/concepts/hot-module-replacement/) enabled.

Using [webpack-dev-server](https://github.com/webpack/webpack-dev-server):

```bash
webpack-dev-server --hot --mode development
```

Use [webpack-hot-middleware](https://github.com/webpack-contrib/webpack-hot-middleware):

In `webpack.config.js`:

```javascript
config.entry.main.unshift(require.resolve('webpack-hot-middleware/client'));
config.plugins.push(new webpack.HotModuleReplacementPlugin());
```

In your `express` init file:

```javascript
if (app.get('env') === 'development') {
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config');
  const webpackCompiler = webpack(webpackConfig);

  app.use(
    require('webpack-dev-middleware')(webpackCompiler, {
      lazy: false,
      logLevel: 'error', // trace, debug, info, warn, error, silent
      publicPath: webpackConfig.output.publicPath,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
  );

  app.use(
    require('webpack-hot-middleware')(webpackCompiler, {
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000,
      noInfo: false,
      quiet: false,
    })
  );
}
```

# References

- [Fork of @pmmmwh/react-refresh-webpack-plugin](https://github.com/pmmmwh/react-refresh-webpack-plugin)
- [Implementation by @maisano](https://gist.github.com/maisano/441a4bc6b2954205803d68deac04a716)
