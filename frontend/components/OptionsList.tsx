// components/OptionsList.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface OptionsContract {
  ticker: string;
  strike_price: number;
  expiration_date: string;
  contract_type: string;
}

interface OptionsContractListResponse {
  contracts: OptionsContract[];
  total: number;
  limit: number;
  offset: number;
}

interface OptionsListProps {
  ticker: string;
}

const OptionsList: React.FC<OptionsListProps> = ({ ticker }) => {
  const [contracts, setContracts] = useState<OptionsContract[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get<OptionsContractListResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/options`,
          {
            params: { ticker },
          }
        );
        setContracts(response.data.contracts);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Error fetching contracts');
      }
    };

    fetchContracts();
  }, [ticker]);

  if (error) {
    return <div>{error}</div>;
  }

  if (contracts.length === 0) {
    return <div>No options contracts found for {ticker}.</div>;
  }

  return (
    <div>
      <h1>Options Contracts for {ticker}</h1>
      <table>
        <thead>
          <tr>
            <th>Contract Name</th>
            <th>Strike Price</th>
            <th>Expiration Date</th>
            <th>Option Type</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract.ticker}>
              <td>
                <Link href={`/contract/${encodeURIComponent(contract.ticker)}`}>
                  {contract.ticker}
                </Link>
              </td>
              <td>{contract.strike_price}</td>
              <td>{contract.expiration_date}</td>
              <td>{contract.contract_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/">Back to Home</Link>
    </div>
  );
};

export default OptionsList;