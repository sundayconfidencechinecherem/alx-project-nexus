
'use client';  

import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './context/AuthContext';
import ApolloProvider from './providers/ApolloProvider';
import Navbar from './components/Navbar';
import InstallPrompt from './components/pwa/InstallPrompt';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone) {
      setIsStandalone(true);
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Craveo</title>
        <meta name="description" content="Share and discover delicious food creations from people around the world" />
        <meta name="application-name" content="Craveo" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Craveo" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="author" content="confidence chinecherem" />
        <meta name="theme-color" content="#FF6B35" />
        
        {/* PWA specific meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} ${isStandalone ? 'pwa-mode' : ''}`}>
        <ApolloProvider>
          <AuthProvider>
            <Navbar />
            <main id="main-content" className={isStandalone ? 'pt-safe-top' : ''}>
              {children}
            </main>
            <InstallPrompt />
          </AuthProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}