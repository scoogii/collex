from models import trading_models

get_trade_listing = {
    "parameters": [
        {
            "in": "query",
            "name": "trade_id",
            "type": "integer",
            "required": "true",
            "default": "-1",
        }
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved trade listing",
        },
    },
    "tags": ["Trading"],
}

create_trade_listing = {
    "parameters": [
        {
            "in": "body",
            "name": "Create_trade_listing_input",
            "schema": trading_models.Create_Trade_Listing.model_json_schema(),
            "required": "true",
        }
    ],
    "responses": {
        "200": {
            "description": "Trade listing sucessfully created",
        },
        "404": {
            "description": "Unable to process trade listing",
        },
    },
    "tags": ["Trading"],
}

get_open_trade_listings = {
    "parameters": [
        {
            "in": "query",
            "name": "username",
            "type": "string",
            "required": "true",
            "default": "username",
        },
        {
            "in": "query",
            "name": "listing_type",
            "type": "string",
            "required": "true",
            "default": "incoming or outgoing",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved open trade listings",
        },
        "404": {
            "description": "Unable to retrieve trade listings",
        },
    },
    "tags": ["Trading"],
}

get_historical_trade_listings = {
    "parameters": [
        {
            "in": "query",
            "name": "username",
            "type": "string",
            "required": "true",
            "default": "username",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved historical trade listings",
        },
        "404": {
            "description": "Unable to retrieve trade listings",
        },
    },
    "tags": ["Trading"],
}

remove_trade_listing = {
    "parameters": [
        {
            "in": "query",
            "name": "trade_id",
            "type": "integer",
            "required": "true",
            "default": "-1",
        }
    ],
    "responses": {
        "200": {
            "description": "Successfully removed trade listing",
        },
        "401": {
            "description": "Unable to remove trade listing, trade with the following id does not exist",
        },
    },
    "tags": ["Trading"],
}

complete_trade = {
    "parameters": [
        {
            "in": "query",
            "name": "trade_id",
            "type": "integer",
            "required": "true",
            "default": "1",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully completed trade",
        },
        "404": {
            "description": "Unable to complete trade",
        },
    },
    "tags": ["Trading"],
}

decline_trade = {
    "parameters": [
        {
            "in": "query",
            "name": "trade_id",
            "type": "integer",
            "required": "true",
            "default": "1",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully declined trade",
        },
        "404": {
            "description": "Unable to decline trade",
        },
    },
    "tags": ["Trading"],
}

get_collectible_trade_listings = {
    "parameters": [
        {
            "in": "query",
            "name": "collectible_id",
            "type": "integer",
            "required": "true",
            "default": "1",
        },
        {
            "in": "query",
            "name": "listing_type",
            "type": "string",
            "required": "true",
            "default": "offered or requested",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved collectible trade listings",
        },
        "404": {
            "description": "Unable to retrieve trade listings",
        },
    },
    "tags": ["Trading"],
}
