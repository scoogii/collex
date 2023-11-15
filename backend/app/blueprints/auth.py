import logging

from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash

from flasgger import swag_from
from swagger_docs import auth_docs
from db import db_session
from schema_models import (
    Account,
    Collection,
    Reputation,
    Wishlist,
    Tradable,
    Recommended,
)

from helpers.jwt_authentication import encode_auth_token, decode_auth_token
from models.auth_models import InvalidCredentials, InvalidJWT

# Logger
logger = logging.getLogger(__name__)

# -- Blueprint Definition -- #
bp = Blueprint("auth", __name__, url_prefix="/auth")


# -- Error Handlers -- #
@bp.errorhandler(InvalidCredentials)
def invalid_credentals(e):
    return jsonify(e.to_dict()), e.status_code


# -- ROUTES -- #
@bp.route("/register", methods=["POST"])
@swag_from(auth_docs.register)
def register():
    """
    Register the user
    """
    # Retrieve username, password and email
    request_data = request.get_json()
    username = request_data.get("username")
    password = request_data.get("password")
    email = request_data.get("email")
    is_campaign_manager = request_data.get("is_campaign_manager")
    is_admin = request.json.get("is_admin")

    try:
        account = Account(
            username,
            generate_password_hash(password),
            email,
            is_campaign_manager,
            is_admin,
        )
        db_session.add(account)
        db_session.commit()
        # Create necessary data tables for the user
        collection = Collection(account.id, 0)
        db_session.add(collection)
        reputation = Reputation(account.id, 0, 0, 0)
        db_session.add(reputation)
        wishlist = Wishlist(account.id, 0)
        db_session.add(wishlist)
        tradable = Tradable(account.id, 0)
        db_session.add(tradable)
        db_session.commit()

        # Generate the authentication token
        auth_token = encode_auth_token(account.id)
        response_data = {
            "status": "success",
            "message": "Successfully registered.",
            "auth_token": auth_token,
            "account_id": account.id,
            "is_campaign_manager": is_campaign_manager,
            "is_admin": is_admin,
        }
        return response_data
    except Exception as e:
        logger.error(e)
        error = ""
        if "UNIQUE constraint failed: Account.email" in e.args[0]:
            error = f"An account with {email} already exists"
        elif "UNIQUE constraint failed: Account.username" in e.args[0]:
            error = f"Account with username {username} is already registered."
        raise InvalidCredentials(error, status_code=401)


@bp.route("/login", methods=["POST"])
@swag_from(auth_docs.login)
def login():
    """
    Login the user
    """
    # Retrieve username and password
    request_data = request.get_json()
    username = request_data.get("username")
    password = request_data.get("password")

    # Search for the user in the database
    account = db_session.query(Account).filter_by(username=username).first()

    # Check if the provided details are valid
    error = None
    if account is None:
        error = "Incorrect username."
    elif not check_password_hash(account.password, password):
        error = "Incorrect password."

    if error is None:
        auth_token = encode_auth_token(account.id)
        response_data = {
            "status": "success",
            "message": "Successfully logged in.",
            "auth_token": auth_token,
            "account_id": account.id,
            "is_campaign_manager": account.is_campaign_manager,
            "is_admin": account.is_admin,
        }
        return response_data

    else:
        raise InvalidCredentials(error, status_code=401)


@bp.route("/logout", methods=["GET"])
@swag_from(auth_docs.logout)
def logout():
    """
    Login the user
    """
    return {"message": "Logged Out!"}


@bp.route("/get_all_users", methods=["GET"])
@swag_from(auth_docs.get_all_users)
def get_all_users():
    """
    Get all users
    """
    accounts = db_session.query(Account).all()

    return {
        "status": "success",
        "accounts": [account.to_dict() for account in accounts],
    }


@bp.route("/check_valid_token", methods=["GET"])
@swag_from(auth_docs.check_valid_token)
def check_valid_token():
    """
    Check the validity of the token
    """
    try:
        auth_token = request.args.get("jwt_token")
        decoded = decode_auth_token(auth_token)
        return {
            "status": decoded["status"],
            "message": "Token is valid.",
            "account_id": decoded["message"],
        }
    except InvalidJWT as e:
        return {"status": "failure", "message": e.message}
