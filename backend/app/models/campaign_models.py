from pydantic import BaseModel, Field


class CreateCampaignModel(BaseModel):
    campaign_manager_username: str = Field(title="Campaign Manager's username")
    campaign_name: str = Field(title="Campaign Name")
    campaign_description: str = Field(title="Campaign Description")
    series_name: str = Field(title="Series Name")
    campaign_start_date: str = Field(title="Campaign Start Date")
    campaign_end_date: str = Field(title="Campaign End Date")


class CreateCampaignPost(BaseModel):
    account_username: str = Field(title="Campaign manager username")
    campaign_name: str = Field(title="Campaign name")
    post_title: str = Field(title="Campaign post title")
    post_description: str = Field(title="Campaign post description")


class EditCampaignPost(BaseModel):
    account_username: str = Field(title="Author id")
    post_id: int = Field(title="Campaign post")
    new_description: str = Field(title="Updated campaign post description")
