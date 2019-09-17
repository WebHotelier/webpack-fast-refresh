const runtime = require('react-refresh/runtime');

function isReactRefreshBoundary(module) {
  const moduleExports = module.exports || module.__proto__.exports;

  if (runtime.isLikelyComponentType(moduleExports)) {
    return true;
  }
  if (moduleExports === null || typeof moduleExports !== 'object') {
    return false;
  }

  let hasExports = false;
  for (const key in moduleExports) {
    hasExports = true;
    if (key === '__esModule') {
      continue;
    }

    if (!runtime.isLikelyComponentType(moduleExports[key])) {
      // Early out, we can't set a boundary in this module
      return false;
    }
  }

  return hasExports;
}

module.exports = isReactRefreshBoundary;
