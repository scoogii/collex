from models import auth_models

register = {
    "parameters": [
        {
            "in": "body",
            "name": "register_input",
            "schema": auth_models.Register.model_json_schema(),
            "required": "true",
        }
    ],
    "responses": {
        "200": {
            "description": "Register successful",
        },
        "401": {
            "description": "Invalid credentials",
        },
    },
    "tags": ["Authentication"],
}

login = {
    "parameters": [
        {
            "in": "body",
            "name": "login_input",
            "schema": auth_models.Login.model_json_schema(),
            "required": "true",
        }
    ],
    "responses": {
        "200": {
            "description": "Login successful",
        },
        "401": {
            "description": "Invalid credentials",
        },
    },
    "tags": ["Authentication"],
}

logout = {
    "responses": {
        "200": {
            "description": "Login successful",
        },
    },
    "tags": ["Authentication"],
}

get_all_users = {
    "responses": {
        "200": {
            "description": "Successfully retrieved all users",
        },
    },
    "tags": ["Authentication"],
}

check_valid_token = {
    "parameters": [
        {
            "in": "query",
            "name": "jwt_token",
            "required": "true",
        }
    ],
    "responses": {
        "200": {
            "description": "Login successful",
        },
    },
    "tags": ["Authentication"],
}
