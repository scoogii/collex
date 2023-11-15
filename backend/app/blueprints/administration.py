import logging

from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime

from flasgger import swag_from
from swagger_docs import admin_docs
from db import db_session
from blueprints.campaign import check_valid_account
from blueprints.trading import get_all_user_listings, get_users_account_id
from schema_models import (
    Account,
    Collection,
    Campaign,
    CampaignPost,
    Reputation,
    Review,
    TradeListing,
    Tradable,
    Wishlist,
    Campaign,
    CampaignPost,
    Message,
    Conversation,
)
from models.error_models import BackendException

# Logger
logger = logging.getLogger(__name__)

# -- Blueprint Definition -- #
bp = Blueprint("admin", __name__, url_prefix="/admin")


# -- Error Handlers -- #
@bp.errorhandler(BackendException)
def backend_exception(e):
    return jsonify(e.to_dict()), e.status_code


# -- ROUTES -- #
@bp.route("/search_users", methods=["GET"])
@swag_from(admin_docs.search_users)
def search_users():
    """
    Search for users
    """
    request_data = request.args
    username = request_data.get("username", "")

    # Get all users
    all_users = db_session.query(Account).filter_by(is_campaign_manager=0).all()
    matched_users = []
    for user in all_users:
        # If username is contained in the name of user
        # append to the matched_users list
        if username.lower() in (user.username).lower():
            matched_users.append(user.to_dict())

    return {"status": "success", "users": matched_users}


@bp.route("/search_campaign_managers", methods=["GET"])
@swag_from(admin_docs.search_campaign_managers)
def search_campaign_managers():
    """
    Search for campaign managers
    """
    request_data = request.args
    username = request_data.get("username", "")

    # Get all users
    all_users = db_session.query(Account).filter_by(is_campaign_manager=1).all()
    matched_users = []
    for user in all_users:
        # If username is contained in the name of user
        # append to the matched_users list
        if username.lower() in (user.username).lower():
            matched_users.append(user.to_dict())

    return {"status": "success", "users": matched_users}


@bp.route("/search_admins", methods=["GET"])
@swag_from(admin_docs.search_admins)
def search_admins():
    """
    Search for admins
    """
    request_data = request.args
    username = request_data.get("username", "")

    # Get all users
    all_users = db_session.query(Account).filter_by(is_admin=1).all()
    matched_users = []
    for user in all_users:
        # If username is contained in the name of user
        # append to the matched_users list
        if username.lower() in (user.username).lower():
            matched_users.append(user.to_dict())

    return {"status": "success", "users": matched_users}


@bp.route("/ban_user", methods=["POST"])
@swag_from(admin_docs.ban_user)
def ban_user():
    """
    Ban a user
    """
    request_data = request.args
    username = request_data.get("username")
    # Retrieve the user
    user = db_session.query(Account).filter_by(username=username).first()
    if not user:
        raise BackendException("User not found", status_code=404)

    # Delete the collections associated with the user
    db_session.query(Collection).filter_by(account_id=user.id).delete()
    # Delete the reputation associated with the user
    db_session.query(Reputation).filter_by(account_id=user.id).delete()
    # Delete the reviews associated with the user
    db_session.query(Review).filter_by(reviewer=user.username).delete()
    db_session.query(Review).filter_by(reviewee=user.username).delete()
    # Delete the trade listings associated with the user
    db_session.query(TradeListing).filter_by(initiator=user.username).delete()
    db_session.query(TradeListing).filter_by(target=user.username).delete()
    # Delete the tradables associated with the user
    db_session.query(Tradable).filter_by(account_id=user.id).delete()
    # Delete the wishlists associated with the user
    db_session.query(Wishlist).filter_by(account_id=user.id).delete()
    # Delete the messages associated with the user
    db_session.query(Message).filter_by(sender_id=user.id).delete()
    db_session.query(Message).filter_by(receiver_id=user.id).delete()
    # Delete the conversations associated with the user
    db_session.query(Conversation).filter_by(user1_id=user.id).delete()
    db_session.query(Conversation).filter_by(user2_id=user.id).delete()

    if user.is_campaign_manager:
        # Delete the campaign posts associated with the user
        db_session.query(CampaignPost).filter_by(author_username=user.username).delete()
        # Delete the campaigns associated with the user
        db_session.query(Campaign).filter_by(campaign_manager_id=user.id).delete()

    # Delete the user
    db_session.delete(user)
    db_session.commit()
    return {"status": "success", "message": "User successfully banned"}


@bp.route("/all_user_roles", methods=["GET"])
@swag_from(admin_docs.all_users_roles)
def all_users():
    """
    Get all users roles
    """
    users_dict = {
        "users": [],
        "campaign_managers": [],
        "administrators": [],
    }
    all_users = db_session.query(Account).all()
    for user in all_users:
        if user.is_admin == 1:
            users_dict["administrators"].append(user.to_dict())
        elif user.is_campaign_manager == 1:
            users_dict["campaign_managers"].append(user.to_dict())
        else:
            users_dict["users"].append(user.to_dict())

    return {"status": "success", "users": users_dict}


@bp.route("/set_user_as_administrator", methods=["POST"])
@swag_from(admin_docs.set_user_as_administrator)
def set_user_as_administrator():
    """
    Update a user's role to administrator
    """
    username = request.args.get("username")
    account = check_valid_account(username)

    if account.is_campaign_manager:
        campaigns = (
            db_session.query(Campaign).filter_by(campaign_manager_name=username).all()
        )
        for campaign in campaigns:
            for campaign_post in campaign.campaign_posts:
                db_session.delete(campaign_post)
                db_session.commit()
            db_session.delete(campaign)
            db_session.commit()

    if account.is_admin == 0:
        # Delete all their trades
        all_trade_listings = get_all_user_listings(username)
        trade_listings = all_trade_listings["initiated_listings"]
        trade_listings.extend(all_trade_listings["target_listings"])
        for trade_listing in trade_listings:
            db_session.delete(trade_listing)
            db_session.commit()

        # Delete collectibles in collection
        account_id = get_users_account_id(username)
        collection = (
            db_session.query(Collection).filter_by(account_id=account_id).first()
        )
        collection.number_of_items = 0
        for collectible in collection.collectibles:
            db_session.delete(collectible)
            db_session.commit()

        # Delete all tradable collectibles
        tradable = db_session.query(Tradable).filter_by(account_id=account_id).first()
        for collectible in tradable.collectibles:
            db_session.delete(collectible)
            db_session.commit()

        # Delete wishlist
        wishlist = db_session.query(Wishlist).filter_by(account_id=account_id).first()
        for collectible in wishlist.collectibles:
            db_session.delete(collectible)
            db_session.commit()
        wishlist.number_of_items = 0

    account.is_admin = 1
    account.is_campaign_manager = 0
    db_session.commit()
    return {"status": "successfully updated role"}


@bp.route("/set_user_as_campaign_manager", methods=["POST"])
@swag_from(admin_docs.set_user_as_campaign_manager)
def set_user_as_campaign_manager():
    """
    Update a user's role to campaign_manager
    """
    username = request.args.get("username")
    account = check_valid_account(username)
    account.is_admin = 0
    account.is_campaign_manager = 1
    db_session.commit()
    return {"status": "successfully updated role"}


@bp.route("/set_user_as_collector", methods=["POST"])
@swag_from(admin_docs.set_user_as_collector)
def set_user_as_collector():
    """
    Update a user's role to collector
    """
    username = request.args.get("username")
    account = check_valid_account(username)
    if account.is_campaign_manager:
        campaigns = (
            db_session.query(Campaign).filter_by(campaign_manager_name=username).all()
        )
        for campaign in campaigns:
            campaign.status = "Archived"
            campaign.date_archived = datetime.now()

    account.is_admin = 0
    account.is_campaign_manager = 0
    db_session.commit()
    return {"status": "successfully updated role"}
