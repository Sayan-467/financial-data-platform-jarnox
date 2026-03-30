import pandas as pd

from app.db.database import engine
from app.services.data_fetcher import fetch_stock_data
from app.services.data_processor import process_data

DEFAULT_STOCKS = ["INFY.NS", "TCS.NS", "RELIANCE.NS", "HDFCBANK.NS"]


def seed(stocks=None):
    symbols = stocks or DEFAULT_STOCKS
    frames = []

    for symbol in symbols:
        data = fetch_stock_data(symbol)
        processed = process_data(data)
        frames.append(processed)

    final_df = pd.concat(frames, ignore_index=True)
    final_df.to_sql("stock_data", con=engine, if_exists="replace", index=False)
    print(f"Seed complete: {len(final_df)} rows for {len(symbols)} symbols")


if __name__ == "__main__":
    seed()
