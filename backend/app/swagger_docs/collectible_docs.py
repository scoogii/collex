from models import collectible_models

get_all_collectibles = {
    "responses": {
        "200": {
            "description": "Retrieved All Collectibles",
        },
    },
    "tags": ["Collectible"],
}

get_all_collectibles_and_series = {
    "responses": {
        "200": {
            "description": "Retrieved All Collectibles and Series",
        },
    },
    "tags": ["Collectible"],
}

get_trending_collectibles = {
    "responses": {
        "200": {
            "description": "Retrieved Trending Collectibles",
        },
    },
    "tags": ["Collectible"],
}

get_new_collectibles = {
    "responses": {
        "200": {
            "description": "Retrieved New Collectibles",
        },
    },
    "tags": ["Collectible"],
}

get_all_collectible_names = {
    "responses": {
        "200": {
            "description": "Retrieved All Collectibles names",
        },
    },
    "tags": ["Collectible"],
}

add_collectible = {
    "parameters": [
        {
            "in": "body",
            "name": "collectible_input",
            "schema": collectible_models.Collectible.model_json_schema(),
            "required": "true",
        }
    ],
    "responses": {
        "200": {
            "description": "Collectible added",
        },
    },
    "tags": ["Collectible"],
}

get_collectible = {
    "parameters": [
        {
            "in": "query",
            "name": "collectible_name",
            "type": "string",
            "required": "true",
        }
    ],
    "responses": {
        "200": {
            "description": "Collectible retrieved",
        },
    },
    "tags": ["Collectible"],
}

remove_collectible = {
    "parameters": [
        {
            "in": "query",
            "name": "collectible_id",
            "required": "true",
        }
    ],
    "responses": {
        "200": {
            "description": "Collectible removed",
        },
    },
    "tags": ["Collectible"],
}

get_all_series = {
    "responses": {
        "200": {
            "description": "Retrieved All Series",
        },
    },
    "tags": ["Series"],
}

get_series = {
    "parameters": [
        {
            "in": "query",
            "name": "series_id",
            "required": "true",
        }
    ],
    "responses": {
        "200": {
            "description": "Series retrieved",
        },
    },
    "tags": ["Series"],
}

get_series_by_collectible = {
    "parameters": [
        {
            "in": "query",
            "name": "collectible_id",
            "required": "true",
        }
    ],
    "responses": {
        "200": {
            "description": "Series retrieved for collectible",
        },
    },
    "tags": ["Series"],
}

add_series = {
    "parameters": [
        {
            "in": "body",
            "name": "series_input",
            "description": "Information for the new series",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Name of the series",
                        "example": "Test Series 1",
                    },
                    "provider": {
                        "type": "string",
                        "description": "Provider of the series",
                        "example": "Test Provider",
                    },
                    "total_number_of_collectibles": {
                        "type": "integer",
                        "description": "Total number of collectibles in the series",
                        "example": 10,
                    },
                },
                "required": ["name", "provider"],
            },
            "required": "true",
        }
    ],
    "responses": {
        "200": {
            "description": "Series added successfully",
        },
    },
    "tags": ["Series"],
}

remove_series = {
    "parameters": [
        {
            "in": "query",
            "name": "series_id",
            "required": "true",
        }
    ],
    "responses": {
        "200": {
            "description": "Series removed",
        },
    },
    "tags": ["Series"],
}


initialize_rarity_value = {
    "parameters": [
        {
            "name": "collectible_id",
            "in": "query",
            "type": "string",
            "required": "true",
            "description": "ID of the collectible to initialize",
        },
        {
            "name": "rarity",
            "in": "query",
            "type": "string",
            "required": "true",
            "description": "Rarity of the collectible",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully initialized value based on rarity",
            "schema": {
                "type": "object",
                "properties": {
                    "status": {"type": "string"},
                    "response": {"type": "string"},
                },
            },
        }
    },
    "tags": ["Collectible"],
}

update_rarity_value = {
    "parameters": [
        {
            "name": "collectible_id",
            "in": "query",
            "type": "integer",
            "required": "true",
            "description": "ID of the collectible to update",
        },
        {
            "name": "value",
            "in": "query",
            "type": "string",
            "required": "true",
            "description": "New value to set for the collectible",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully updated the value of the collectible",
            "schema": {
                "type": "object",
                "properties": {
                    "status": {"type": "string"},
                    "response": {"type": "string"},
                },
            },
        }
    },
    "tags": ["Collectible"],
}
