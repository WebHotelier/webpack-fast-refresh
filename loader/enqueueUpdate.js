const runtime = require('react-refresh/runtime');

function enqueueUpdate() {
  let refreshTimeout = undefined;

  function _execute() {
    if (refreshTimeout === undefined) {
      refreshTimeout = setTimeout(() => {
        refreshTimeout = undefined;
        runtime.performReactRefresh();
      }, 30);
    }
  }

  return _execute();
}

module.exports = enqueueUpdate;
