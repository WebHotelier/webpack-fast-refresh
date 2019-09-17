const runtime = require('react-refresh/runtime');

function debounceRefresh() {
  let refreshTimeout = undefined;

  function _refresh() {
    if (refreshTimeout === undefined) {
      refreshTimeout = setTimeout(() => {
        refreshTimeout = undefined;
        runtime.performReactRefresh();
      }, 30);
    }
  }

  return _refresh();
}

module.exports = debounceRefresh;
