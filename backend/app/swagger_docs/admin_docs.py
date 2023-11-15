search_users = {
    "parameters": [
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "default": "username",
        }
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved users",
        },
    },
    "tags": ["Admin"],
}

search_campaign_managers = {
    "parameters": [
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "default": "username",
        }
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved campaign managers",
        },
    },
    "tags": ["Admin"],
}

search_admins = {
    "parameters": [
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "default": "username",
        }
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved admins",
        },
    },
    "tags": ["Admin"],
}

ban_user = {
    "parameters": [
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "default": "username",
        }
    ],
    "responses": {
        "200": {
            "description": "Successfully banned user",
        },
    },
    "tags": ["Admin"],
}

all_users_roles = {
    "responses": {
        "200": {
            "description": "Successfully retrieved campaign managers",
        },
    },
    "tags": ["Admin"],
}

set_user_as_administrator = {
    "parameters": [
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "default": "username",
        }
    ],
    "responses": {
        "200": {
            "description": "Successfully updated role",
        },
    },
    "tags": ["Admin"],
}

set_user_as_campaign_manager = {
    "parameters": [
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "default": "username",
        }
    ],
    "responses": {
        "200": {
            "description": "Successfully updated role",
        },
    },
    "tags": ["Admin"],
}

set_user_as_collector = {
    "parameters": [
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "default": "username",
        }
    ],
    "responses": {
        "200": {
            "description": "Successfully updated role",
        },
    },
    "tags": ["Admin"],
}
