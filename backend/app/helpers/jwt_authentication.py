import jwt

from datetime import datetime

from models.auth_models import InvalidJWT

SECRET_KEY = "dev-secret-key"


def encode_auth_token(account_id):
    """
    Generates the Auth Token
    """
    try:
        payload = {
            "iat": datetime.utcnow(),
            "sub": account_id,
        }
        encoded = jwt.encode(payload=payload, key=SECRET_KEY, algorithm="HS256")
        return encoded
    except Exception as e:
        return e


def decode_auth_token(auth_token):
    """
    Decodes the auth token
    """
    print(f"Decoding Token: {auth_token}")
    try:
        payload = jwt.decode(jwt=auth_token, key=SECRET_KEY, algorithm="HS256")
        status = "success"
        message = payload["sub"]
    except jwt.ExpiredSignatureError:
        status = "failure"
        message = "Signature expired. Please log in again."
        raise InvalidJWT(message, status_code=401)
    except jwt.InvalidTokenError:
        status = "failure"
        message = "Invalid token. Please log in again."
        raise InvalidJWT(message, status_code=401)

    return {"status": status, "token": message}
