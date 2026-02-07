import multiprocessing

# Worker Options
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"

# Binding
bind = "0.0.0.0:8000"

# Logging
loglevel = "info"
accesslog = "-"  # stdout
errorlog = "-"   # stderr

# Timeout
timeout = 120
keepalive = 5

# Process Naming
proc_name = "jeeni_backend"
