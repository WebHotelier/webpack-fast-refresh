const runtime = require('react-refresh/runtime');

function registerExportsForReactRefresh(module) {
  const moduleExports = module.exports || module.__proto__.exports;
  const moduleId = module.id;

  if (runtime.isLikelyComponentType(moduleExports)) {
    Refresh.register(moduleExports, `${moduleId} %exports%`);
  }
  if (moduleExports === null || typeof moduleExports !== 'object') {
    return;
  }

  for (const key in moduleExports) {
    if (key === '__esModule') {
      continue;
    }

    const exportValue = moduleExports[key];
    if (!runtime.isLikelyComponentType(exportValue)) {
      runtime.register(exportValue, `${moduleId} %exports%${key}`);
    }
  }
}

module.exports = registerExportsForReactRefresh;
