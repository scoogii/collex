from flask import Blueprint, request, jsonify

from flasgger import swag_from
from blueprints.reputation import get_users_account_id

from swagger_docs import collection_docs
from models.error_models import BackendException

from db import db_session
from schema_models import Account, Collection, Collectible, Tradable, Series, Wishlist

# Blueprint definition
bp = Blueprint("collection", __name__, url_prefix="/collection")


@bp.errorhandler(BackendException)
def backend_exception(e):
    return jsonify(e.to_dict()), e.status_code


# -- Helper Functions -- #
def get_users_collection_id(username: str):
    """
    Get the user's collection id
    """
    account = db_session.query(Account).filter_by(username=username).first()
    if account is None:
        raise BackendException(status_code=404, message="User not found")
    collection = db_session.query(Collection).filter_by(account_id=account.id).first()
    collection_id = collection.id
    return collection_id


# -- Routes -- #
@bp.route("/get_collection", methods=["GET"])
@swag_from(collection_docs.get_collection)
def get_collection():
    """
    Get the current user's collection
    """
    request_data = request.args
    username = str(request_data.get("username"))

    # Retrieve the user's collection id
    collection_id = get_users_collection_id(username)
    # Retrieve all collectibles in the user's collection
    collection = db_session.query(Collection).filter_by(id=collection_id).first()
    collection_data = {
        "account_id": collection.account_id,
        "number_of_items": collection.number_of_items,
        "collectibles": [
            collectible.to_dict() for collectible in collection.collectibles
        ],
    }
    return {"status": "success", "collection": collection_data}


@bp.route("/add_collectible_to_collection", methods=["POST"])
@swag_from(collection_docs.add_collectible_to_collection)
def add_collectible_to_collection():
    """
    Given an account_id and a collectible id, add the collectible to the user's collection
    """
    request_data = request.args
    username = str(request_data.get("username"))
    collectible_id = request_data.get("collectible_id")

    collection_id = get_users_collection_id(username)
    collection = db_session.query(Collection).filter_by(id=collection_id).first()
    collectible = db_session.query(Collectible).filter_by(id=collectible_id).first()
    if collectible in collection.collectibles:
        raise BackendException(
            status_code=422, message="Collectible is already in the user's collection"
        )
    account_id = get_users_account_id(username)
    wishlist = db_session.query(Wishlist).filter_by(account_id=account_id).first()
    if collectible in wishlist.collectibles:
        wishlist.collectibles.remove(collectible)
        wishlist.number_of_items -= 1

    # Increment the number_of_items in Collection
    collection.number_of_items += 1
    # Insert the collectible into the database
    collection.collectibles.append(collectible)
    db_session.commit()

    response_data = {"status": "success", "response": "Collectible added to collection"}
    return response_data


@bp.route("/remove_collectible_from_collection", methods=["POST"])
@swag_from(collection_docs.remove_collectible_from_collection)
def remove_collectible_from_collection():
    """
    Given a username and a collectible id, remove a collectible from the user's collection
    """
    request_data = request.args

    # Get account_id and collectible_id
    username = str(request_data.get("username"))
    collectible_id = request_data.get("collectible_id")

    # Get the user's collection_id
    collection_id = get_users_collection_id(username)
    collection = db_session.query(Collection).filter_by(id=collection_id).first()
    # Check if the collectible is in the user's collection
    collectible = db_session.query(Collectible).filter_by(id=collectible_id).first()
    if collectible not in collection.collectibles:
        raise BackendException(status_code=422, message="Collectible not in collection")

    # Remove the collectible from the database
    collection.collectibles.remove(collectible)
    collection.number_of_items -= 1
    db_session.commit()

    # Remove the collectible from the tradable collection if it is in there
    tradable = (
        db_session.query(Tradable).filter_by(account_id=collection.account_id).first()
    )
    if collectible in tradable.collectibles:
        tradable.collectibles.remove(collectible)
        tradable.number_of_items -= 1
        db_session.commit()

    response_data = {
        "status": "success",
        "response": "Collectible removed from collection",
    }
    return response_data


@bp.route("/get_tradable", methods=["GET"])
@swag_from(collection_docs.get_tradable)
def get_tradable():
    """
    Given a username, get the user's tradable collectibles
    """
    request_data = request.args
    username = request_data.get("username")

    account = db_session.query(Account).filter_by(username=username).first()
    account_id = account.id
    tradable = db_session.query(Tradable).filter_by(account_id=account_id).first()

    tradable_data = {
        "account_id": tradable.account_id,
        "number_of_items": tradable.number_of_items,
        "collectibles": [
            collectible.to_dict() for collectible in tradable.collectibles
        ],
    }
    return {
        "status": "success",
        "tradable": tradable_data,
    }


@bp.route("/get_is_tradable", methods=["GET"])
@swag_from(collection_docs.get_is_tradable)
def get_is_tradable():
    """
    Given a username and a collectible_id, check if the collectible is tradable
    """
    request_data = request.args
    username = request_data.get("username")
    collectible_id = request_data.get("collectible_id")
    account = db_session.query(Account).filter_by(username=username).first()
    account_id = account.id
    collection = db_session.query(Collection).filter_by(account_id=account_id).first()
    tradable = db_session.query(Tradable).filter_by(account_id=account_id).first()
    collectible = db_session.query(Collectible).filter_by(id=collectible_id).first()
    if collectible not in collection.collectibles:
        raise BackendException(
            status_code=422, message="Collectible is not in the user's collection"
        )

    is_collectible_tradable = False
    if collectible in tradable.collectibles:
        is_collectible_tradable = True

    return {
        "status": "success",
        "is_collectible_tradable": is_collectible_tradable,
    }


@bp.route("/add_as_tradable", methods=["PUT"])
@swag_from(collection_docs.add_as_tradable)
def add_as_tradable():
    """
    Given a username and a collectible_id, add the collectible as tradable
    """
    request_data = request.args
    username = request_data.get("username")
    collectible_id = request_data.get("collectible_id")
    account = db_session.query(Account).filter_by(username=username).first()
    account_id = account.id
    collection = db_session.query(Collection).filter_by(account_id=account_id).first()
    tradable = db_session.query(Tradable).filter_by(account_id=account_id).first()
    collectible = db_session.query(Collectible).filter_by(id=collectible_id).first()
    if collectible not in collection.collectibles:
        raise BackendException(
            status_code=422, message="Collectible is not in the user's collection"
        )
    if collectible in tradable.collectibles:
        raise BackendException(
            status_code=422, message="Collectible is already tradable"
        )

    tradable.collectibles.append(collectible)
    tradable.number_of_items += 1
    db_session.commit()

    return {
        "status": "success",
        "response": "Collectible has been added as tradable",
    }


@bp.route("/remove_as_tradable", methods=["PUT"])
@swag_from(collection_docs.remove_as_tradable)
def remove_as_tradable():
    """
    Given a username and a collectible_id, remove the collectible as tradable
    """
    request_data = request.args
    username = request_data.get("username")
    collectible_id = request_data.get("collectible_id")
    account = db_session.query(Account).filter_by(username=username).first()
    account_id = account.id
    collection = db_session.query(Collection).filter_by(account_id=account_id).first()
    tradable = db_session.query(Tradable).filter_by(account_id=account_id).first()
    collectible = db_session.query(Collectible).filter_by(id=collectible_id).first()
    if collectible not in collection.collectibles:
        raise BackendException(
            status_code=422, message="Collectible is not in the user's collection"
        )
    if collectible not in tradable.collectibles:
        raise BackendException(status_code=422, message="Collectible is not tradable")

    tradable.collectibles.remove(collectible)
    tradable.number_of_items -= 1
    db_session.commit()

    return {
        "status": "success",
        "response": "Collectible has been removed as tradable",
    }


@bp.route("/retrieve_progress", methods=["GET"])
@swag_from(collection_docs.retrieve_progress)
def retrieve_progress():
    """
    Retrieve a user's progress in each collectible series
    """
    request_data = request.args
    username = request_data.get("username")
    series_id = int(request_data.get("series_id"))
    account = db_session.query(Account).filter_by(username=username).first()
    account_id = account.id
    collection = db_session.query(Collection).filter_by(account_id=account_id).first()
    collectibles = [
        collectible.to_dict()
        for collectible in collection.collectibles
        if collectible.series_id == series_id
    ]
    series = db_session.query(Series).filter_by(id=series_id).first()

    progress = {
        "total_number_collected": len(collectibles),
        "total_number_of_collectibles": series.total_number_of_collectibles,
        "percentage_collected": f"{len(collectibles) / series.total_number_of_collectibles * 100:.1f}",
        "series_name": series.name,
    }

    return {"status": "success", "progress": progress}


@bp.route("/get_user_level", methods=["GET"])
@swag_from(collection_docs.get_user_level)
def get_user_level():
    """
    Get a user's level
    """
    request_data = request.args
    username = request_data.get("username")
    account_id = db_session.query(Account).filter_by(username=username).first().id

    # Get the user's collection
    collection = db_session.query(Collection).filter_by(account_id=account_id).first()
    user_collectibles = collection.collectibles
    number_of_collectibles = len(user_collectibles)
    level = number_of_collectibles // 2
    return {"status": "success", "level": level}
