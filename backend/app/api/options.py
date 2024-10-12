# app/api/options.py

from fastapi import APIRouter, HTTPException, Query
from ..services.polygon_service import PolygonService
from ..models.schemas import (
    OptionsContract,
    OptionsContractDetail,
    OptionsContractListResponse,
    AggregateBar,
)
from typing import List, Optional

router = APIRouter()

polygon_service = PolygonService()

@router.get("/", response_model=OptionsContractListResponse)
def get_options_contracts(
    ticker: str,
    contract_type: Optional[str] = Query(None, regex="^(call|put)$"),
    expiration_date: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
):
    """
    Get a list of options contracts for a given ticker.
    """
    try:
        contracts, total = polygon_service.get_options_contracts(
            ticker.upper(), contract_type, expiration_date, limit, offset
        )
        return OptionsContractListResponse(
            contracts=contracts,
            total=total,
            limit=limit,
            offset=offset,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{contract_ticker}", response_model=OptionsContractDetail)
def get_options_contract_detail(contract_ticker: str):
    """
    Get detailed information for a specific options contract.
    """
    try:
        contract_detail = polygon_service.get_contract_details(contract_ticker)
        if not contract_detail:
            raise HTTPException(status_code=404, detail="Contract not found")
        return contract_detail
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{contract_ticker}/aggregates", response_model=List[AggregateBar])
def get_aggregate_bars(
    contract_ticker: str,
    timespan: str = "day",
    from_date: str = Query(..., regex="^\d{4}-\d{2}-\d{2}$"),
    to_date: str = Query(..., regex="^\d{4}-\d{2}-\d{2}$"),
    limit: int = 50,
):
    """
    Get aggregate bar data for a specific options contract.
    """
    try:
        aggs = polygon_service.get_aggregate_bars(
            contract_ticker, timespan, from_date, to_date, limit
        )
        return aggs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
