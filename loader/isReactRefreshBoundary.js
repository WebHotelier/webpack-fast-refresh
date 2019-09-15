const runtime = require('react-refresh/runtime');

/**
 * This implementation is cherry-picked from Metro.
 * Ref: https://github.com/facebook/metro/blob/febdba2383113c88296c61e28e4ef6a7f4939fda/packages/metro/src/lib/polyfills/require.js#L748-L774
 */
function isReactRefreshBoundary(moduleExports) {
  if (runtime.isLikelyComponentType(moduleExports)) {
    return true;
  }
  if (moduleExports === null || typeof moduleExports !== 'object') {
    return false;
  }

  let hasExports = false;
  let areAllExportsComponents = true;
  for (const key in moduleExports) {
    hasExports = true;
    if (key === '__esModule') {
      continue;
    }

    // Metro has unsafe getters. Webpack's getters on the other hand just return
    // the named exports, so they are safe to call.
    // Fixes components with named exports not getting recognized
    // const desc = Object.getOwnPropertyDescriptor(moduleExports, key);
    // if (desc && desc.get) {
    //   // Don't invoke getters as they may have side effects.
    //   return false;
    // }

    const exportValue = moduleExports[key];
    if (!runtime.isLikelyComponentType(exportValue)) {
      areAllExportsComponents = false;
      break;
    }
  }

  return hasExports && areAllExportsComponents;
}

module.exports = isReactRefreshBoundary;
