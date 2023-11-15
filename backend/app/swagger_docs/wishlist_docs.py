get_wishlist = {
    "parameters": [
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "1",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved wishlist",
        }
    },
    "tags": ["Wishlist"],
}

add_to_wishlist = {
    "parameters": [
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "type username here",
        },
        {
            "name": "collectible_id",
            "in": "query",
            "type": "integer",
            "required": "true",
            "default": "1",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully added collectible to wishlist",
            "schema": {
                "type": "object",
                "properties": {
                    "status": {"type": "string"},
                    "response": {"type": "string"},
                },
            },
        },
        "422": {
            "description": "Could not add collectible to wishlist",
        },
    },
    "tags": ["Wishlist"],
}

remove_from_wishlist = {
    "parameters": [
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "type username here",
        },
        {
            "name": "collectible_id",
            "in": "query",
            "type": "integer",
            "required": "true",
            "default": "1",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully removed collectible from wishlist",
            "schema": {
                "type": "object",
                "properties": {
                    "status": {"type": "string"},
                    "response": {"type": "string"},
                },
            },
        },
        "422": {
            "description": "Could not remove collectible from wishlist",
        },
    },
    "tags": ["Wishlist"],
}
