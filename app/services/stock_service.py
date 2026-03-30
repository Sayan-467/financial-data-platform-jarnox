import pandas as pd
from app.db.database import engine

# 1. Get all companies
def get_companies():
    query = "SELECT DISTINCT Symbol FROM stock_data"
    df = pd.read_sql(query, engine)
    return df["Symbol"].tolist()

# 2. Get last 30 days data
def get_stock_data(symbol: str):
    query = f"""
        SELECT Date, Open, Close, MA_7 
        FROM stock_data 
        WHERE Symbol = '{symbol}'
        ORDER BY Date DESC 
        LIMIT 30
    """
    df = pd.read_sql(query, engine)
    return df.to_dict(orient="records")

# 3. Get summary
def get_summary(symbol: str):
    query = f"""
        SELECT 
            MAX(Close) as high_52w,
            MIN(Close) as low_52w,
            AVG(Close) as avg_close
        FROM stock_data
        WHERE Symbol = '{symbol}'
    """
    df = pd.read_sql(query, engine)
    return df.to_dict(orient="records")[0]

# 4. Compare stocks (BONUS)
def compare_stocks(symbol1: str, symbol2: str):
    query1 = f"""
        SELECT Close FROM stock_data 
        WHERE Symbol = '{symbol1}' ORDER BY Date
    """
    query2 = f"""
        SELECT Close FROM stock_data 
        WHERE Symbol = '{symbol2}' ORDER BY Date
    """

    df1 = pd.read_sql(query1, engine)
    df2 = pd.read_sql(query2, engine)

    # % return
    return1 = (df1["Close"].iloc[-1] - df1["Close"].iloc[0]) / df1["Close"].iloc[0]
    return2 = (df2["Close"].iloc[-1] - df2["Close"].iloc[0]) / df2["Close"].iloc[0]

    return {
        "symbol1_return": float(return1),
        "symbol2_return": float(return2),
        "better_performer": symbol1 if return1 > return2 else symbol2
    }