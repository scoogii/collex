from flask import Blueprint, request, jsonify

from flasgger import swag_from

from swagger_docs import wishlist_docs
from models.error_models import BackendException

from db import db_session
from schema_models import Account, Wishlist, Collectible

bp = Blueprint("wishlist", __name__, url_prefix="/wishlist")


@bp.errorhandler(BackendException)
def backend_exception(e):
    return jsonify(e.to_dict()), e.status_code


# -- Helper Functions -- #
def get_users_wishlist_id(username: str):
    """
    Get the user's wishlist id
    """
    account = db_session.query(Account).filter_by(username=username).first()
    if account is None:
        raise BackendException(status_code=404, message="User not found")
    wishlist = db_session.query(Wishlist).filter_by(account_id=account.id).first()
    wishlist_id = wishlist.id
    return wishlist_id


@bp.route("/get_wishlist", methods=["GET"])
@swag_from(wishlist_docs.get_wishlist)
def get_wishlist():
    """
    Get the user's wishlist
    """
    request_data = request.args
    username = str(request_data.get("username"))
    wishlist_id = get_users_wishlist_id(username)

    wishlist = db_session.query(Wishlist).filter_by(id=wishlist_id).first()

    wishlist_data = {
        "account_id": wishlist.account_id,
        "number_of_items": wishlist.number_of_items,
        "collectibles": [
            collectible.to_dict() for collectible in wishlist.collectibles
        ],
    }
    return {"status": "success", "wishlist": wishlist_data}


@bp.route("/add_to_wishlist", methods=["POST"])
@swag_from(wishlist_docs.add_to_wishlist)
def add_to_wishlist():
    """
    Add a collectible to the user's wishlist
    """
    request_data = request.args
    username = str(request_data.get("username"))
    collectible_id = request_data.get("collectible_id")
    collectible = db_session.query(Collectible).filter_by(id=collectible_id).first()
    wishlist_id = get_users_wishlist_id(username)
    wishlist = db_session.query(Wishlist).filter_by(id=wishlist_id).first()

    if collectible in wishlist.collectibles:
        raise BackendException(
            status_code=422, message="Collectible already in wishlist"
        )
    wishlist.collectibles.append(collectible)
    wishlist.number_of_items += 1
    db_session.commit()

    return {"status": "success", "response": "Collectible added to wishlist"}


@bp.route("/remove_from_wishlist", methods=["POST"])
@swag_from(wishlist_docs.remove_from_wishlist)
def remove_from_wishlist():
    """
    Remove collectible from wishlist
    """
    request_data = request.args
    username = str(request_data.get("username"))
    collectible_id = request_data.get("collectible_id")
    collectible = db_session.query(Collectible).filter_by(id=collectible_id).first()
    wishlist_id = get_users_wishlist_id(username)
    wishlist = db_session.query(Wishlist).filter_by(id=wishlist_id).first()

    if collectible not in wishlist.collectibles:
        raise BackendException(status_code=422, message="Collectible not in wishlist")

    wishlist.collectibles.remove(collectible)
    wishlist.number_of_items -= 1
    db_session.commit()

    return {"status": "success", "response": "Collectible removed from wishlist"}
