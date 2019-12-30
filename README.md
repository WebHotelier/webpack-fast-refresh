# webpack-fast-refresh

React Fast Refresh plugin and loader for webpack@5+

We recommend webpack@4 users to use https://github.com/pmmmwh/react-refresh-webpack-plugin

# Usage

## 1. Install both `react-refresh` and `webpack-fast-refresh` in your project

```bash
yarn add -D -E @webhotelier/webpack-fast-refresh react-refresh
# or
npm install -D -E @webhotelier/webpack-fast-refresh react-refresh
```

## 2. Configure webpack

Register the plugin in `webpack.config.js`:

```javascript
const ReactRefreshPlugin = require('@webhotelier/webpack-fast-refresh');
config.plugins.unshift(new ReactRefreshPlugin());
```

## 3. Configure babel

```json
{
  "plugins": ["react-refresh/babel"]
}
```

## 4. Launch the server

Make sure you have [HMR](https://webpack.js.org/concepts/hot-module-replacement/) enabled.

### Using [webpack-dev-server](https://github.com/webpack/webpack-dev-server):

```bash
webpack-dev-server --hot --mode development
```

### Using [webpack-hot-middleware](https://github.com/webpack-contrib/webpack-hot-middleware):

In `webpack.config.js`:

```javascript
config.entry.main.unshift(require.resolve('webpack-hot-middleware/client'));
config.plugins.push(new webpack.HotModuleReplacementPlugin());
```

In your node server:

```javascript
if (app.get('env') === 'development') {
  const webpack = require('webpack');
  const webpackConfig = require('./webpack.config.json');
  const webpackCompiler = webpack(webpackConfig);

  app.use(
    require('webpack-dev-middleware')(webpackCompiler, {
      lazy: false,
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
