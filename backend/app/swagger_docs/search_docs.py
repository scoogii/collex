search_for_collectibles = {
    "parameters": [
        {
            "name": "input",
            "in": "query",
            "type": "string",
            "default": "Start typing a collectible name",
        }
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved collectibles",
        },
        "400": {"description": "Bad"},
    },
    "tags": ["Filters"],
}
