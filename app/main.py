# data cleaning and handling
# import pandas as pd
# from services.data_fetcher import fetch_stock_data
# from services.data_processor import process_data
# from db.database import engine

# stocks = ["INFY.NS", "TCS.NS", "RELIANCE.NS", "HDFCBANK.NS"]

# all_data = []

# for stock in stocks:
#     df = fetch_stock_data(stock)
#     df = process_data(df)
#     all_data.append(df)

# final_df = pd.concat(all_data)

# # Store in SQLite
# final_df.to_sql("stock_data", con=engine, if_exists="replace", index=False)

# print("Data stored successfully!")

# To verify data storage
# from db.database import engine
# df = pd.read_sql("SELECT * FROM stock_data LIMIT 10", engine)
# print(df)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.stock_routes import router as stock_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stock_router)

@app.get("/")
def home():
    return {"message": "Stock API is running 🚀"}