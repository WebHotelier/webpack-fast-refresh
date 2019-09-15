// HMR Error Recovery
const inject = `
const isReactRefreshBoundary = require('${require.resolve('./isReactRefreshBoundary')}');
const enqueueUpdate = require('${require.resolve('./enqueueUpdate')}');
if ( module.hot && isReactRefreshBoundary(module.__proto__.exports) ) {
  function hotErrorHandler(error) {
    console.warn('[HMR] Error Occurred!');
    console.error(error);
    require.cache[module.id].hot.accept(hotErrorHandler);
  }
  module.hot.accept(hotErrorHandler);
  enqueueUpdate();
}
`;

function refreshHotLoader(source) {
  return source + inject;
}

module.exports = refreshHotLoader;
