// components/ContractDetail.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AggregateBars from './AggregateBars';
import Link from 'next/link';

interface OptionsContractDetail {
  ticker: string;
  underlying_ticker: string;
  strike_price: number;
  expiration_date: string;
  contract_type: string;
  greeks: {
    delta: number | null;
    gamma: number | null;
    theta: number | null;
    vega: number | null;
    implied_volatility: number | null;
  } | null;
}

interface ContractDetailProps {
  contractTicker: string;
}

const ContractDetail: React.FC<ContractDetailProps> = ({ contractTicker }) => {
  const [contract, setContract] = useState<OptionsContractDetail | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchContractDetail = async () => {
      try {
        const response = await axios.get<OptionsContractDetail>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/options/${contractTicker}`
        );
        setContract(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Error fetching contract details');
      }
    };

    fetchContractDetail();
  }, [contractTicker]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!contract) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Contract Details: {contract.ticker}</h1>
      <h2>General Information</h2>
      <table>
        <tbody>
          <tr>
            <th>Ticker</th>
            <td>{contract.ticker}</td>
          </tr>
          <tr>
            <th>Underlying Ticker</th>
            <td>{contract.underlying_ticker}</td>
          </tr>
          <tr>
            <th>Strike Price</th>
            <td>{contract.strike_price}</td>
          </tr>
          <tr>
            <th>Expiration Date</th>
            <td>{contract.expiration_date}</td>
          </tr>
          <tr>
            <th>Option Type</th>
            <td>{contract.contract_type}</td>
          </tr>
        </tbody>
      </table>

      <h2>Greeks</h2>
      {contract.greeks ? (
        <table>
          <tbody>
            <tr>
              <th>Delta</th>
              <td>{contract.greeks.delta}</td>
            </tr>
            <tr>
              <th>Gamma</th>
              <td>{contract.greeks.gamma}</td>
            </tr>
            <tr>
              <th>Theta</th>
              <td>{contract.greeks.theta}</td>
            </tr>
            <tr>
              <th>Vega</th>
              <td>{contract.greeks.vega}</td>
            </tr>
            <tr>
              <th>Implied Volatility</th>
              <td>{contract.greeks.implied_volatility}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Greeks data not available.</p>
      )}

      <h2>Aggregate Bars (Last 5 Days)</h2>
      <AggregateBars contractTicker={contractTicker} />

      <Link href={`/options?ticker=${contract.underlying_ticker}`}>
        Back to Options List
      </Link>
    </div>
  );
};

export default ContractDetail;
