"""Add product review table

Revision ID: a1b2c3d4e5f6
Revises: f1a2b3c4d5e6
Create Date: 2026-02-05

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = 'f1a2b3c4d5e6'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'product_review',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('review_text', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
        sa.ForeignKeyConstraint(['product_id'], ['product.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint('rating >= 1 AND rating <= 5', name='rating_range_check'),
        sa.UniqueConstraint('product_id', 'user_id', name='unique_user_product_review')
    )
    op.create_index(op.f('ix_product_review_id'), 'product_review', ['id'], unique=False)
    op.create_index(op.f('ix_product_review_product_id'), 'product_review', ['product_id'], unique=False)
    op.create_index(op.f('ix_product_review_user_id'), 'product_review', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_product_review_user_id'), table_name='product_review')
    op.drop_index(op.f('ix_product_review_product_id'), table_name='product_review')
    op.drop_index(op.f('ix_product_review_id'), table_name='product_review')
    op.drop_table('product_review')
