if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  const runtime = require('react-refresh/runtime');
  // Inject runtime into global
  runtime.injectIntoGlobalHook(window);

  // Setup placeholder functions
  window.$RefreshReg$ = () => undefined;
  window.$RefreshSig$ = () => type => type;

  // Setup module refresh
  window.__RefreshModule = moduleId => {
    // Capture previous refresh state
    const prevRefreshReg = window.$RefreshReg$;
    const prevRefreshSig = window.$RefreshSig$;

    // Inject new refresh state
    window.$RefreshReg$ = (type, id) => {
      runtime.register(type, `${moduleId} ${id}`);
    };
    window.$RefreshSig$ = runtime.createSignatureFunctionForTransform;

    // Restore to previous functions after refresh
    return () => {
      window.$RefreshReg$ = prevRefreshReg;
      window.$RefreshSig$ = prevRefreshSig;
    };
  };
}
