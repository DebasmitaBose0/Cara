"""add newsletter_subscribers table

Revision ID: 003_add_newsletter_subscribers
Revises: a1b2c3d4e5f6
Create Date: 2026-06-28

"""
from alembic import op
import sqlalchemy as sa

revision = '003_add_newsletter_subscribers'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'newsletter_subscribers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('name', sa.String(), server_default='', nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index('ix_newsletter_subscribers_email', 'newsletter_subscribers', ['email'])

def downgrade():
    op.drop_index('ix_newsletter_subscribers_email', 'newsletter_subscribers')
    op.drop_table('newsletter_subscribers')
