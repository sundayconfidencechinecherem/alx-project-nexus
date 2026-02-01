// app/debug-cookies/page.tsx
'use client';

import { useState } from 'react';

export default function DebugCookiesPage() {
  const [result, setResult] = useState<any>(null);
  const [headers, setHeaders] = useState<string>('');

  const debugLogin = async () => {
    try {
      const response = await fetch('http://localhost:5001/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            mutation LoginTest($input: LoginInput!) {
              login(input: $input) {
                success
                message
                token
                refreshToken
                user {
                  id
                  email
                  username
                }
              }
            }
          `,
          variables: {
            input: {
              emailOrUsername: "kinf@gmail.com", // Use the email you registered with
              password: "password123" // Use the password you registered with
            }
          }
        })
      });

      // Get all response headers
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      setHeaders(JSON.stringify(responseHeaders, null, 2));

      const data = await response.json();
      setResult(data);
      
      console.log('Login Response:', data);
      console.log('Response Headers:', responseHeaders);
      
      // Check if Set-Cookie header is present
      const setCookieHeader = response.headers.get('set-cookie');
      console.log('Set-Cookie Header:', setCookieHeader);
      
      if (setCookieHeader) {
        alert(`Set-Cookie header found: ${setCookieHeader}`);
      } else {
        alert('NO Set-Cookie header in response!');
      }
      
    } catch (error: any) {
      setResult({ error: error.message });
      console.error('Debug error:', error);
    }
  };

  const checkCurrentCookies = () => {
    const cookies = document.cookie;
    alert(`Current cookies: ${cookies || 'None'}`);
  };

  const clearCookies = () => {
    // Clear all cookies
    document.cookie.split(";").forEach(cookie => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    alert('Cookies cleared');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Cookie Debug Page</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={debugLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Debug Login (check headers)
        </button>
        
        <button
          onClick={checkCurrentCookies}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Check Current Cookies
        </button>
        
        <button
          onClick={clearCookies}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear Cookies
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Response:</h2>
          <pre className="text-sm whitespace-pre-wrap">
            {result ? JSON.stringify(result, null, 2) : 'Click debug login...'}
          </pre>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Response Headers:</h2>
          <pre className="text-sm whitespace-pre-wrap">
            {headers || 'No headers yet'}
          </pre>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">What to check:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Set-Cookie header:</strong> Should appear in response headers</li>
          <li><strong>Response success:</strong> Should be true</li>
          <li><strong>Browser cookies:</strong> After login, check Application → Cookies</li>
          <li><strong>Backend cookie settings:</strong> Check your auth.utils.ts file</li>
        </ul>
      </div>
    </div>
  );
}