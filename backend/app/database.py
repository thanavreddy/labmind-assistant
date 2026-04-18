from supabase import create_client, Client
from supabase.lib.client_options import ClientOptions
from app.config import get_settings

settings = get_settings()

_supabase: Client | None = None

def get_supabase_client(token: str = None):
    print("SUPABASE URL:", settings.supabase_url)
    print("SUPABASE KEY:", settings.supabase_service_key[:20])
    if token:
        return create_client(
            settings.supabase_url,
            settings.supabase_key,
            options=ClientOptions(
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": settings.supabase_service_key  # 🔥 CRITICAL
                }
            )
        )

    return create_client(
        settings.supabase_url,
        settings.supabase_key
    )


def get_supabase_admin_client() -> Client:
    """Create and return a Supabase admin client (with service key)."""
    return create_client(settings.supabase_url, settings.supabase_service_key)
