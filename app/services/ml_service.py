import pandas as pd
import numpy as np
from app.db.database import engine

def predict_stock(symbol: str, days: int = 7):
    query = f"""
        SELECT Date, Close FROM stock_data
        WHERE Symbol = '{symbol}'
        ORDER BY Date
    """

    df = pd.read_sql(query, engine)

    closes = pd.to_numeric(df["Close"], errors="coerce").dropna()
    if closes.empty:
        return {"predicted_prices": []}

    horizon = max(1, int(days))
    recent = closes.tail(min(90, len(closes))).reset_index(drop=True)

    # Use recency-weighted returns so forecast direction follows the latest move.
    returns = recent.pct_change().dropna()
    if returns.empty:
        return {"predicted_prices": [float(recent.iloc[-1])] * horizon}

    short_drift = returns.tail(min(7, len(returns))).mean()
    ewma_drift = returns.ewm(span=min(14, len(returns)), adjust=False).mean().iloc[-1]
    long_drift = returns.tail(min(30, len(returns))).mean()
    blended_drift = (0.6 * short_drift) + (0.3 * ewma_drift) + (0.1 * long_drift)
    blended_drift = float(np.clip(blended_drift, -0.03, 0.03))

    recent_vol = float(returns.tail(min(30, len(returns))).std(ddof=0) or 0.0)
    trend_damping = max(0.2, 1.0 - min(recent_vol * 12.0, 0.8))

    predictions = []
    prev_price = float(recent.iloc[-1])

    for _ in range(horizon):
        next_price = prev_price * (1.0 + (blended_drift * trend_damping))
        next_price = max(next_price, 0.01)
        predictions.append(float(next_price))
        prev_price = next_price

    return {
        "predicted_prices": predictions
    }