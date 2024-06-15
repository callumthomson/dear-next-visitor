'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
  );
};
