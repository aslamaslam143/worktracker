import jwt
import requests
from django.conf import settings
from rest_framework import authentication, exceptions

class ClerkUser:
    """Lightweight user object attached to DRF request."""
    def __init__(self, clerk_id, email=None):
        self.clerk_id = clerk_id
        self.email = email
        self.is_authenticated = True

    def __str__(self):
        return f"ClerkUser({self.clerk_id})"

_JWKS_CACHE = None

def get_jwks():
    global _JWKS_CACHE
    if not _JWKS_CACHE:
        resp = requests.get(settings.CLERK_JWKS_URL, timeout=10)
        _JWKS_CACHE = resp.json()
    return _JWKS_CACHE

class ClerkAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return None

        token = parts[1]

        try:
            jwks = get_jwks()
            header = jwt.get_unverified_header(token)
            kid = header.get('kid')

            key = next((k for k in jwks.get('keys', []) if k.get('kid') == kid), None)
            if not key:
                # Refresh JWKS cache once in case key rotated
                global _JWKS_CACHE
                _JWKS_CACHE = None
                jwks = get_jwks()
                key = next((k for k in jwks.get('keys', []) if k.get('kid') == kid), None)
                if not key:
                    raise exceptions.AuthenticationFailed('Matching JWK not found')

            public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key)
            payload = jwt.decode(
                token,
                public_key,
                algorithms=['RS256'],
                options={"verify_aud": False}
            )

            user_id = payload.get('sub')
            if not user_id:
                raise exceptions.AuthenticationFailed('Invalid token: missing subject (sub)')

            return (ClerkUser(clerk_id=user_id, email=payload.get('email')), None)

        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError as e:
            raise exceptions.AuthenticationFailed(f'Invalid token: {str(e)}')
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Auth error: {str(e)}')