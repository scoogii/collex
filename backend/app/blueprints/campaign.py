from flask import Blueprint, request, jsonify
from flasgger import swag_from
from sqlalchemy import null
from sqlalchemy.sql.functions import user
from werkzeug.datastructures import accept
from blueprints.reputation import get_users_account_id
from db import db_session
from datetime import datetime
import pytz
from schema_models import (
    Account,
    Campaign,
    CampaignPost,
    CampaignReputation,
    Recommended,
    Series,
    Collectible,
    Collection,
    TradeListing,
)
from swagger_docs import campaign_docs
from models.error_models import BackendException
from helpers.exception_handling import (
    check_valid_campaign_manager,
    check_valid_account,
    check_campaign_already_exists,
    check_campaign_exists,
    check_valid_series,
    check_dates_are_valid,
    check_valid_post_description,
)

bp = Blueprint("campaign", __name__, url_prefix="/campaign")


@bp.errorhandler(BackendException)
def backend_exception(e):
    return jsonify(e.to_dict()), e.status_code


def get_campaign_participants(series):
    """
    Get the number of participants for a campaign
    """
    series_collectibles = (
        db_session.query(Collectible).filter_by(series_id=series.id).all()
    )
    all_users = db_session.query(Account).all()
    total_participants = set()
    for user in all_users:
        user_collection = (
            db_session.query(Collection).filter_by(account_id=user.id).first()
        )
        user_collectibles = user_collection.collectibles
        for collectible in series_collectibles:
            if collectible in user_collectibles:
                total_participants.add(user.username)

    return len(total_participants)


def get_campaign_trades(campaign_name):
    campaign = db_session.query(Campaign).filter_by(name=campaign_name).first()
    series = db_session.query(Series).filter_by(name=campaign.series_name).first()
    series_collectibles = (
        db_session.query(Collectible).filter_by(series_id=series.id).all()
    )
    campaign_trades = {}
    all_trades = db_session.query(TradeListing).filter_by(is_active=False).all()
    for collectible in series_collectibles:
        successful_count = 0
        declined_count = 0
        for trade in all_trades:
            if (
                collectible in trade.offered_collectibles
                or collectible in trade.requested_collectibles
            ):
                if trade.is_successful:
                    successful_count += 1
                else:
                    declined_count += 1

        total = successful_count + declined_count
        successful = f"{(successful_count/total)*100:.2f}%" if total != 0 else "0%"
        declined = f"{(declined_count/total)*100:.2f}%" if total != 0 else "0%"
        campaign_trades[collectible.name] = {
            "total": total,
            "successful": successful,
            "declined": declined,
        }

    return campaign_trades


@bp.route("/create_campaign", methods=["POST"])
@swag_from(campaign_docs.create_campaign)
def create_campaign():
    """
    Create a campaign
    """
    request_data = request.get_json()
    campaign_manager_username = request_data["campaign_manager_username"]
    campaign_name = request_data["campaign_name"]
    campaign_description = request_data["campaign_description"]
    series_name = request_data["series_name"]
    campaign_start_date = request_data["campaign_start_date"]
    campaign_end_date = request_data["campaign_end_date"]

    campaign_manager = check_valid_campaign_manager(campaign_manager_username)
    check_campaign_already_exists(campaign_name)
    check_valid_series(series_name)
    dates = check_dates_are_valid(campaign_start_date, campaign_end_date)

    # Insert the campaign into the database
    campaign = Campaign(
        campaign_manager_id=campaign_manager.id,
        campaign_manager_name=campaign_manager.username,
        name=campaign_name,
        description=campaign_description,
        series_name=series_name,
        date_start=dates["start_date"],
        date_end=dates["end_date"],
        status="Active",
    )
    campaign_reputation = CampaignReputation(campaign_name, 0, 0, 0)
    db_session.add(campaign)
    db_session.add(campaign_reputation)
    db_session.commit()
    return {"status": "success", "campaign": campaign.to_dict()}


@bp.route("/create_campaign_post", methods=["POST"])
@swag_from(campaign_docs.create_campaign_post)
def create_campaign_post():
    """
    Create a post linked to a campaign
    """

    request_data = request.get_json()
    account_username = request_data["account_username"]
    campaign_name = request_data["campaign_name"]
    post_title = request_data["post_title"]
    post_description = request_data["post_description"]

    # Check if author has campaign_manager role
    campaign_manager = check_valid_campaign_manager(account_username)
    # Check if the campaign exists
    campaign = check_campaign_exists(campaign_name)

    # Check post_title does not exceed character limit of 100
    if len(post_title) > 100:
        raise BackendException(
            "The post title must be less than 100 characters.", status_code=414
        )
    check_valid_post_description(post_description)

    # Add a new post to the database
    campaign_post = CampaignPost(
        author_username=campaign_manager.username,
        post_title=post_title,
        post_description=post_description,
    )
    db_session.add(campaign_post)
    # Add the post to the campaign
    campaign.campaign_posts.append(campaign_post)
    db_session.commit()

    return {"status": "success", "campaign_post": campaign_post.to_dict()}


@bp.route("/edit_campaign_post", methods=["POST"])
@swag_from(campaign_docs.edit_campaign_post)
def edit_campaign_post():
    """
    Edit an existing campaign post
    """
    request_data = request.get_json()
    account_username = request_data["account_username"]
    new_description = request_data["new_description"]
    post_id = request_data["post_id"]

    check_valid_campaign_manager(account_username)
    check_valid_post_description(new_description)

    # Commit changes to the existing post
    post = db_session.query(CampaignPost).filter_by(id=post_id).first()
    post.post_description = new_description
    post.last_edited = datetime.now(pytz.timezone("Australia/Sydney"))
    db_session.commit()

    return {"status": "success", "edited_post": post.to_dict()}


@bp.route("/delete_campaign_post", methods=["DELETE"])
@swag_from(campaign_docs.delete_campaign_post)
def remove_campaign_post():
    """
    Remove an existing campaign post
    """
    username = request.args.get("username")
    post_id = request.args.get("post_id")

    account = db_session.query(Account).filter_by(username=username).first()
    if account.is_campaign_manager or account.is_admin:
        # Commit changes to the existing post
        post = db_session.query(CampaignPost).filter_by(id=post_id).first()
        if post is None:
            raise BackendException("This campaign post no longer exists", 404)

        db_session.delete(post)
        db_session.commit()

        return {"status": "successfully deleted campaign post"}
    else:
        raise BackendException("User not permitted to delete campaign post", 401)


@bp.route("/search_for_campaign", methods=["GET"])
@swag_from(campaign_docs.search_for_campaign)
def search_for_campaign():
    """
    Search for campaign by name
    """
    input_string = str(request.args.get("input_string"))

    all_active_campaigns = (
        db_session.query(Campaign).filter_by(date_archived=None).all()
    )
    # Add campaigns to matched_campaigns if they contain
    # input_string in name
    matched_campaigns = []
    for campaign in all_active_campaigns:
        if input_string.lower() in campaign.name.lower():
            matched_campaigns.append(campaign)

    if matched_campaigns != []:
        # Add series collectibles to each campaign
        matched_campaign_data = []
        for campaign in matched_campaigns:
            series = (
                db_session.query(Series).filter_by(name=campaign.series_name).first()
            )
            series_collectibles = (
                db_session.query(Collectible).filter_by(series_id=series.id).all()
            )
            campaign_data = campaign.to_dict()
            campaign_data["series_collectibles"] = [
                collectible.to_dict() for collectible in series_collectibles
            ]
            matched_campaign_data.append(campaign_data)

        return {
            "status": "success",
            "campaigns": matched_campaign_data,
        }
    else:
        # Return empty list
        return {"status": "success", "campaigns": matched_campaigns}


@bp.route("/view_all_posts", methods=["GET"])
@swag_from(campaign_docs.view_all_posts)
def view_all_posts():
    """
    View all campaign posts
    """
    request_data = request.args
    campaign_name = request_data["campaign_name"]
    campaign = check_campaign_exists(campaign_name)
    # Convert each post to a dictionary and return
    return {
        "status": "success",
        "posts": [post.to_dict() for post in campaign.campaign_posts],
    }


@bp.route("/archive_campaign", methods=["POST"])
@swag_from(campaign_docs.archive_campaign)
def archive_campaign():
    """
    Archive a campaign
    """
    request_data = request.args
    campaign_name = request_data.get("campaign_name")

    # Query the campaign from the database
    campaign = check_campaign_exists(campaign_name)

    # Archive the campaign by setting the date_archived field
    campaign.date_archived = datetime.now()
    campaign.status = "Archived"
    db_session.commit()

    return {"status": "success", "message": "Campaign successfully archived"}


@bp.route("/reactivate_campaign", methods=["POST"])
@swag_from(campaign_docs.reactivate_campaign)
def reactivate_campaign():
    """
    Reactivate a campaign
    """
    request_data = request.args
    campaign_name = request_data.get("campaign_name")

    # Query the campaign from the database
    campaign = check_campaign_exists(campaign_name)
    # Reactivate the campaign
    campaign.date_archived = None
    campaign.status = "Active"
    db_session.commit()

    return {"status": "success", "message": "Campaign successfully reactivated"}


@bp.route("/get_all_campaigns_for_managers", methods=["GET"])
@swag_from(campaign_docs.get_all_campaigns_for_managers)
def get_all_campaigns_for_managers():
    """
    Get all campaigns for managers
    """
    request_data = request.args
    manager_username = request_data["campaign_manager_username"]
    manager = check_valid_campaign_manager(manager_username)
    campaigns = (
        db_session.query(Campaign).filter_by(campaign_manager_id=manager.id).all()
    )
    # Add series collectibles to each campaign
    all_campaigns = []
    for campaign in campaigns:
        series = db_session.query(Series).filter_by(name=campaign.series_name).first()
        series_collectibles = (
            db_session.query(Collectible).filter_by(series_id=series.id).all()
        )
        # Update the status if the end date is before today
        end_date = pytz.timezone("Australia/Sydney").localize(campaign.date_end)
        if end_date < datetime.now(pytz.timezone("Australia/Sydney")):
            campaign.status = "Completed"
            db_session.commit()
        campaign_data = campaign.to_dict()
        campaign_data["series_collectibles"] = [
            collectible.to_dict() for collectible in series_collectibles
        ]
        all_campaigns.append(campaign_data)

    return {"status": "success", "campaigns": all_campaigns}


@bp.route("/search_for_manager_archived_campaigns", methods=["GET"])
@swag_from(campaign_docs.search_for_manager_archived_campaigns)
def get_manager_archived_campaigns():
    input_string = str(request.args.get("input_string"))
    username = str(request.args.get("username"))
    campaign_manager_id = get_users_account_id(username)

    all_active_campaigns = (
        db_session.query(Campaign)
        .filter_by(status="Archived", campaign_manager_id=campaign_manager_id)
        .all()
    )

    matched_campaigns = []
    for campaign in all_active_campaigns:
        if input_string.lower() in campaign.name.lower():
            matched_campaigns.append(campaign)

    if matched_campaigns != []:
        # Add series collectibles to each campaign
        matched_campaign_data = []
        for campaign in matched_campaigns:
            series = (
                db_session.query(Series).filter_by(name=campaign.series_name).first()
            )
            series_collectibles = (
                db_session.query(Collectible).filter_by(series_id=series.id).all()
            )
            campaign_data = campaign.to_dict()
            campaign_data["series_collectibles"] = [
                collectible.to_dict() for collectible in series_collectibles
            ]
            matched_campaign_data.append(campaign_data)

        return {
            "status": "success",
            "campaigns": matched_campaign_data,
        }
    else:
        # Return empty list
        return {"status": "success", "campaigns": matched_campaigns}


@bp.route("/get_all_campaigns_for_users", methods=["GET"])
@swag_from(campaign_docs.get_all_campaigns_for_users)
def get_all_campaigns_for_users():
    """
    Get all campaigns for users
    """
    campaigns = db_session.query(Campaign).filter_by(status="Active").all()
    # Add series collectibles to each campaign
    all_campaigns = []
    for campaign in campaigns:
        series = db_session.query(Series).filter_by(name=campaign.series_name).first()
        series_collectibles = (
            db_session.query(Collectible).filter_by(series_id=series.id).all()
        )
        # Update the status if the end date is before today
        end_date = pytz.timezone("Australia/Sydney").localize(campaign.date_end)
        if end_date < datetime.now(pytz.timezone("Australia/Sydney")):
            campaign.status = "Completed"
            db_session.commit()
        campaign_data = campaign.to_dict()
        campaign_data["series_collectibles"] = [
            collectible.to_dict() for collectible in series_collectibles
        ]
        all_campaigns.append(campaign_data)

    return {"status": "success", "campaigns": all_campaigns}


@bp.route("/get_all_recommended_campaigns_for_user", methods=["GET"])
@swag_from(campaign_docs.get_all_recommended_campaigns_for_user)
def get_all_recommended_campaigns_for_user():
    """
    Get all recommended campaigns for user
    """
    request_data = request.args
    username = request_data["username"]
    account = check_valid_account(username)
    collection = db_session.query(Collection).filter_by(account_id=account.id).first()
    collectibles = collection.collectibles
    series_names = set()
    for collectible in collectibles:
        series = db_session.query(Series).filter_by(id=collectible.series_id).first()
        series_names.add(series.name)

    campaigns = db_session.query(Campaign).filter_by(status="Active").all()
    # Add series collectibles to each campaign
    all_campaigns = {}
    for campaign in campaigns:
        series = db_session.query(Series).filter_by(name=campaign.series_name).first()
        series_collectibles = (
            db_session.query(Collectible).filter_by(series_id=series.id).all()
        )
        # Update the status if the end date is before today
        end_date = pytz.timezone("Australia/Sydney").localize(campaign.date_end)
        if end_date < datetime.now(pytz.timezone("Australia/Sydney")):
            campaign.status = "Completed"
            db_session.commit()
        campaign_data = campaign.to_dict()
        campaign_data["series_collectibles"] = [
            collectible.to_dict() for collectible in series_collectibles
        ]
        all_campaigns[campaign.series_name] = campaign_data

    participated_campaign_names = list(series_names)
    participated_campaigns = []
    new_campaigns = []
    for campaign_name, campaign in all_campaigns.items():
        if campaign_name in participated_campaign_names:
            participated_campaigns.append(campaign)
        else:
            new_campaigns.append(campaign)

    recommended_campaigns = new_campaigns

    return {"status": "success", "campaigns": recommended_campaigns}


@bp.route("/get_campaign", methods=["GET"])
@swag_from(campaign_docs.get_campaign)
def get_campaign():
    """
    Get campaign
    """
    request_data = request.args
    campaign_name = request_data["campaign_name"]
    campaign = db_session.query(Campaign).filter_by(name=campaign_name).first()
    if campaign is None:
        raise BackendException("Campaign not found", status_code=404)
    # Add series collectibles to each campaign
    series = db_session.query(Series).filter_by(name=campaign.series_name).first()
    series_collectibles = (
        db_session.query(Collectible).filter_by(series_id=series.id).all()
    )
    # Update the status if the end date is before today
    end_date = pytz.timezone("Australia/Sydney").localize(campaign.date_end)
    if end_date < datetime.now(pytz.timezone("Australia/Sydney")):
        campaign.status = "Completed"
        db_session.commit()
    campaign_data = campaign.to_dict()
    campaign_data["series_collectibles"] = [
        collectible.to_dict() for collectible in series_collectibles
    ]
    campaign_data["num_participants"] = get_campaign_participants(series)
    campaign_trades = get_campaign_trades(campaign_name)
    for collectible in campaign_data["series_collectibles"]:
        collectible.update(campaign_trades[collectible["name"]])

    return {"status": "success", "campaign": campaign_data}


@bp.route("/get_total_campaigns", methods=["GET"])
@swag_from(campaign_docs.total_campaigns)
def get_total_campaigns():
    """
    Get the total number of campaigns for administrators
    """
    username = request.args.get("username")
    # Verify if the user is a campaign manager
    check_valid_campaign_manager(username)

    total_campaigns = db_session.query(Campaign).count()
    return {"status": "success", "total_campaigns": total_campaigns}


@bp.route("/get_total_active_campaigns", methods=["GET"])
@swag_from(campaign_docs.get_total_active_campaigns)
def get_total_active_campaigns():
    """
    Get the total number of active campaigns for administrators
    """
    username = request.args.get("username")
    # Verify if the user is a campaign manager
    check_valid_campaign_manager(username)

    total_active_campaigns = (
        db_session.query(Campaign).filter(Campaign.status == "Active").count()
    )
    return {"status": "success", "total_active_campaigns": total_active_campaigns}


@bp.route("/get_total_archived_campaigns", methods=["GET"])
@swag_from(campaign_docs.get_total_archived_campaigns)
def get_total_archived_campaigns():
    """
    Get the total number of archived campaigns for administrators
    """
    username = request.args.get("username")
    # Verify if the user is a campaign manager
    check_valid_campaign_manager(username)

    total_archived_campaigns = (
        db_session.query(Campaign).filter(Campaign.status == "Archived").count()
    )
    return {"status": "success", "total_archived_campaigns": total_archived_campaigns}


@bp.route("/delete_campaign", methods=["DELETE"])
@swag_from(campaign_docs.delete_campaign)
def delete_campaign():
    """
    Delete a campaign
    """
    username = request.args.get("username")
    campaign_name = request.args.get("campaign_name")

    check_valid_account(username)
    account = db_session.query(Account).filter_by(username=username).first()
    if account.is_campaign_manager or account.is_admin:
        # Check if the campaign exists
        campaign = (
            db_session.query(Campaign)
            .filter_by(status="Active", name=campaign_name)
            .first()
        )

        if campaign is None:
            raise BackendException("Campaign not found", 404)

        # Delete campaignPosts and Campaign
        campaign_posts = campaign.campaign_posts
        for campaign_post in campaign_posts:
            db_session.delete(campaign_post)
            db_session.commit()

        db_session.delete(campaign)
        db_session.commit()

        return {"status": f"successfully deleted campaign: {campaign_name}"}
    else:
        raise BackendException("User does not have permission to delete campaign, 401")
