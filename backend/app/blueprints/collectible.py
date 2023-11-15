import random
from flask import Blueprint, request, jsonify
from flasgger import swag_from
from db import db_session
from schema_models import Collectible, Series
from swagger_docs import collectible_docs
from models.error_models import BackendException


bp = Blueprint("collectible", __name__, url_prefix="/collectible")


@bp.errorhandler(BackendException)
def backend_exception(e):
    return jsonify(e.to_dict()), e.status_code


@bp.route("/get_all_collectibles_and_series", methods=["GET"])
@swag_from(collectible_docs.get_all_collectibles_and_series)
def get_all_collectibles_and_series():
    """
    Get all collectibles in every series
    """

    # Get series
    all_series = db_session.query(Series).all()
    providers_dict = {"Woolworths": [], "Coles": []}
    for series in all_series:
        collectibles = (
            db_session.query(Collectible).filter_by(series_id=series.id).all()
        )
        series_dict = {
            "series_name": series.name,
            "collectibles": [collectible.to_dict() for collectible in collectibles],
        }
        if str(series.provider) == "Woolworths":
            providers_dict["Woolworths"].append(series_dict)
        elif str(series.provider) == "Coles":
            providers_dict["Coles"].append(series_dict)

    return providers_dict


@bp.route("/get_all_collectibles", methods=["GET"])
@swag_from(collectible_docs.get_all_collectibles)
def get_all_collectibles():
    """
    Get all collectibles available
    """

    collectibles = db_session.query(Collectible).all()

    return {
        "status": "success",
        "collectibles": [collectible.to_dict() for collectible in collectibles],
    }


@bp.route("/get_trending_collectibles", methods=["GET"])
@swag_from(collectible_docs.get_trending_collectibles)
def get_trending_collectibles():
    """
    Get all trending collectibles available
    """

    collectibles = db_session.query(Collectible).all()
    trending = random.sample(range(1, len(collectibles) + 1), 10)
    trending_collectibles = []
    for index in trending:
        trending_collectibles.append(collectibles[index - 1].to_dict())
    return {
        "status": "success",
        "collectibles": trending_collectibles,
    }


@bp.route("/get_new_collectibles", methods=["GET"])
@swag_from(collectible_docs.get_new_collectibles)
def get_new_collectibles():
    """
    Get new collectibles available
    """

    collectibles = db_session.query(Collectible).all()
    new_collectibles = collectibles[-10:]
    return {
        "status": "success",
        "collectibles": [collectible.to_dict() for collectible in new_collectibles],
    }


@bp.route("/get_all_collectible_names", methods=["GET"])
@swag_from(collectible_docs.get_all_collectibles)
def get_all_collectibles_names():
    """
    Get all collectibles available
    """

    collectibles = db_session.query(Collectible).all()

    return {
        "status": "success",
        "collectibles": [collectible.name for collectible in collectibles],
    }


@bp.route("/get_collectible", methods=["GET"])
@swag_from(collectible_docs.get_collectible)
def get_collectible():
    """
    Get a collectible by name
    """
    collectible_name = request.args.get("collectible_name")

    collectible = db_session.query(Collectible).filter_by(name=collectible_name).first()

    return {"status": "success", "collectible": collectible.to_dict()}


@bp.route("/add_collectible", methods=["POST"])
@swag_from(collectible_docs.add_collectible)
def add_collectible():
    """
    Add a collectible to the database
    """

    # Get the collectible information
    request_data = request.get_json()
    name = request_data.get("name")
    rarity = request_data.get("rarity")
    series_id = request_data.get("series_id")
    image_id = request_data.get("image_id")

    try:
        # Add the collectible to the database
        collectible = Collectible(name, rarity, image_id, series_id)
        db_session.add(collectible)
        db_session.commit()

        return {"status": "success", "collectible": collectible.to_dict()}
    except Exception:
        raise BackendException(
            f"A collectible already exists with name: {name}", status_code=403
        )


@bp.route("/remove_collectible", methods=["PUT"])
@swag_from(collectible_docs.remove_collectible)
def remove_collectible():
    """
    Remove a collectible from the database
    """
    # Get the collectible information
    request_data = request.args
    collectible_id = request_data.get("collectible_id")

    # Remove the collectible from the database
    db_session.query(Collectible).filter_by(id=collectible_id).delete()
    db_session.commit()

    return {"status": "success"}


@bp.route("/get_all_series", methods=["GET"])
@swag_from(collectible_docs.get_all_series)
def get_all_series():
    """
    Get all the series available
    """
    series = db_session.query(Series).all()

    return {
        "status": "success",
        "series": [series.to_dict() for series in series],
    }


@bp.route("/get_series", methods=["GET"])
@swag_from(collectible_docs.get_series)
def get_series():
    """
    Get a series by id
    """
    series_id = request.args.get("series_id")

    series = db_session.query(Series).filter_by(id=series_id).first()
    series_collectibles = (
        db_session.query(Collectible).filter_by(series_id=series_id).all()
    )
    series_dict = {
        "id": series.id,
        "name": series.name,
        "provider": series.provider,
        "total_number_of_collectibles": series.total_number_of_collectibles,
        "collectibles": [collectible.to_dict() for collectible in series_collectibles],
    }

    return {"status": "success", "series": series_dict}


@bp.route("/get_series_by_collectible", methods=["GET"])
@swag_from(collectible_docs.get_series_by_collectible)
def get_series_by_collectible():
    """
    Get series by collectible_id
    """

    collectible_id = request.args.get("collectible_id")
    collectible = db_session.query(Collectible).filter_by(id=collectible_id).first()
    series = db_session.query(Series).filter_by(id=collectible.series_id).first()

    return {"status": "success", "series": series.to_dict()}


@bp.route("/add_series", methods=["POST"])
@swag_from(collectible_docs.add_series)
def add_series():
    """
    Add a series to the database
    """
    # Get the series information from the request data
    request_data = request.get_json()
    name = request_data.get("name")
    provider = request_data.get("provider")
    total_number_of_collectibles = request_data.get("total_number_of_collectibles")

    # Add the series to the database
    series = Series(name, provider, total_number_of_collectibles)
    db_session.add(series)
    db_session.commit()

    return {"status": "success", "series": series.to_dict()}


@bp.route("/remove_series", methods=["PUT"])
@swag_from(collectible_docs.remove_series)
def remove_series():
    """
    Remove a series from the database
    """
    # Get the series information from the request data
    request_data = request.args
    series_id = request_data.get("series_id")

    # Remove the series from the database
    db_session.query(Series).filter_by(id=series_id).delete()
    db_session.commit()

    return {"status": "success"}


@bp.route("/update_rarity_value", methods=["PUT"])
@swag_from(collectible_docs.update_rarity_value)
def update_rarity_value():
    """
    Update the value of a specific collectible.
    """
    request_data = request.args
    collectible_id = request_data.get("collectible_id")
    value = request_data.get("value")

    if value not in ["Common", "Rare", "Ultra-Rare", "Legendary"]:
        raise BackendException(422, "Invalid rarity value.")

    collectible = db_session.query(Collectible).filter_by(id=collectible_id).first()
    collectible.rarity = value
    db_session.commit()
    collectible = db_session.query(Collectible).filter_by(id=collectible_id).first()

    return {"status": "success", "collectible": collectible.to_dict()}
