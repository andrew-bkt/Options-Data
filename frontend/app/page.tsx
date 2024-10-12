// app/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [ticker, setTicker] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      router.push(`/options?ticker=${ticker.trim().toUpperCase()}`);
    }
  };

  return (
    <div>
      <h1>Stock Options Analysis Tool</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="ticker">Enter Stock Ticker Symbol:</label>
        <input
          type="text"
          id="ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          required
        />
        <button type="submit">Get Options Data</button>
      </form>
    </div>
  );
}