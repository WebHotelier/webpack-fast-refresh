/**
 * MIT License
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// This file is copied from the Metro JavaScript bundler, with minor tweaks for
// webpack compatibility.
//
// https://github.com/facebook/metro/blob/d6b9685c730d0d63577db40f41369157f28dfa3a/packages/metro/src/lib/polyfills/require.js

const RefreshRuntime = require('react-refresh/runtime');

function isSafeExport(key) {
  return (
    key === '__esModule' ||
    key === '__N_SSG' ||
    key === '__N_SSP' ||
    // TODO: remove this key from page config instead of allow listing it
    key === 'config'
  );
}

function registerExportsForReactRefresh(moduleExports, moduleID) {
  RefreshRuntime.register(moduleExports, moduleID + ' %exports%');
  if (moduleExports == null || typeof moduleExports !== 'object') {
    // Exit if we can't iterate over exports.
    // (This is important for legacy environments.)
    return;
  }
  for (const key in moduleExports) {
    if (isSafeExport(key)) {
      continue;
    }
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
    if (isSafeExport(key)) {
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
    if (isSafeExport(key)) {
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
