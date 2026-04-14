from app.db.session import Base

# Import all models here so Alembic can detect them
from app.models.user import User  # noqa
