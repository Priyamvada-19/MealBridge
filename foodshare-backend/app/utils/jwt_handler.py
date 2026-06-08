from jose import jwt, JWTError
from datetime import datetime, timedelta

SECRET_KEY = "foodshare_secret_key"
ALGORITHM = "HS256"


def create_access_token(data: dict):

    payload = data.copy()

    payload["exp"] = (
        datetime.utcnow() +
        timedelta(hours=24)
    )

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def verify_token(token: str):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:

        return None