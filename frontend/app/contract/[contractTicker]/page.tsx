// app/contract/[contractTicker]/page.tsx

'use client';

import { useParams } from 'next/navigation';
import ContractDetail from '../../../components/ContractDetail';

export default function ContractPage() {
  const params = useParams();
  const contractTicker = params.contractTicker as string;

  if (!contractTicker) {
    return <div>No contract ticker provided.</div>;
  }

  return (
    <div>
      <ContractDetail contractTicker={contractTicker} />
    </div>
  );
}