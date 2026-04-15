from supabase import create_client, Client
from app.config import get_settings

settings = get_settings()


def get_supabase_client() -> Client:
    """Create and return a Supabase client."""
    return create_client(settings.supabase_url, settings.supabase_key)


def get_supabase_admin_client() -> Client:
    """Create and return a Supabase admin client (with service key)."""
    return create_client(settings.supabase_url, settings.supabase_service_key)
