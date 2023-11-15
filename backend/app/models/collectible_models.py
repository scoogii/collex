from pydantic import BaseModel, Field


class Collectible(BaseModel):
    name: str = Field(..., title="Name")
    rarity: str = Field(..., title="Rarity")
    series_id: int = Field(..., title="Series ID")
    image_id: str = Field(..., title="Image ID")
