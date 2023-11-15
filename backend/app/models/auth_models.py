from pydantic import BaseModel, Field


class InvalidCredentials(Exception):
    status_code = 401

    def __init__(self, message, status_code=None, payload=None):
        super().__init__()
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        converted = dict(self.payload or ())
        converted["message"] = self.message
        return converted


class InvalidJWT(Exception):
    status_code = 401

    def __init__(self, message, status_code=None, payload=None):
        super().__init__()
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        converted = dict(self.payload or ())
        converted["message"] = self.message
        return converted


# Models
class Login(BaseModel):
    username: str = Field(..., title="Username")
    password: str = Field(..., title="Password")


class Register(BaseModel):
    username: str = Field(..., title="Username")
    password: str = Field(..., title="Password")
    email: str = Field(..., title="Email")
    is_campaign_manager: int = Field(0, title="Is Campaign Manager?")
    is_admin: int = Field(0, title="Is Admin?")
