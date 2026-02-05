from pydantic import BaseModel

class DashboardStats(BaseModel):
    total_users: int
    total_products: int
    total_orders: int
    total_revenue: float
    active_jobs: int
    active_blogs: int
