from pydantic import BaseModel, Field


class Message(BaseModel):
    sender_username: str = Field(title="Message Sender's Username")
    receiver_username: str = Field(title="Message Receiver's Username")
    message: str = Field(title="Message Content")
    conversation_id: int = Field(title="Conversation ID")
