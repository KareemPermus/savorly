const appId =
  import.meta.env.VITE_APP_ID ||
  (() => {
    try {
      const m = window.location.hostname.match(/^preview-([^.]+)/);
      return m ? m[1] : undefined;
    } catch {
      return undefined;
    }
  })();

const reportUrl = import.meta.env.VITE_RUNTIME_ERROR_REPORT_URL || '';

function send(payload: Record<string, unknown>) {
  if (!reportUrl) return;
  try {
    fetch(reportUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: appId, user_agent: navigator.userAgent, ...payload }),
    }).catch(() => {});
  } catch {}
}

window.onerror = (message, source, _l, _c, error) => {
  send({ message: String(message), stack: error?.stack, url: source });
};

window.onunhandledrejection = (e: PromiseRejectionEvent) => {
  send({ message: String(e.reason), stack: e.reason?.stack, url: window.location.href });
};

const origConsoleError = console.error;
console.error = (...args: unknown[]) => {
  origConsoleError.apply(console, args);
  send({ message: args.map(String).join(' '), url: window.location.href });
};