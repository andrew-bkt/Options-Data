// components/AggregateBars.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface AggregateBar {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  timestamp: number;
}

interface AggregateBarsProps {
  contractTicker: string;
}

const AggregateBars: React.FC<AggregateBarsProps> = ({ contractTicker }) => {
  const [aggs, setAggs] = useState<AggregateBar[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchAggregateBars = async () => {
      try {
        const toDate = new Date();
        const fromDate = new Date();
        fromDate.setDate(toDate.getDate() - 5);

        const response = await axios.get<AggregateBar[]>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/options/${contractTicker}/aggregates`,
          {
            params: {
              timespan: 'day',
              from_date: fromDate.toISOString().split('T')[0],
              to_date: toDate.toISOString().split('T')[0],
            },
          }
        );
        setAggs(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Error fetching aggregate bars');
      }
    };

    fetchAggregateBars();
  }, [contractTicker]);

  if (error) {
    return <div>{error}</div>;
  }

  if (aggs.length === 0) {
    return <div>No aggregate bar data available.</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Open</th>
          <th>Close</th>
          <th>High</th>
          <th>Low</th>
          <th>Volume</th>
        </tr>
      </thead>
      <tbody>
        {aggs.map((agg) => (
          <tr key={agg.timestamp}>
            <td>{new Date(agg.timestamp).toLocaleDateString()}</td>
            <td>{agg.open}</td>
            <td>{agg.close}</td>
            <td>{agg.high}</td>
            <td>{agg.low}</td>
            <td>{agg.volume}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AggregateBars;