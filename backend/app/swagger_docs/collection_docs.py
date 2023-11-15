get_collection = {
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
            "description": "Successfully retrieved collection",
        }
    },
    "tags": ["Collection"],
}

get_user_level = {
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
            "description": "Successfully retrieved level",
        }
    },
    "tags": ["Collection"],
}

add_collectible_to_collection = {
    "parameters": [
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "...",
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
            "description": "Successfully added collectible to collection",
            "schema": {
                "type": "object",
                "properties": {
                    "status": {"type": "string"},
                    "response": {"type": "string"},
                },
            },
        },
        "422": {
            "description": "Could not add collectible to collection",
        },
    },
    "tags": ["Collection"],
}


remove_collectible_from_collection = {
    "parameters": [
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "...",
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
            "description": "Successfully removed collectible from collection",
            "schema": {
                "type": "object",
                "properties": {
                    "status": {"type": "string"},
                    "response": {"type": "string"},
                },
            },
        },
        "422": {
            "description": "Could not remove collectible from collection",
        },
    },
    "tags": ["Collection"],
}

add_as_tradable = {
    "parameters": [
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "1",
        },
        {
            "name": "collectible_id",
            "in": "query",
            "type": "integer",
            "required": "true",
            "default": "-1",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully added as tradable",
            "schema": {
                "type": "object",
                "properties": {
                    "status": {"type": "string"},
                    "response": {"type": "string"},
                },
            },
        }
    },
    "tags": ["Tradable"],
}

remove_as_tradable = {
    "parameters": [
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "1",
        },
        {
            "name": "collectible_id",
            "in": "query",
            "type": "integer",
            "required": "true",
            "default": "-1",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully removed as tradable",
            "schema": {
                "type": "object",
                "properties": {
                    "status": {"type": "string"},
                    "response": {"type": "string"},
                },
            },
        }
    },
    "tags": ["Tradable"],
}

get_tradable = {
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
            "description": "Successfully retrieved tradable",
        }
    },
    "tags": ["Tradable"],
}

get_is_tradable = {
    "parameters": [
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "1",
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
            "description": "Successfully retrieved tradable",
        }
    },
    "tags": ["Tradable"],
}

retrieve_progress = {
    "parameters": [
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "1",
        },
        {
            "name": "series_id",
            "in": "query",
            "type": "integer",
            "required": "true",
            "default": "1",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved progress in specified collectible series",
        }
    },
    "tags": ["Collection"],
}
