import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import AppLayout from '@/components/layout/AppLayout';
import { useEffect } from 'react';
import { initErrorReporter } from '@/lib/errorReporter';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initErrorReporter();
  }, []);

  return (
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
  );
}