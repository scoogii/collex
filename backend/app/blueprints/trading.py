import pytz
from flask import Blueprint, request, jsonify
from flasgger import swag_from
from datetime import datetime

from swagger_docs import trading_docs
from models.trading_models import InvalidTrade
from models.error_models import BackendException

from db import db_session
from blueprints.collection import get_users_collection_id

from schema_models import Account, Collectible, Collection, TradeListing, Tradable

from sqlalchemy import ColumnCollection, or_

# Blueprint definition
bp = Blueprint("trading", __name__, url_prefix="/trading")


# -- Error Handlers -- #
@bp.errorhandler(InvalidTrade)
def invalid_trade(e):
    return jsonify(e.to_dict()), e.status_code


@bp.errorhandler(BackendException)
def backend_exception(e):
    return jsonify(e.to_dict()), e.status_code


# -- Helper Functions -- #
def get_users_account_id(username: str):
    """
    Get the user's collection id
    """
    account = db_session.query(Account).filter_by(username=username).first()
    if account is None:
        raise BackendException(status_code=404, message="User not found")
    account_id = account.id
    return account_id


def check_trade_status(trade_id):
    """
    Check if items are still in both user's collection, if not invalidate the trade
    """
    # Get trade details
    trade_object = (
        db_session.query(TradeListing).filter_by(is_active=True, id=trade_id).first()
    )

    # Get both trader's collections
    initiator_id = get_users_collection_id(trade_object.initiator)
    target_id = get_users_collection_id(trade_object.target)

    initiator_collection = (
        db_session.query(Collection).filter_by(id=initiator_id).first()
    )
    target_collection = db_session.query(Collection).filter_by(id=target_id).first()

    if not all(
        collectible in initiator_collection.collectibles
        for collectible in trade_object.offered_collectibles
    ):
        trade_object.is_active = False
        db_session.commit()
        raise InvalidTrade("Collectibles no longer exist in initiator's inventory", 410)
    elif not all(
        collectible in target_collection.collectibles
        for collectible in target_collection.collectibles
    ):
        trade_object.is_active = False
        db_session.commit()
        raise InvalidTrade("Collectibles no longer exist in target's inventory", 410)


def get_all_user_listings(username):
    initiated_listings = (
        db_session.query(TradeListing)
        .filter_by(initiator=username, is_active=True)
        .all()
    )
    target_listings = (
        db_session.query(TradeListing).filter_by(target=username, is_active=True).all()
    )
    return {
        "initiated_listings": initiated_listings,
        "target_listings": target_listings,
    }


def return_valid_trade_listings(username):
    """
    Check the user does not have requested/offerred collectibles in their collection,
    If so, delete the trades containing them and return the valid trade listings
    """

    # Get collection_id
    collection_id = get_users_collection_id(username)
    collection = db_session.query(Collection).filter_by(id=collection_id).first()
    collection_collectibles = collection.collectibles

    user_trade_listings = get_all_user_listings(username)
    remove_trades_leading_to_duplicates(collection_collectibles, user_trade_listings)
    remove_trades_with_untradable_collectibles(username, user_trade_listings)


def remove_trades_leading_to_duplicates(collection_collectibles, user_trade_listings):
    # Remove trade if the offered collectible results in duplicate
    for trade_listing in user_trade_listings["initiated_listings"]:
        # Get target user's collectibles
        target_username = trade_listing.target
        target_collection_id = get_users_collection_id(str(target_username))
        target_collection = (
            db_session.query(Collection).filter_by(id=target_collection_id).first()
        )
        # Check initiator's collection
        if any(
            collectible in collection_collectibles
            for collectible in trade_listing.requested_collectibles
        ):
            db_session.delete(trade_listing)
            db_session.commit()
        # Check target's collection
        elif any(
            collectible in target_collection.collectibles
            for collectible in trade_listing.offered_collectibles
        ):
            db_session.delete(trade_listing)
            db_session.commit()

    # Remove trade if the requested collectible results in duplicate
    for trade_listing in user_trade_listings["target_listings"]:
        # Get initiator user's collectibles
        initiator_username = trade_listing.initiator
        initiator_collection_id = get_users_collection_id(str(initiator_username))
        initiator_collection = (
            db_session.query(Collection).filter_by(id=initiator_collection_id).first()
        )
        # Check initiator's collection
        if any(
            collectible in initiator_collection.collectibles
            for collectible in trade_listing.requested_collectibles
        ):
            db_session.delete(trade_listing)
            db_session.commit()
        # Check target's collection
        elif any(
            collectible in collection_collectibles
            for collectible in trade_listing.offered_collectibles
        ):
            db_session.delete(trade_listing)
            db_session.commit()


def remove_trades_with_untradable_collectibles(username, user_trade_listings):
    # Get all tradables
    account_id = get_users_account_id(username)
    user_tradable = db_session.query(Tradable).filter_by(account_id=account_id).first()
    user_tradable_collectibles = user_tradable.collectibles

    # For all trades where they are the initiator
    for trade_listing in user_trade_listings["initiated_listings"]:
        # Get target's tradables
        target_username = trade_listing.target
        target_account_id = get_users_account_id(target_username)
        target_tradable = (
            db_session.query(Tradable).filter_by(account_id=target_account_id).first()
        )
        if not all(
            collectible in user_tradable_collectibles
            for collectible in trade_listing.offered_collectibles
        ):
            db_session.delete(trade_listing)
            db_session.commit()
        elif not all(
            collectible in target_tradable.collectibles
            for collectible in trade_listing.requested_collectibles
        ):
            db_session.delete(trade_listing)
            db_session.commit()

    # For all trades where they are the target
    for trade_listing in user_trade_listings["target_listings"]:
        # Get initiator tradables
        initiator_username = trade_listing.initiator
        initiator_account_id = get_users_account_id(initiator_username)
        initiator_tradable = (
            db_session.query(Tradable)
            .filter_by(account_id=initiator_account_id)
            .first()
        )
        if not all(
            # Check target user's tradables
            collectible in user_tradable_collectibles
            for collectible in trade_listing.requested_collectibles
        ):
            db_session.delete(trade_listing)
            db_session.commit()
        elif not all(
            # Check initiator user's tradables
            collectible in initiator_tradable.collectibles
            for collectible in trade_listing.offered_collectibles
        ):
            db_session.delete(trade_listing)
            db_session.commit()


# -- Routes -- #
@bp.route("/get_trade_listing", methods=["GET"])
@swag_from(trading_docs.get_trade_listing)
def get_trade_listing():
    """
    Get a trade listing
    """
    request_data = request.args
    trade_id = request_data.get("trade_id")

    trade_listing = db_session.query(TradeListing).filter_by(id=trade_id).first()
    if trade_listing is None:
        raise InvalidTrade("Trade with the following id does not exist", 401)

    trade_listing_data = {
        "id": trade_listing.id,
        "initiator": trade_listing.initiator,
        "target": trade_listing.target,
        "is_active": trade_listing.is_active,
        "date_created": trade_listing.date_created.strftime("%c"),
        "offered_collectibles": [
            collectible.to_dict() for collectible in trade_listing.offered_collectibles
        ],
        "requested_collectibles": [
            collectible.to_dict()
            for collectible in trade_listing.requested_collectibles
        ],
    }
    if trade_listing.date_completed:
        trade_listing_data["date_completed"] = trade_listing.date_completed.strftime(
            "%c"
        )

    return {"status": "success", "trade_listing": trade_listing_data}


@bp.route("/create_trade_listing", methods=["POST"])
@swag_from(trading_docs.create_trade_listing)
def create_trade_listing():
    """
    Create a trade listing
    """
    request_data = request.get_json()
    if request_data is None:
        return "No information in body"

    initiator_username = str(request_data.get("initiator_username"))
    initiator_id = get_users_account_id(initiator_username)
    target_username = request_data.get("target_username")
    target_id = get_users_account_id(target_username)
    target_collection = db_session.query(Collection).filter_by(id=target_id).first()
    initiator_collection = (
        db_session.query(Collection).filter_by(id=initiator_id).first()
    )
    offered_collectible_ids = request_data.get("offered_collectible_ids")
    requested_collectible_ids = request_data.get("requested_collectible_ids")
    # Check if initiator and target are the same
    if initiator_id == target_id:
        raise InvalidTrade("Cannot trade with yourself", 422)

    # Get initiator tradables
    initiator_tradable = (
        db_session.query(Tradable).filter_by(account_id=initiator_id).first()
    )
    # Check if the initiator has the offered collectibles
    for offered_collectible in offered_collectible_ids:
        offered_collectible_id = int(offered_collectible)
        offered_collectible = (
            db_session.query(Collectible).filter_by(id=offered_collectible_id).first()
        )
        if offered_collectible not in initiator_collection.collectibles:
            raise InvalidTrade(
                "Initiator does not have one of the offered collectibles", 422
            )
        elif offered_collectible not in initiator_tradable.collectibles:
            raise InvalidTrade("Offered collectible is not tradable", 422)

    # Get target tradables
    target_tradable = db_session.query(Tradable).filter_by(account_id=target_id).first()
    # Check if the target has the requested collectibles
    for requested_collectible in requested_collectible_ids:
        requested_collectible_id = int(requested_collectible)
        requested_collectible = (
            db_session.query(Collectible).filter_by(id=requested_collectible_id).first()
        )
        if requested_collectible not in target_collection.collectibles:
            raise InvalidTrade(
                "Target does not have one of the requested collectibles", 422
            )
        elif requested_collectible not in target_tradable.collectibles:
            raise InvalidTrade("Requested collectible is not tradable", 422)

    # Check if target already has any of the offered collectibles
    for offered_collectible in offered_collectible_ids:
        offered_collectible_id = int(offered_collectible)
        offered_collectible = (
            db_session.query(Collectible).filter_by(id=offered_collectible_id).first()
        )
        if offered_collectible in target_collection.collectibles:
            raise InvalidTrade(
                "Target already has one of the offered collectibles", 422
            )

    # Check if initiator already has any of the requested collectibles
    for requested_collectible in requested_collectible_ids:
        requested_collectible_id = int(requested_collectible)
        requested_collectible = (
            db_session.query(Collectible).filter_by(id=requested_collectible_id).first()
        )
        if requested_collectible in initiator_collection.collectibles:
            raise InvalidTrade(
                "Initiator already has one of the requested collectibles", 422
            )

    # Create the trade listing
    offered_collectibles = []
    for offered_collectible in offered_collectible_ids:
        offered_collectible_id = int(offered_collectible)
        offered_collectible = (
            db_session.query(Collectible).filter_by(id=offered_collectible_id).first()
        )
        offered_collectibles.append(offered_collectible)
    requested_collectibles = []
    for requested_collectible in requested_collectible_ids:
        requested_collectible_id = int(requested_collectible)
        requested_collectible = (
            db_session.query(Collectible).filter_by(id=requested_collectible_id).first()
        )
        requested_collectibles.append(requested_collectible)

    trade_listing = TradeListing(initiator_username, target_username, True, False)
    trade_listing.offered_collectibles.extend(offered_collectibles)
    trade_listing.requested_collectibles.extend(requested_collectibles)

    db_session.add(trade_listing)
    db_session.commit()

    trade_listing_data = {
        "id": trade_listing.id,
        "initiator": trade_listing.initiator,
        "target": trade_listing.target,
        "is_active": trade_listing.is_active,
        "date_created": trade_listing.date_created.strftime("%c"),
        "offered_collectibles": [
            collectible.to_dict() for collectible in trade_listing.offered_collectibles
        ],
        "requested_collectibles": [
            collectible.to_dict()
            for collectible in trade_listing.requested_collectibles
        ],
    }

    return {"status": "success", "trade_listing": trade_listing_data}


@bp.route("/get_open_trade_listings", methods=["GET"])
@swag_from(trading_docs.get_open_trade_listings)
def get_open_trade_listings():
    """
    Get an account's open trade listings
    """
    request_data = request.args
    username = str(request_data.get("username"))
    listing_type = request_data.get("listing_type")
    return_valid_trade_listings(username)

    # Check trade status
    if listing_type == "outgoing":
        trade_listings = db_session.query(TradeListing).filter_by(
            is_active=True, initiator=username
        )

    elif listing_type == "incoming":
        trade_listings = db_session.query(TradeListing).filter_by(
            is_active=True, target=username
        )
    else:
        raise InvalidTrade("Invalid listing type", 404)

    open_trade_listings = [
        {
            "id": trade_listing.id,
            "initiator": trade_listing.initiator,
            "target": trade_listing.target,
            "is_active": trade_listing.is_active,
            "date_created": trade_listing.date_created.strftime("%c"),
            "offered_collectibles": [
                collectible.to_dict()
                for collectible in trade_listing.offered_collectibles
            ],
            "requested_collectibles": [
                collectible.to_dict()
                for collectible in trade_listing.requested_collectibles
            ],
        }
        for trade_listing in trade_listings
    ]
    # Sort the list of open trade listings by date created
    open_trade_listings.sort(key=lambda x: x["date_created"], reverse=True)

    trade_listings_data = {
        "trade_listings": open_trade_listings,
        "number_of_trade_listings": len(open_trade_listings),
    }

    return {"status": "success", "trade_listings": trade_listings_data}


@bp.route("/get_historical_trade_listings", methods=["GET"])
@swag_from(trading_docs.get_historical_trade_listings)
def get_historical_trade_listings():
    """
    Get historical trade listings
    """
    request_data = request.args
    username = request_data.get("username")
    initiated_trade_listings = (
        db_session.query(TradeListing)
        .filter_by(is_active=False, initiator=username)
        .all()
    )
    received_trade_listings = (
        db_session.query(TradeListing).filter_by(is_active=False, target=username).all()
    )
    all_trade_listings = initiated_trade_listings + received_trade_listings
    historical_trade_listings = [
        {
            "id": trade_listing.id,
            "initiator": trade_listing.initiator,
            "target": trade_listing.target,
            "is_active": trade_listing.is_active,
            "is_successful": trade_listing.is_successful,
            "date_created": trade_listing.date_created.strftime("%c"),
            "date_completed": trade_listing.date_completed.strftime("%c"),
            "offered_collectibles": [
                collectible.to_dict()
                for collectible in trade_listing.offered_collectibles
            ],
            "requested_collectibles": [
                collectible.to_dict()
                for collectible in trade_listing.requested_collectibles
            ],
        }
        for trade_listing in all_trade_listings
    ]

    # Sort the trade listings by date created
    historical_trade_listings.sort(key=lambda x: x["date_created"], reverse=True)

    historical_trade_listings_data = {
        "trade_listings": historical_trade_listings,
        "number_of_trade_listings": len(historical_trade_listings),
    }

    return {"status": "success", "trade_listings": historical_trade_listings_data}


@bp.route("/remove_trade_listing", methods=["POST"])
@swag_from(trading_docs.remove_trade_listing)
def remove_trade_listing():
    """
    Remove a trade listing
    """
    request_data = request.args
    trade_id = request_data.get("trade_id")

    trade_listing = db_session.query(TradeListing).filter_by(id=trade_id).first()
    if trade_listing is None:
        raise InvalidTrade("Trade with the following id does not exist", 401)

    if (trade_listing.is_successful == True) or (
        trade_listing.is_successful == False and trade_listing.is_active == False
    ):
        raise InvalidTrade("Cannot cancel a processed trade", 422)

    db_session.delete(trade_listing)
    db_session.commit()

    return {"status": "success", "message": "Trade listing successfully removed"}


@bp.route("/decline_trade", methods=["POST"])
@swag_from(trading_docs.decline_trade)
def decline_trade():
    """
    Decline a trade
    """
    request_data = request.args
    trade_id = request_data.get("trade_id")

    trade_listing = db_session.query(TradeListing).filter_by(id=trade_id).first()
    if trade_listing is None:
        raise InvalidTrade("Trade with the following id does not exist", 401)

    trade_listing.is_active = False
    trade_listing.is_successful = False
    trade_listing.date_completed = datetime.now(pytz.timezone("Australia/Sydney"))
    db_session.commit()

    return {"status": "success", "message": "Trade listing successfully declined"}


@bp.route("/complete_trade", methods=["POST"])
@swag_from(trading_docs.complete_trade)
def complete_trade():
    """
    Complete trade
    """
    request_data = request.args
    trade_id = request_data.get("trade_id")
    trade_listing = db_session.query(TradeListing).filter_by(id=trade_id).first()

    if trade_listing is None:
        raise InvalidTrade("Trade with the following id does not exist", 401)

    check_trade_status(trade_id)
    trade_listing.is_active = False
    trade_listing.is_successful = True
    trade_listing.date_completed = datetime.now(pytz.timezone("Australia/Sydney"))
    db_session.commit()

    initiator_account = (
        db_session.query(Account).filter_by(username=trade_listing.initiator).first()
    )
    target_account = (
        db_session.query(Account).filter_by(username=trade_listing.target).first()
    )
    initiator_collection = (
        db_session.query(Collection).filter_by(account_id=initiator_account.id).first()
    )
    target_collection = (
        db_session.query(Collection).filter_by(account_id=target_account.id).first()
    )
    initiator_tradable = (
        db_session.query(Tradable).filter_by(account_id=initiator_account.id).first()
    )
    target_tradable = (
        db_session.query(Tradable).filter_by(account_id=target_account.id).first()
    )

    for collectible in trade_listing.offered_collectibles:
        initiator_collection.collectibles.remove(collectible)
        target_collection.collectibles.append(collectible)
        initiator_tradable.collectibles.remove(collectible)
        trade_listings = (
            db_session.query(TradeListing)
            .filter(
                or_(
                    TradeListing.offered_collectibles.any(id=collectible.id),
                    TradeListing.requested_collectibles.any(id=collectible.id),
                )
            )
            .all()
        )
        for offered_trade_listing in trade_listings:
            # Delete the trade listing
            if (
                offered_trade_listing != trade_listing
                and offered_trade_listing.is_active == True
            ):
                db_session.delete(offered_trade_listing)

    for collectible in trade_listing.requested_collectibles:
        initiator_collection.collectibles.append(collectible)
        target_collection.collectibles.remove(collectible)
        target_tradable.collectibles.remove(collectible)
        trade_listings = (
            db_session.query(TradeListing)
            .filter(
                or_(
                    TradeListing.offered_collectibles.any(id=collectible.id),
                    TradeListing.requested_collectibles.any(id=collectible.id),
                )
            )
            .all()
        )
        for requested_trade_listing in trade_listings:
            # Delete the trade listing
            if (
                requested_trade_listing != trade_listing
                and requested_trade_listing.is_active == True
            ):
                db_session.delete(trade_listing)

    db_session.commit()

    return {"status": "success", "message": "Trade successfully completed"}


@bp.route("/get_collectible_trade_listings", methods=["GET"])
@swag_from(trading_docs.get_collectible_trade_listings)
def get_collectible_trade_listings():
    """
    Get collectible trade listings
    """
    request_data = request.args
    collectible_id = int(request_data.get("collectible_id"))
    listing_type = request_data.get("listing_type")

    if listing_type == "offered":
        trade_listings = (
            db_session.query(TradeListing)
            .filter(TradeListing.offered_collectibles.any(id=collectible_id))
            .all()
        )
    elif listing_type == "requested":
        trade_listings = (
            db_session.query(TradeListing)
            .filter(TradeListing.requested_collectibles.any(id=collectible_id))
            .all()
        )
    else:
        raise InvalidTrade("Invalid listing type", 404)

    collectible_trade_listings = [
        {
            "id": trade_listing.id,
            "initiator": trade_listing.initiator,
            "target": trade_listing.target,
            "is_active": trade_listing.is_active,
            "date_created": trade_listing.date_created.strftime("%c"),
            "offered_collectibles": [
                collectible.to_dict()
                for collectible in trade_listing.offered_collectibles
            ],
            "requested_collectibles": [
                collectible.to_dict()
                for collectible in trade_listing.requested_collectibles
            ],
        }
        for trade_listing in trade_listings
    ]
    # Sort the trade listings by created date
    collectible_trade_listings.sort(key=lambda x: x["date_created"], reverse=True)

    collectible_trade_listings_data = {
        "trade_listings": collectible_trade_listings,
        "number_of_trade_listings": len(collectible_trade_listings),
    }

    return {"status": "success", "trade_listings": collectible_trade_listings_data}
