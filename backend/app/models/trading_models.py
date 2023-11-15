from pydantic import BaseModel, Field


class InvalidTrade(Exception):
    def __init__(self, message, status_code=None, payload=None):
        super().__init__()
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        converted = dict(self.payload or ())
        converted["message"] = self.message
        return converted


# Base model schema to create a trade
class Create_Trade_Listing(BaseModel):
    initiator_username: str = Field(title="Trade Creator's ID")
    offered_collectible_ids: list[int] = Field(
        default_factory=list, title="Offerred Collectible ID's"
    )
    requested_collectible_ids: list[int] = Field(
        default_factory=list, title="Requested Collectible ID's"
    )
    target_username: str = Field(title="Trade Offer Recipient ID")
