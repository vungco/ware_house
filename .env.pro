# =========================
# APP
# =========================
APP_PORT=2003

# =========================
# POSTGRES (dùng cho service warehouse-postgres)
# =========================
POSTGRES_DB=warehouse
POSTGRES_USER=warehouse_user
POSTGRES_PASSWORD=warehouse_pass

# App connect tới Postgres qua hostname service trong docker network
DB_HOST=warehouse-postgres
DB_PORT=5432
DB_NAME=warehouse
DB_USER=warehouse_user
DB_PASSWORD=warehouse_pass

# (Optional) Nếu code của bạn dùng DATABASE_URL
# DATABASE_URL=postgres://warehouse_user:warehouse_pass@warehouse-postgres:5432/warehouse

# =========================
# REDIS (app connect qua hostname service trong docker network)
# =========================
REDIS_HOST=warehouse-redis
REDIS_PORT=6379
