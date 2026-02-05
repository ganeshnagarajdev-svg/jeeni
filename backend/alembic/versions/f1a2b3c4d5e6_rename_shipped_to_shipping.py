"""rename shipped to shipping

Revision ID: f1a2b3c4d5e6
Revises: 331705f6780c
Create Date: 2026-02-05 16:50:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'f1a2b3c4d5e6'
down_revision: Union[str, Sequence[str], None] = '331705f6780c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. Add 'shipping' to the enum type
    # Postgres specific: ALTER TYPE orderstatus ADD VALUE 'shipping'
    # Use autocommit block for ALTER TYPE
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE orderstatus ADD VALUE IF NOT EXISTS 'shipping'")
    
    # 2. Update existing rows
    # Cast to text to avoid enum validation issues if any, though direct comparison usually works
    op.execute("UPDATE \"order\" SET status = 'shipping' WHERE status = 'shipped'")

def downgrade() -> None:
    # Update back to shipped
    op.execute("UPDATE \"order\" SET status = 'shipped' WHERE status = 'shipping'")
