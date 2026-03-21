import os

# Database connection details from .env
db_url = "postgresql://postgres:root@127.0.0.1:5432/jeeni_db"
password = "root"

sql = """
ALTER TABLE product ADD COLUMN IF NOT EXISTS gst_rate FLOAT DEFAULT 0.0;
ALTER TABLE "order" ADD COLUMN IF NOT EXISTS total_gst FLOAT DEFAULT 0.0;
ALTER TABLE order_item ADD COLUMN IF NOT EXISTS gst_rate_at_purchase FLOAT DEFAULT 0.0;
ALTER TABLE order_item ADD COLUMN IF NOT EXISTS gst_amount_at_purchase FLOAT DEFAULT 0.0;
"""

print(f"Running migration on {db_url}...")
# Use PGPASSWORD environment variable to avoid prompt
cmd = f'set PGPASSWORD={password} && psql -h 127.0.0.1 -U postgres -d jeeni_db -c "{sql}"'
os.system(cmd)
print("Finished.")
