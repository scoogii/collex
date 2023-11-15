from models.campaign_models import (
    CreateCampaignModel,
    CreateCampaignPost,
    EditCampaignPost,
)

create_campaign = {
    "parameters": [
        {
            "in": "body",
            "name": "campaign_input",
            "schema": CreateCampaignModel.model_json_schema(),
            "required": "true",
        }
    ],
    "responses": {
        "200": {
            "description": "Campaign added",
        },
    },
    "tags": ["Campaign"],
}

create_campaign_post = {
    "parameters": [
        {
            "in": "body",
            "name": "campaign_post_input",
            "schema": CreateCampaignPost.model_json_schema(),
            "required": "true",
        }
    ],
    "responses": {
        "200": {
            "description": "Campaign post added",
        },
    },
    "tags": ["Campaign"],
}

edit_campaign_post = {
    "parameters": [
        {
            "in": "body",
            "name": "campaign_post_input",
            "schema": EditCampaignPost.model_json_schema(),
            "required": "true",
        }
    ],
    "responses": {
        "200": {
            "description": "Campaign post edited",
        },
    },
    "tags": ["Campaign"],
}

delete_campaign_post = {
    "parameters": [
        {
            "in": "query",
            "name": "username",
            "type": "string",
            "required": "true",
        },
        {
            "in": "query",
            "name": "post_id",
            "type": "integer",
            "required": "true",
        },
    ],
    "responses": {
        "200": {
            "description": "Campaign post removed",
        },
    },
    "tags": ["Campaign"],
}
search_for_campaign = {
    "parameters": [
        {"in": "query", "name": "input_string", "type": "string", "required": "true"}
    ],
    "responses": {
        "200": {"description": "Successfully retrieved campaigns"},
        "404": {"description": "No campaigns could be found"},
    },
    "tags": ["Campaign"],
}

view_all_posts = {
    "parameters": [
        {
            "in": "query",
            "name": "campaign_name",
            "type": "string",
            "required": "true",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved all campaign posts",
        },
        "404": {"description": "No posts found"},
    },
    "tags": ["Campaign"],
}

archive_campaign = {
    "parameters": [
        {
            "in": "query",
            "name": "campaign_name",
            "type": "string",
            "required": "true",
        },
    ],
    "responses": {
        "200": {
            "description": "Campaign successfully archived",
        },
        "404": {"description": "Campaign not found"},
    },
    "tags": ["Campaign"],
}

reactivate_campaign = {
    "parameters": [
        {
            "in": "query",
            "name": "campaign_name",
            "type": "string",
            "required": "true",
        },
    ],
    "responses": {
        "200": {
            "description": "Campaign successfully reactivated",
        },
        "404": {"description": "Campaign not found"},
    },
    "tags": ["Campaign"],
}

get_all_campaigns_for_managers = {
    "parameters": [
        {
            "in": "query",
            "name": "campaign_manager_username",
            "type": "string",
            "required": "true",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved all campaigns for manager",
        },
        "404": {"description": "No posts found"},
    },
    "tags": ["Campaign"],
}

get_all_campaigns_for_users = {
    "parameters": [],
    "responses": {
        "200": {
            "description": "Successfully retrieved all campaigns for user",
        },
        "404": {"description": "No campaigns found"},
    },
    "tags": ["Campaign"],
}

get_all_recommended_campaigns_for_user = {
    "parameters": [
        {
            "in": "query",
            "name": "username",
            "type": "string",
            "required": "true",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved all recommended campaigns for user",
        },
        "404": {"description": "No campaigns found"},
    },
    "tags": ["Campaign"],
}

get_campaign = {
    "parameters": [
        {
            "in": "query",
            "name": "campaign_name",
            "type": "string",
            "required": "true",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved campaign",
        },
        "404": {"description": "No campaign found"},
    },
    "tags": ["Campaign"],
}

get_campaign = {
    "parameters": [
        {
            "in": "query",
            "name": "campaign_name",
            "type": "string",
            "required": "true",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved campaign",
        },
        "404": {"description": "No campaign found"},
    },
    "tags": ["Campaign"],
}

search_for_manager_archived_campaigns = {
    "parameters": [
        {
            "in": "query",
            "name": "input_string",
            "type": "string",
            "required": "true",
        },
        {
            "in": "query",
            "name": "username",
            "type": "string",
            "required": "true",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully retrieved campaigns",
        },
        "404": {"description": "No campaign found"},
    },
    "tags": ["Campaign"],
}

total_campaigns = {
    "parameters": [],
    "responses": {
        "200": {
            "description": "Successfully retrieved the total number of campaigns",
        },
    },
    "tags": ["Campaign"],
}

get_total_active_campaigns = {
    "parameters": [],
    "responses": {
        "200": {
            "description": "Successfully retrieved the total number of active campaigns",
        },
    },
    "tags": ["Campaign"],
}

get_total_archived_campaigns = {
    "parameters": [],
    "responses": {
        "200": {
            "description": "Successfully retrieved the total number of archived campaigns",
        },
    },
    "tags": ["Campaign"],
}

delete_campaign = {
    "parameters": [
        {
            "in": "query",
            "name": "campaign_name",
            "type": "string",
            "required": "true",
        },
        {
            "in": "query",
            "name": "username",
            "type": "string",
            "required": "true",
        },
    ],
    "responses": {
        "200": {
            "description": "Successfully removed campaigns",
        },
        "404": {"description": "No campaign found"},
    },
    "tags": ["Campaign"],
}
