## Testing

To run the backend tests:

```bash
cd backend
pip install -r requirements.txt
pytest
```

## Configuration

The backend now supports `ALLOWED_HOSTS` via environment variables. Add this to your `.env` file for production:

```
ALLOWED_HOSTS=["jeeni.com", "www.jeeni.com"]
```

Default is `["localhost", "127.0.0.1"]`.
