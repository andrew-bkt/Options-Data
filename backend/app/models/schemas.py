# app/models/schemas.py

from pydantic import BaseModel
from typing import Optional, List

class OptionsContract(BaseModel):
    ticker: str
    strike_price: float
    expiration_date: str
    contract_type: str

class OptionsContractDetail(OptionsContract):
    underlying_ticker: str
    greeks: Optional[dict] = None

class OptionsContractListResponse(BaseModel):
    contracts: List[OptionsContract]
    total: int
    limit: int
    offset: int

class AggregateBar(BaseModel):
    open: float
    close: float
    high: float
    low: float
    volume: int
    timestamp: int