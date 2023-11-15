from flask import Blueprint, jsonify, request

from flasgger import swag_from

from swagger_docs import reputation_docs
from models.error_models import BackendException

from db import db_session
from schema_models import (
    Account,
    Reputation,
    Review,
    Campaign,
    CampaignReputation,
    CampaignReview,
)

bp = Blueprint("reputation", __name__, url_prefix="/reputation")


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


@bp.route("/get_reputation", methods=["GET"])
@swag_from(reputation_docs.get_reputation)
def get_reputation():
    """
    Get a user's reputation
    """
    request_data = request.args

    username = str(request_data.get("username"))
    account_id = get_users_account_id(username)

    reputation = db_session.query(Reputation).filter_by(account_id=account_id).first()

    reputation_data = {
        "account_id": reputation.account_id,
        "average_rating": reputation.average_rating,
        "number_of_ratings": reputation.number_of_ratings,
        "reviews": [review.to_dict() for review in reputation.reviews],
    }
    return {"status": "success", "reputation": reputation_data}


@bp.route("/get_review", methods=["GET"])
@swag_from(reputation_docs.get_review)
def get_review():
    """
    Get a review
    """
    request_data = request.args
    review_id = int(request_data.get("review_id"))

    review = db_session.query(Review).filter_by(id=review_id).first()

    return {"status": "success", "review": review.to_dict()}


@bp.route("/add_review", methods=["POST"])
@swag_from(reputation_docs.add_review)
def add_review():
    """
    Add a review
    """
    request_data = request.args
    reviewer = str(request_data.get("reviewer"))
    reviewee = str(request_data.get("reviewee"))
    rating = int(request_data.get("rating"))
    message = str(request_data.get("message"))

    reviewee_account_id = get_users_account_id(reviewee)
    reviewee_reputation = (
        db_session.query(Reputation).filter_by(account_id=reviewee_account_id).first()
    )
    review = Review(reviewer, reviewee, message, rating)
    db_session.add(review)
    reviewee_reputation.reviews.append(review)
    reviewee_reputation.number_of_ratings += 1
    reviewee_reputation.total_rating += rating
    reviewee_reputation.average_rating = (
        reviewee_reputation.total_rating / reviewee_reputation.number_of_ratings
    )

    db_session.commit()

    return {"status": "success", "review": review.to_dict()}


@bp.route("/remove_review", methods=["DELETE"])
@swag_from(reputation_docs.remove_review)
def remove_review():
    """
    Remove a review
    """
    request_data = request.args
    review_id = int(request_data.get("review_id"))

    review = db_session.query(Review).filter_by(id=review_id).first()
    if review is None:
        error = "This review has already been removed"
        raise BackendException(error, status_code=410)

    reviewee_account_id = get_users_account_id(review.reviewee)
    reviewee_reputation = (
        db_session.query(Reputation).filter_by(account_id=reviewee_account_id).first()
    )
    reviewee_reputation.number_of_ratings -= (
        1 if reviewee_reputation.number_of_ratings > 0 else 0
    )
    reviewee_reputation.total_rating -= review.rating
    reviewee_reputation.reviews.remove(review)
    if reviewee_reputation.number_of_ratings == 0:
        reviewee_reputation.average_rating = 0
    else:
        reviewee_reputation.average_rating = (
            reviewee_reputation.total_rating / reviewee_reputation.number_of_ratings
        )
    db_session.delete(review)
    db_session.commit()

    return {"status": "success", "response": "Review removed"}


@bp.route("/get_campaign_feedback", methods=["GET"])
@swag_from(reputation_docs.get_campaign_feedback)
def get_campaign_feedback():
    """
    Get feedback from all campaigns
    """
    campaign_id = request.args.get("campaign_id")
    campaign = db_session.query(Campaign).filter_by(id=campaign_id).first()
    campaign_reputation = (
        db_session.query(CampaignReputation)
        .filter_by(campaign_name=campaign.name)
        .first()
    )
    if campaign_reputation is None:
        return BackendException("This campaign reputation doesn't exist", 404)

    campaign_reputation_dict = {
        "campaign": campaign_reputation.campaign_name,
        "average_rating": campaign_reputation.average_rating,
        "number_of_ratings": campaign_reputation.number_of_ratings,
        "reviews": [
            campaign_review.to_dict()
            for campaign_review in campaign_reputation.campaign_reviews
        ],
    }

    return {"status": "success", "reputation": campaign_reputation_dict}


@bp.route("/add_campaign_review", methods=["POST"])
@swag_from(reputation_docs.add_campaign_review)
def add_campaign_review():
    """
    Leave a review for a campaign
    """
    reviewer_username = str(request.args.get("username"))
    campaign_name = str(request.args.get("campaign"))
    message = str(request.args.get("message"))
    rating = int(request.args.get("rating"))

    get_users_account_id(reviewer_username)

    # Get campaign's Reputation
    campaign_reputation = (
        db_session.query(CampaignReputation)
        .filter_by(campaign_name=campaign_name)
        .first()
    )
    if campaign_reputation is None:
        raise BackendException("Could not find campaign reputation", 404)

    campaign_review = CampaignReview(reviewer_username, campaign_name, message, rating)
    db_session.add(campaign_review)
    campaign_reputation.campaign_reviews.append(campaign_review)
    campaign_reputation.number_of_ratings += 1
    campaign_reputation.total_rating += rating
    campaign_reputation.average_rating = (
        campaign_reputation.total_rating / campaign_reputation.number_of_ratings
    )
    db_session.commit()
    return {"status": "success", "review": campaign_review.to_dict()}


@bp.route("/get_campaign_review", methods=["GET"])
@swag_from(reputation_docs.get_campaign_review)
def get_campaign_review():
    """
    Get a campaign review by id
    """

    review_id = request.args.get("review_id")
    campaign_review = db_session.query(CampaignReview).filter_by(id=review_id).first()

    if campaign_review is None:
        raise BackendException("Review doesn't exist", 404)

    return {"status": "success", "review": campaign_review.to_dict()}


@bp.route("/remove_campaign_review", methods=["DELETE"])
@swag_from(reputation_docs.remove_campaign_review)
def remove_campaign_review():
    """
    Remove a campaign review
    """
    review_id = request.args.get("review_id")
    campaign_review = db_session.query(CampaignReview).filter_by(id=review_id).first()
    campaign_name = str(campaign_review.campaign)
    campaign_reputation = (
        db_session.query(CampaignReputation)
        .filter_by(campaign_name=campaign_name)
        .first()
    )
    db_session.delete(campaign_review)

    campaign_reputation.number_of_ratings -= 1
    campaign_reputation.total_rating -= campaign_review.rating
    if campaign_reputation.number_of_ratings == 0:
        campaign_reputation.average_rating = 0
    else:
        campaign_reputation.average_rating = (
            campaign_reputation.total_rating / campaign_reputation.number_of_ratings
        )
    db_session.commit()
    return {"status": "Successfully removed campaign review"}
