import pytz
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    Float,
    Table,
    DateTime,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from db import Base


collection_collectible_association = Table(
    "collection_collectible_association",
    Base.metadata,
    Column("collection_id", Integer, ForeignKey("Collection.id")),
    Column("collectible_id", Integer, ForeignKey("Collectible.id")),
)
tradelisting_collectible_association_offered = Table(
    "tradelisting_collectible_association_offered",
    Base.metadata,
    Column("tradelisting_id", Integer, ForeignKey("TradeListing.id")),
    Column("collectible_id", Integer, ForeignKey("Collectible.id")),
)
tradelisting_collectible_association_requested = Table(
    "tradelisting_collectible_association_requested",
    Base.metadata,
    Column("tradelisting_id", Integer, ForeignKey("TradeListing.id")),
    Column("collectible_id", Integer, ForeignKey("Collectible.id")),
)
tradable_collectible_association = Table(
    "tradable_collectible_association",
    Base.metadata,
    Column("tradable_id", Integer, ForeignKey("Tradable.id")),
    Column("collectible_id", Integer, ForeignKey("Collectible.id")),
)
wishlist_collectible_association = Table(
    "wishlist_collectible_association",
    Base.metadata,
    Column("wishlist_id", Integer, ForeignKey("Wishlist.id")),
    Column("collectible_id", Integer, ForeignKey("Collectible.id")),
)
reputation_review_association = Table(
    "reputation_review_association",
    Base.metadata,
    Column("reputation_id", Integer, ForeignKey("Reputation.id")),
    Column("review_id", Integer, ForeignKey("Review.id")),
)
campaign_reputation_campaign_review_association = Table(
    "campaign_reputation_campaign_review_association",
    Base.metadata,
    Column("reputation_id", Integer, ForeignKey("CampaignReputation.id")),
    Column("review_id", Integer, ForeignKey("CampaignReview.id")),
)
campaign_campaign_post_association = Table(
    "campaign_campaign_post_association",
    Base.metadata,
    Column("campaign_id", Integer, ForeignKey("Campaign.id")),
    Column("campaign_post_id", Integer, ForeignKey("CampaignPost.id")),
)
message_conversation_association = Table(
    "message_conversation_association",
    Base.metadata,
    Column("message_id", Integer, ForeignKey("Message.id")),
    Column("conversation_id", Integer, ForeignKey("Conversation.id")),
)


class Account(Base):
    __tablename__ = "Account"
    id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
    username = Column(String(15), unique=True)
    password = Column(String(15), nullable=False)
    email = Column(String(30), unique=True)
    is_campaign_manager = Column(Integer, nullable=False)
    is_admin = Column(Integer, nullable=False)
    unread_conversations = Column(Integer, default=0, nullable=False)

    def __init__(self, username, password, email, is_campaign_manager, is_admin):
        self.username = username
        self.password = password
        self.email = email
        self.is_campaign_manager = is_campaign_manager
        self.is_admin = is_admin

    def __repr__(self):
        return f"<Account {self.username}>"

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "is_campaign_manager": self.is_campaign_manager,
            "is_admin": self.is_admin,
        }


class Series(Base):
    __tablename__ = "Series"
    id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
    name = Column(String(15), unique=True)
    provider = Column(String(15), nullable=False)
    total_number_of_collectibles = Column(Integer, nullable=False)

    def __init__(self, name, provider, total_number_of_collectibles):
        self.name = name
        self.provider = provider
        self.total_number_of_collectibles = total_number_of_collectibles

    def __repr__(self):
        return f"<Series {self.name}>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "provider": self.provider,
            "total_number_of_collectibles": self.total_number_of_collectibles,
        }


class Collectible(Base):
    __tablename__ = "Collectible"
    id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
    name = Column(String(15), unique=True)
    rarity = Column(String(15), nullable=False)
    image_id = Column(String(100), nullable=False)
    series_id = Column(
        Integer,
        ForeignKey("Series.id"),
        nullable=False,
    )

    offered_listings = relationship(
        "TradeListing",
        secondary=tradelisting_collectible_association_offered,
        back_populates="offered_collectibles",
        overlaps="requested_listings",
    )
    requested_listings = relationship(
        "TradeListing",
        secondary=tradelisting_collectible_association_requested,
        back_populates="requested_collectibles",
        overlaps="offered_listings",
    )
    collections = relationship(
        "Collection",
        secondary=collection_collectible_association,
        back_populates="collectibles",
    )
    tradables = relationship(
        "Tradable",
        secondary=tradable_collectible_association,
        back_populates="collectibles",
    )
    wishlists = relationship(
        "Wishlist",
        secondary=wishlist_collectible_association,
        back_populates="collectibles",
    )

    def __init__(self, name, rarity, image_id, series_id):
        self.name = name
        self.rarity = rarity
        self.image_id = image_id
        self.series_id = series_id

    def __repr__(self):
        return f"<Collectible {self.name}>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "rarity": self.rarity,
            "image_id": self.image_id,
            "series_id": self.series_id,
        }


class Collection(Base):
    __tablename__ = "Collection"
    id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
    account_id = Column(
        Integer,
        ForeignKey("Account.id"),
        nullable=False,
    )
    number_of_items = Column(Integer, nullable=False, default=0)
    collectibles = relationship(
        "Collectible",
        secondary=collection_collectible_association,
        back_populates="collections",
    )

    def __init__(self, account_id, number_of_items):
        self.account_id = account_id
        self.number_of_items = number_of_items

    def __repr__(self):
        return f"<Collection {self.account_id}>"

    def to_dict(self):
        return {
            "id": self.id,
            "account_id": self.account_id,
            "number_of_items": self.number_of_items,
            "collectibles": self.collectibles,
        }


class Reputation(Base):
    __tablename__ = "Reputation"
    id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
    account_id = Column(
        Integer,
        ForeignKey("Account.id"),
        nullable=True,
    )
    average_rating = Column(Float, nullable=False, default=0)
    number_of_ratings = Column(Integer, nullable=False, default=0)
    total_rating = Column(Integer, nullable=False, default=0)
    reviews = relationship(
        "Review",
        secondary=reputation_review_association,
        back_populates="reputations",
    )

    def __init__(self, account_id, average_rating, number_of_ratings, total_rating):
        self.account_id = account_id
        self.average_rating = average_rating
        self.number_of_ratings = number_of_ratings
        self.total_rating = total_rating

    def __repr__(self):
        return f"<Reputation {self.account_id}>"

    def to_dict(self):
        return {
            "id": self.id,
            "account_id": self.account_id,
            "average_rating": self.average_rating,
            "number_of_ratings": self.number_of_ratings,
            "total_rating": self.total_rating,
        }


class CampaignReputation(Base):
    __tablename__ = "CampaignReputation"
    id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
    campaign_name = Column(
        Integer,
        ForeignKey("Campaign.name"),
        nullable=True,
    )
    average_rating = Column(Float, nullable=False, default=0)
    number_of_ratings = Column(Integer, nullable=False, default=0)
    total_rating = Column(Integer, nullable=False, default=0)
    campaign_reviews = relationship(
        "CampaignReview",
        secondary=campaign_reputation_campaign_review_association,
        back_populates="campaign_reputations",
    )

    def __init__(self, campaign_name, average_rating, number_of_ratings, total_rating):
        self.campaign_name = campaign_name
        self.average_rating = average_rating
        self.number_of_ratings = number_of_ratings
        self.total_rating = total_rating

    def __repr__(self):
        return f"<Reputation {self.campaign_name}>"

    def to_dict(self):
        return {
            "id": self.id,
            "campaign_id": self.campaign_name,
            "average_rating": self.average_rating,
            "number_of_ratings": self.number_of_ratings,
            "total_rating": self.total_rating,
        }


class CampaignReview(Base):
    __tablename__ = "CampaignReview"
    id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
    reviewer = Column(String(30), ForeignKey("Account.username"), nullable=False)
    campaign = Column(String(30), ForeignKey("Campaign.name"), nullable=False)
    message = Column(String(200), nullable=False)
    rating = Column(Integer, nullable=False, default=0)

    campaign_reputations = relationship(
        "CampaignReputation",
        secondary=campaign_reputation_campaign_review_association,
        back_populates="campaign_reviews",
    )

    def __init__(self, reviewer, campaign, message, rating):
        self.reviewer = reviewer
        self.campaign = campaign
        self.message = message
        self.rating = rating

    def __repr__(self):
        return f"<Review {self.id}>"

    def to_dict(self):
        return {
            "id": self.id,
            "reviewer": self.reviewer,
            "campaign": self.campaign,
            "message": self.message,
            "rating": self.rating,
        }


class Review(Base):
    __tablename__ = "Review"
    id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
    reviewer = Column(String(30), ForeignKey("Account.username"), nullable=False)
    reviewee = Column(String(30), ForeignKey("Account.username"), nullable=False)
    message = Column(String(200), nullable=False)
    rating = Column(Integer, nullable=False, default=0)

    reputations = relationship(
        "Reputation",
        secondary=reputation_review_association,
        back_populates="reviews",
    )

    def __init__(self, reviewer, reviewee, message, rating):
        self.reviewer = reviewer
        self.reviewee = reviewee
        self.message = message
        self.rating = rating

    def __repr__(self):
        return f"<Review {self.id}>"

    def to_dict(self):
        return {
            "id": self.id,
            "reviewer": self.reviewer,
            "reviewee": self.reviewee,
            "message": self.message,
            "rating": self.rating,
        }


class TradeListing(Base):
    __tablename__ = "TradeListing"
    id = Column(Integer, primary_key=True, autoincrement=True)
    initiator = Column(String, ForeignKey("Account.username"), nullable=False)
    target = Column(String, ForeignKey("Account.username"), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    is_successful = Column(Boolean, nullable=False, default=False)
    date_created = Column(
        DateTime,
        nullable=False,
        default=datetime.now(pytz.timezone("Australia/Sydney")),
    )
    date_completed = Column(DateTime, nullable=True)

    offered_collectibles = relationship(
        "Collectible",
        secondary=tradelisting_collectible_association_offered,
        back_populates="offered_listings",
        overlaps="requested_listings",
    )
    requested_collectibles = relationship(
        "Collectible",
        secondary=tradelisting_collectible_association_requested,
        back_populates="requested_listings",
        overlaps="offered_listings,offered_collectibles",
    )

    def __init__(
        self,
        initiator,
        target,
        is_active=True,
        is_successful=False,
    ):
        self.initiator = initiator
        self.target = target
        self.is_active = is_active
        self.is_successful = is_successful
        self.date_created = datetime.now(pytz.timezone("Australia/Sydney"))

    def __repr__(self):
        return f"<TradeListing {self.id!r}>"

    def to_dict(self):
        return {
            "id": self.id,
            "initiator": self.initiator,
            "target": self.target,
            "is_active": self.is_active,
            "is_successful": self.is_successful,
        }


class Tradable(Base):
    __tablename__ = "Tradable"
    id = Column(Integer, primary_key=True, autoincrement=True)
    account_id = Column(Integer, ForeignKey("Account.id"), nullable=False)
    number_of_items = Column(Integer, default=0)

    collectibles = relationship(
        "Collectible",
        secondary=tradable_collectible_association,
        back_populates="tradables",
    )

    def __init__(self, account_id, number_of_items):
        self.account_id = account_id
        self.number_of_items = number_of_items

    def __repr__(self):
        return f"<Tradable {self.id!r}>"

    def to_dict(self):
        return {
            "id": self.id,
            "account_id": self.account_id,
            "number_of_items": self.number_of_items,
        }


class Wishlist(Base):
    __tablename__ = "Wishlist"
    id = Column(Integer, primary_key=True, autoincrement=True)
    account_id = Column(Integer, ForeignKey("Account.id"), nullable=False)
    number_of_items = Column(Integer, default=0)

    collectibles = relationship(
        "Collectible",
        secondary=wishlist_collectible_association,
        back_populates="wishlists",
    )

    def __init__(self, account_id, number_of_items):
        self.account_id = account_id
        self.number_of_items = number_of_items

    def __repr__(self):
        return f"<Wishlist {self.id!r}>"

    def to_dict(self):
        return {
            "id": self.id,
            "account_id": self.account_id,
            "number_of_items": self.number_of_items,
        }


class Campaign(Base):
    __tablename__ = "Campaign"
    id = Column(Integer, primary_key=True, autoincrement=True)
    campaign_manager_id = Column(Integer, ForeignKey("Account.id"), nullable=False)
    campaign_manager_name = Column(
        String(30), ForeignKey("Account.username"), nullable=False
    )
    name = Column(String(30), nullable=False)
    description = Column(String(200), nullable=False)
    status = Column(String(30), nullable=False, default="Active")
    date_created = Column(
        DateTime,
        nullable=False,
        default=datetime.now(pytz.timezone("Australia/Sydney")),
    )
    date_archived = Column(DateTime, nullable=True)
    series_name = Column(String(50), ForeignKey("Series.name"), nullable=False)
    date_start = Column(DateTime, nullable=False)
    date_end = Column(DateTime, nullable=False)

    campaign_posts = relationship(
        "CampaignPost",
        secondary=campaign_campaign_post_association,
        back_populates="campaigns",
    )

    def __init__(
        self,
        campaign_manager_id,
        campaign_manager_name,
        name,
        description,
        status,
        series_name,
        date_start,
        date_end,
    ):
        self.campaign_manager_id = campaign_manager_id
        self.campaign_manager_name = campaign_manager_name
        self.name = name
        self.description = description
        self.status = status
        self.date_created = datetime.now(pytz.timezone("Australia/Sydney"))
        self.series_name = series_name
        self.date_start = date_start
        self.date_end = date_end

    def __repr__(self):
        return f"<Campaign {self.id!r}>"

    def to_dict(self):
        return {
            "id": self.id,
            "campaign_manager_id": self.campaign_manager_id,
            "campaign_manager_name": self.campaign_manager_name,
            "name": self.name,
            "status": self.status,
            "date_created": self.date_created,
            "series_name": self.series_name,
            "date_range": f"{self.date_start.strftime('%d/%m/%y')} - {self.date_end.strftime('%d/%m/%y')}",
            "description": self.description,
        }


class CampaignPost(Base):
    __tablename__ = "CampaignPost"
    id = Column(Integer, primary_key=True, autoincrement=True)
    author_username = Column(
        String(100), ForeignKey("Account.username"), nullable=False
    )
    post_title = Column(String(100), nullable=False)
    post_description = Column(String(200), nullable=False)
    time_created = Column(
        DateTime,
        nullable=False,
        default=datetime.now(pytz.timezone("Australia/Sydney")),
    )
    last_edited = Column(DateTime, nullable=True)

    campaigns = relationship(
        "Campaign",
        secondary=campaign_campaign_post_association,
        back_populates="campaign_posts",
    )

    def __init__(self, author_username, post_title, post_description):
        self.author_username = author_username
        self.post_title = post_title
        self.post_description = post_description
        self.time_created = datetime.now(pytz.timezone("Australia/Sydney"))

    def __repr__(self):
        return f"<CampaignPost {self.id!r}>"

    def to_dict(self):
        return {
            "id": self.id,
            "author_username": self.author_username,
            "post_title": self.post_title,
            "post_description": self.post_description,
            "time_created": self.time_created,
            "last_edited": self.last_edited,
        }


class Message(Base):
    __tablename__ = "Message"
    id = Column(Integer, primary_key=True, autoincrement=True)
    sender_id = Column(Integer, ForeignKey("Account.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("Account.id"), nullable=False)
    message = Column(String(200), nullable=False)
    timestamp = Column(
        DateTime,
        default=datetime.now(pytz.timezone("Australia/Sydney")),
        nullable=False,
    )

    conversations = relationship(
        "Conversation",
        secondary=message_conversation_association,
        back_populates="messages",
    )

    def __init__(self, sender_id, receiver_id, message):
        self.sender_id = sender_id
        self.receiver_id = receiver_id
        self.message = message
        self.timestamp = datetime.now(pytz.timezone("Australia/Sydney"))

    def __repr__(self):
        return f"<Message {self.id!r}>"

    def to_dict(self):
        return {
            "id": self.id,
            "sender_id": self.sender_id,
            "receiver_id": self.receiver_id,
            "message": self.message,
            "timestamp": self.timestamp,
        }


class Conversation(Base):
    __tablename__ = "Conversation"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user1_id = Column(Integer, ForeignKey("Account.id"), nullable=False)
    user2_id = Column(Integer, ForeignKey("Account.id"), nullable=False)
    unread = Column(String, default="", nullable=True)
    num_unread_messages = Column(Integer, default=0, nullable=True)
    messages = relationship(
        "Message",
        secondary=message_conversation_association,
        back_populates="conversations",
    )

    def __init__(self, user1_id, user2_id):
        self.user1_id = user1_id
        self.user2_id = user2_id

    def __repr__(self):
        return f"<Conversation {self.id!r}>"

    def to_dict(self):
        return {
            "id": self.id,
            "user1_id": self.user1_id,
            "user2_id": self.user2_id,
        }


class Recommended(Base):
    __tablename__ = "Recommended"
    id = Column(Integer, primary_key=True, autoincrement=True)
    account_id = Column(Integer, nullable=False)
    number_of_items = Column(Integer, nullable=False)

    def __init__(self, account_id, number_of_items):
        self.account_id = account_id
        self.number_of_items = number_of_items

    def __repr__(self):
        return f"<Conversation {self.id!r}>"

    def to_dict(self):
        return {
            "id": self.id,
            "account_id": self.account_id,
            "number_of_items": self.number_of_items,
        }
