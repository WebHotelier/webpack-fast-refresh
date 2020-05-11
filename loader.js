function RefreshModuleRuntime() {
  const currentExports = module.__proto__.exports;
  // const prevExports = module.hot.data?.prevExports ?? null;
  let prevExports =
    module.hot.data !== undefined && module.hot.data.prevExports !== undefined
      ? module.hot.data.prevExports
      : null;

  // This cannot happen in MainTemplate because the exports mismatch between
  // templating and execution.
  self.$RefreshHelpers$.registerExportsForReactRefresh(
    currentExports,
    module.id
  );

  // A module can be accepted automatically based on its exports, e.g. when it
  // is a Refresh Boundary.
  if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
    // Save the previous exports on update so we can compare the boundary
    // signatures.
    module.hot.dispose((data) => {
      data.prevExports = currentExports;
    });
    // Unconditionally accept an update to this module, we'll check if it's
    // still a Refresh Boundary later.
    module.hot.accept();

    // This field is set when the previous version of this module was a Refresh
    // Boundary, letting us know we need to check for invalidation or enqueue
    // an update.
    if (prevExports !== null) {
      // A boundary can become ineligible if its exports are incompatible with
      // the previous exports.
      //
      // For example, if you add/remove/change exports, we'll want to
      // re-execute the importing modules, and force those components to
      // re-render. Similarly, if you convert a class component to a function,
      // we want to invalidate the boundary.
      if (
        self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(
          prevExports,
          currentExports
        )
      ) {
        module.hot.invalidate();
      } else {
        self.$RefreshHelpers$.scheduleUpdate();
      }
    }
  } else {
    // Since we just executed the code for the module, it's possible that the
    // new exports made it ineligible for being a boundary.
    // We only care about the case when we were _previously_ a boundary,
    // because we already accepted this update (accidental side effect).
    const isNoLongerABoundary = prevExports !== null;
    if (isNoLongerABoundary) {
      module.hot.invalidate();
    }
  }
}

let refreshModuleRuntime = RefreshModuleRuntime.toString();
refreshModuleRuntime = refreshModuleRuntime.slice(
  refreshModuleRuntime.indexOf('{') + 1,
  refreshModuleRuntime.lastIndexOf('}')
);

module.exports = function ReactRefreshLoader(source, inputSourceMap) {
  this.callback(null, `${source}\n\n;${refreshModuleRuntime}`, inputSourceMap);
};
