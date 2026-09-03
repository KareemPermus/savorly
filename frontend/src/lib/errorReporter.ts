const APP_ID = process.env.NEXT_PUBLIC_APP_ID || (typeof window !== 'undefined' ? (() => {
  const match = window.location.hostname.match(/^preview-([^.]+)\./);
  return match ? match[1] : window.location.hostname;
})() : 'unknown');

const REPORT_URL = process.env.NEXT_PUBLIC_RUNTIME_ERROR_REPORT_URL;

function report(message: string, stack?: string) {
  if (!REPORT_URL) return;
  fetch(REPORT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: APP_ID,
      message,
      stack: stack || '',
      url: typeof window !== 'undefined' ? window.location.href : '',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    }),
  }).catch(() => {});
}

export function initErrorReporter() {
  if (typeof window === 'undefined') return;
  window.onerror = (msg, _src, _line, _col, err) => {
    report(String(msg), err?.stack);
  };
  window.onunhandledrejection = (e) => {
    report(e.reason?.message || String(e.reason), e.reason?.stack);
  };
  const origError = console.error;
  console.error = (...args: any[]) => {
    report(args.map(String).join(' '));
    origError.apply(console, args);
  };
}