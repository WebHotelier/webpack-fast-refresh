//@ts-check
const RefreshRuntime = require('react-refresh/runtime');

function registerExportsForReactRefresh(moduleExports, moduleID) {
  RefreshRuntime.register(moduleExports, moduleID + ' %exports%');
  if (moduleExports == null || typeof moduleExports !== 'object') {
    // Exit if we can't iterate over exports.
    // (This is important for legacy environments.)
    return;
  }
  for (const key in moduleExports) {
    const exportValue = moduleExports[key];
    const typeID = moduleID + ' %exports% ' + key;
    RefreshRuntime.register(exportValue, typeID);
  }
}

function isReactRefreshBoundary(moduleExports) {
  if (RefreshRuntime.isLikelyComponentType(moduleExports)) {
    return true;
  }
  if (moduleExports == null || typeof moduleExports !== 'object') {
    // Exit if we can't iterate over exports.
    return false;
  }
  let hasExports = false;
  let areAllExportsComponents = true;
  for (const key in moduleExports) {
    hasExports = true;
    if (key === '__esModule') {
      continue;
    }
    const exportValue = moduleExports[key];
    if (!RefreshRuntime.isLikelyComponentType(exportValue)) {
      areAllExportsComponents = false;
    }
  }
  return hasExports && areAllExportsComponents;
}

function shouldInvalidateReactRefreshBoundary(prevExports, nextExports) {
  const prevSignature = getRefreshBoundarySignature(prevExports);
  const nextSignature = getRefreshBoundarySignature(nextExports);
  if (prevSignature.length !== nextSignature.length) {
    return true;
  }
  for (let i = 0; i < nextSignature.length; i++) {
    if (prevSignature[i] !== nextSignature[i]) {
      return true;
    }
  }
  return false;
}

function getRefreshBoundarySignature(moduleExports) {
  const signature = [];
  signature.push(RefreshRuntime.getFamilyByType(moduleExports));
  if (moduleExports == null || typeof moduleExports !== 'object') {
    // Exit if we can't iterate over exports.
    // (This is important for legacy environments.)
    return signature;
  }
  for (const key in moduleExports) {
    if (key === '__esModule') {
      continue;
    }
    const exportValue = moduleExports[key];
    signature.push(key);
    signature.push(RefreshRuntime.getFamilyByType(exportValue));
  }
  return signature;
}

let isUpdateScheduled = false;
function scheduleUpdate() {
  if (isUpdateScheduled) {
    return;
  }

  function canApplyUpdate() {
    //@ts-ignore
    return module.hot.status() === 'idle';
  }

  isUpdateScheduled = true;
  setTimeout(() => {
    isUpdateScheduled = false;

    // Only trigger refresh if the webpack HMR state is idle
    if (canApplyUpdate()) {
      try {
        RefreshRuntime.performReactRefresh();
      } catch (err) {
        console.warn(
          'Warning: Failed to re-render. We will retry on the next Fast Refresh event.\n' +
            err
        );
      }
      return;
    }

    return scheduleUpdate();
  }, 30);
}

module.exports = {
  registerExportsForReactRefresh,
  isReactRefreshBoundary,
  shouldInvalidateReactRefreshBoundary,
  getRefreshBoundarySignature,
  scheduleUpdate,
};
