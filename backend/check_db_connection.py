import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

print("Testing database connection...", flush=True)

try:
    conn = psycopg2.connect(
        host=os.getenv('POSTGRES_SERVER', '127.0.0.1'),
        port=os.getenv('POSTGRES_PORT', '5432'),
        user=os.getenv('POSTGRES_USER', 'postgres'),
        password=os.getenv('POSTGRES_PASSWORD', 'root'),
        database=os.getenv('POSTGRES_DB', 'jeeni_db')
    )
    print("Database connection successful!", flush=True)
    conn.close()
except Exception as e:
    print(f"Database connection failed: {e}", flush=True)
