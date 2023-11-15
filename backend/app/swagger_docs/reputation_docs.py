get_reputation = {
    "parameters": [
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "Please type here",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved reputation",
        }
    },
    "tags": ["Reputation"],
}

add_review = {
    "parameters": [
        {
            "name": "reviewer",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "reviewer",
        },
        {
            "name": "reviewee",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "reviewee",
        },
        {
            "name": "rating",
            "in": "query",
            "type": "integer",
            "required": "true",
            "default": "5",
        },
        {
            "name": "message",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "message",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully added review",
        }
    },
    "tags": ["Reputation"],
}

remove_review = {
    "parameters": [
        {
            "name": "review_id",
            "in": "query",
            "type": "integer",
            "required": "true",
            "default": "1",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully removed review",
        }
    },
    "tags": ["Reputation"],
}

get_review = {
    "parameters": [
        {
            "name": "review_id",
            "in": "query",
            "type": "integer",
            "required": "true",
            "default": "1",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved review",
        }
    },
    "tags": ["Reputation"],
}

get_campaign_feedback = {
    "parameters": [
        {
            "name": "campaign_id",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "...",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved campaign reviews",
        }
    },
    "tags": ["Reputation"],
}

add_campaign_review = {
    "parameters": [
        {
            "name": "campaign",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "...",
        },
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "...",
        },
        {
            "name": "message",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "...",
        },
        {
            "name": "rating",
            "in": "query",
            "type": "integer",
            "required": "true",
            "default": 0,
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully added review",
        }
    },
    "tags": ["Reputation"],
}

get_campaign_review = {
    "parameters": [
        {
            "name": "review_id",
            "in": "query",
            "type": "integer",
            "required": "true",
            "default": 0,
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved review",
        }
    },
    "tags": ["Reputation"],
}

remove_campaign_review = {
    "parameters": [
        {
            "name": "review_id",
            "in": "query",
            "type": "integer",
            "required": "true",
            "default": 0,
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully removed review",
        }
    },
    "tags": ["Reputation"],
}
