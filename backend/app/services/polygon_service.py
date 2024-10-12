# app/services/polygon_service.py

from polygon import RESTClient
import os
from ..models.schemas import (
    OptionsContract,
    OptionsContractDetail,
    AggregateBar,
)
from typing import List, Tuple
from dotenv import load_dotenv

load_dotenv()

class PolygonService:
    def __init__(self):
        api_key = os.getenv("POLYGON_API_KEY")
        if not api_key:
            raise Exception("Please set the POLYGON_API_KEY environment variable")
        self.client = RESTClient(api_key)

    def get_options_contracts(
        self,
        ticker: str,
        contract_type: str = None,
        expiration_date: str = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[OptionsContract], int]:
        query_params = {
            "underlying_ticker": ticker,
            "contract_type": contract_type,
            "expiration_date": expiration_date,
            "limit": limit,
            "offset": offset,
        }
        response = self.client.list_options_contracts(**query_params)
        contracts = []
        total = response.pagination.total if response.pagination else 0
        for c in response:
            contracts.append(
                OptionsContract(
                    ticker=c.ticker,
                    strike_price=c.strike_price,
                    expiration_date=c.expiration_date,
                    contract_type=c.contract_type,
                )
            )
        return contracts, total

    def get_contract_details(self, contract_ticker: str) -> OptionsContractDetail:
        contract = self.client.get_options_contract(contract_ticker)
        if not contract:
            return None
        return OptionsContractDetail(
            ticker=contract.ticker,
            underlying_ticker=contract.underlying_ticker,
            strike_price=contract.strike_price,
            expiration_date=contract.expiration_date,
            contract_type=contract.contract_type,
            greeks=contract.greeks,
        )

    def get_aggregate_bars(
        self,
        contract_ticker: str,
        timespan: str,
        from_date: str,
        to_date: str,
        limit: int,
    ) -> List[AggregateBar]:
        response = self.client.list_aggs(
            contract_ticker,
            1,
            timespan,
            from_date,
            to_date,
            limit=limit,
        )
        aggs = []
        for agg in response:
            aggs.append(
                AggregateBar(
                    open=agg.open,
                    close=agg.close,
                    high=agg.high,
                    low=agg.low,
                    volume=agg.volume,
                    timestamp=agg.timestamp,
                )
            )
        return aggs