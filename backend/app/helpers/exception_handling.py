from models.error_models import BackendException
from db import db_session
from schema_models import (
    Account,
    Campaign,
    CampaignPost,
    Series,
)
from datetime import datetime


###  Helper functions  ###


def check_valid_campaign_manager(campaign_manager_username):
    # Retrieve the campaign manager
    campaign_manager = (
        db_session.query(Account).filter_by(username=campaign_manager_username).first()
    )
    if campaign_manager is None:
        raise BackendException("Campaign manager does not exist", status_code=404)
    elif not campaign_manager.is_campaign_manager:
        raise BackendException("Account is not a campaign manager", status_code=401)
    return campaign_manager


def check_valid_account(username):
    account = db_session.query(Account).filter_by(username=username).first()
    if account is None:
        raise BackendException("Account not found", status_code=404)
    return account


def check_campaign_already_exists(campaign_name):
    # Check if a campaign with the same name already exists
    campaign = db_session.query(Campaign).filter_by(name=campaign_name).first()
    if campaign is not None:
        raise BackendException(
            "A campaign with the same name already exists", status_code=409
        )
    return campaign


def check_campaign_exists(campaign_name):
    campaign = db_session.query(Campaign).filter_by(name=campaign_name).first()
    if campaign is None:
        raise BackendException(
            "The campaign with this name doesn't exist", status_code=404
        )
    return campaign


def check_valid_series(series_name):
    # Check the series is valid
    series = db_session.query(Series).filter_by(name=series_name).first()
    if series is None:
        raise BackendException("Series does not exist", status_code=404)
    return series


def check_dates_are_valid(campaign_start_date, campaign_end_date):
    # Check the dates are valid
    try:
        start_date = datetime.strptime(campaign_start_date, "%d/%m/%Y")
        end_date = datetime.strptime(campaign_end_date, "%d/%m/%Y")
    except Exception:
        raise BackendException(
            f"Invalid date format! Use DD/MM/YYYY!: {campaign_start_date} {campaign_end_date}",
            status_code=400,
        )

    if start_date > end_date:
        raise BackendException(
            f"Start date {start_date} is after end date {end_date}", status_code=400
        )
    return {"start_date": start_date, "end_date": end_date}


def check_valid_post_description(post_description):
    # Check post_description does not exceed character limit of 200
    if len(post_description) > 200:
        raise BackendException(
            "The post description must be less than 200 characters.", status_code=414
        )
