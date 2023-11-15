from models.message_models import Message

send_message = {
    "parameters": [
        {
            "in": "body",
            "name": "message_input",
            "schema": Message.model_json_schema(),
            "required": "true",
        }
    ],
    "responses": {
        "200": {
            "description": "Message sent",
        },
    },
    "tags": ["Message"],
}

get_conversation = {
    "parameters": [
        {
            "name": "user1_username",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "...",
        },
        {
            "name": "user2_username",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "...",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved the conversation",
        },
    },
    "tags": ["Message"],
}

preview_all_messages = {
    "parameters": [
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "...",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved all most recent messages",
        },
    },
    "tags": ["Message"],
}

get_unread_conversations = {
    "parameters": [
        {
            "name": "username",
            "in": "query",
            "type": "string",
            "required": "true",
            "default": "...",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved unread conversations",
        },
    },
    "tags": ["Message"],
}
