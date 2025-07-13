'use client';

import { useEffect, useState } from 'react';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

// Polyfill IndexedDB for server-side rendering
if (typeof window === 'undefined') {
  const FDBFactory = require('fake-indexeddb/lib/FDBFactory');
  const FDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');

  global.indexedDB = new FDBFactory();
  global.IDBKeyRange = FDBKeyRange;
}

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}