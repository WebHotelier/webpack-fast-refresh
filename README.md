# webpack-fast-refresh

React Fast Refresh for `webpack@5+` and `babel@7.9+`

webpack@4 users should try https://github.com/pmmmwh/react-refresh-webpack-plugin

# Usage

## 1. Install both `react-refresh` and `webpack-fast-refresh`

```bash
npm install -D -E @webhotelier/webpack-fast-refresh react-refresh
# or
yarn add -D -E @webhotelier/webpack-fast-refresh react-refresh
```

## 2. Configure webpack

Make the following changes to your `webpack.config.js`:

### a) Register the plugin:

```js
const ReactRefreshPlugin = require('@webhotelier/webpack-fast-refresh');

config.plugins.unshift(new ReactRefreshPlugin());

// or if you have an object-based config:
{
  ...otherSettings,
  plugins: [new ReactRefreshPlugin(), ...otherplugins];
}
```

### b) Place the runtime in front of your entrypoint:

Depending on how you have configured your entry, change it similarly to the following examples:

```js
// if it looks like this ("./index.js" is just an example, can be any file or path)
config.entry = './index.js'; // or
config.entry = ['./index.js'];
// change it to this:
config.entry = ['@webhotelier/webpack-fast-refresh/runtime.js', './index.js'];

// if it looks like this
config.entry = {
  import: './index.js',
}; // or
config.entry = {
  import: ['./index.js'],
};
// change it to this:
config.entry = {
  import: ['@webhotelier/webpack-fast-refresh/runtime.js', './index.js'],
};

// named entry points are also supported ("main" is just an example, can be any entry name)
config.main.entry = './index.js'; // or
config.main.entry = ['./index.js'];
// change to:
config.main.entry = [
  '@webhotelier/webpack-fast-refresh/runtime.js',
  './index.js',
];

// Examples of object-based config:
// change:
{
  "entry": {
    "main": "./index.js"
  }
}

// to:
{
  "entry": {
    "main": ["@webhotelier/webpack-fast-refresh/runtime.js", "./index.js"]
  }
}
```

### c) Place the loader in your rule matching React files:

Let's say you have the following rule:

```js
{
  "rules": [
    {
      "test": /\.jsx$/,
      "use": [
        { "loader": "babel-loader", "options": { "cacheDirectory": true } }
      ]
    }
  ]
}
```

Change to:

```json
{
  "module": {
    "rules": [
      {
        "test": /\.jsx$/,
        "use": [
          { "loader": "babel-loader", "options": { "cacheDirectory": true } },
          { "loader": "@webhotelier/webpack-fast-refresh/loader.js" }
        ]
      }
    ]
  }
}
```

or push it with code:

```js
// make sure to use the index of your JSX loader, 0 in this example
config.module.rules[0].use.push('@webhotelier/webpack-fast-refresh/loader.js');
```

## 3. Configure babel

Add react-refresh/babel to your babelrc:

```json
{
  "presets": [["@babel/preset-react", { "runtime": "automatic" }]],
  "plugins": ["react-refresh/babel"]
}
```

## 4. Configure error-overlay plugin (optional)

```js
const ErrorOverlayPlugin = require('@webhotelier/webpack-fast-refresh/error-overlay');
config.plugins.push(new ErrorOverlayPlugin());

// or if you have an object-based config:
{
  ...otherSettings,
  plugins: [new ErrorOverlayPlugin(), ...otherplugins];
}
```

## 5. Launch the server

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

# Common Issues

## Production problems

The above plugins/loader/etc are not checking if running in production builds.

Make sure you add the correct checks to only include them in development builds.

## Still having trouble configuring everything?

Real-world example using the plugin:

https://github.com/LWJGL/lwjgl3-www/blob/master/webpack.config.cjs

# References

- [@next/react-refresh-utils](https://github.com/zeit/next.js/tree/canary/packages/react-refresh-utils)
- [@pmmmwh/react-refresh-webpack-plugin](https://github.com/pmmmwh/react-refresh-webpack-plugin)
- [Implementation by @maisano](https://gist.github.com/maisano/441a4bc6b2954205803d68deac04a716)
