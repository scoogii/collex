from flask import Blueprint, request
from flasgger import swag_from

from swagger_docs import search_docs

from db import db_session
from blueprints.collectible import get_all_collectibles
from blueprints.collection import get_collection
from schema_models import Account, Collectible, Collection

bp = Blueprint("filtering", __name__, url_prefix="/filtering")


@bp.route("/search_for_collectibles", methods=["GET"])
@swag_from(search_docs.search_for_collectibles)
def search_for_collectibles():
    """
    Search for collectibles given an input string
    """

    input_string = str(request.args.get("input"))

    # Get all collectibles
    all_collectibles = get_all_collectibles()["collectibles"]

    matched_collectibles = []
    for collectible in all_collectibles:
        # If input_string is contained in the name of collectible
        # append to the matched_collectibles list
        if input_string.lower() in (collectible["name"]).lower():
            matched_collectibles.append(collectible)

    return matched_collectibles
