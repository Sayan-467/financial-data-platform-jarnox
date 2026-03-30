import yfinance as yf
import pandas as pd

def fetch_stock_data(symbol: str, period="1y"):
    stock = yf.Ticker(symbol)
    df = stock.history(period=period)

    df.reset_index(inplace=True)
    df['Symbol'] = symbol

    return df