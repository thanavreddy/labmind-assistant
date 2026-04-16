from supabase import create_client, Client
from app.config import get_settings

settings = get_settings()

_supabase: Client | None = None


def get_supabase_client() -> Client:
    global _supabase

    if _supabase is None:
        _supabase = create_client(
            settings.supabase_url,
            settings.supabase_key,
        )

    return _supabase


def get_supabase_admin_client() -> Client:
    """Create and return a Supabase admin client (with service key)."""
    return create_client(settings.supabase_url, settings.supabase_service_key)
