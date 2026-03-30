from fastapi import APIRouter
from app.services.stock_service import (
    get_companies,
    get_stock_data,
    get_summary,
    compare_stocks
)
from app.services.ml_service import predict_stock

router = APIRouter()

# 1. /companies
@router.get("/companies")
def companies():
    return get_companies()

# 2. /data/{symbol}
@router.get("/data/{symbol}")
def stock_data(symbol: str):
    return get_stock_data(symbol)

# 3. /summary/{symbol}
@router.get("/summary/{symbol}")
def summary(symbol: str):
    return get_summary(symbol)

# 4. /compare
@router.get("/compare")
def compare(symbol1: str, symbol2: str):
    return compare_stocks(symbol1, symbol2)

# 5. /predict/{symbol}
@router.get("/predict/{symbol}")
def predict(symbol: str, days: int = 7):
    return predict_stock(symbol, days)