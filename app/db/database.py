from sqlalchemy import create_engine
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./stocks.db")

engine_kwargs = {"pool_pre_ping": True}
if DATABASE_URL.startswith("sqlite"):
	engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, **engine_kwargs)