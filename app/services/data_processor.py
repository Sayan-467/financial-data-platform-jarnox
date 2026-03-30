import pandas as pd

def process_data(df: pd.DataFrame):
    # Handle missing values
    df.fillna(method='ffill', inplace=True)

    # Convert date
    df['Date'] = pd.to_datetime(df['Date'])

    # Daily Return
    df['Daily_Return'] = (df['Close'] - df['Open']) / df['Open']

    # 7-day Moving Average
    df['MA_7'] = df['Close'].rolling(window=7).mean()

    # 52-week High & Low (rolling)
    df['52W_High'] = df['Close'].rolling(window=252).max()
    df['52W_Low'] = df['Close'].rolling(window=252).min()

    return df