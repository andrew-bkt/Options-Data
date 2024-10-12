// app/options/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import OptionsList from '../../components/OptionsList';

export default function OptionsPage() {
  const searchParams = useSearchParams();
  const ticker = searchParams.get('ticker');

  if (!ticker) {
    return <div>No ticker provided.</div>;
  }

  return (
    <div>
      <OptionsList ticker={ticker} />
    </div>
  );
}