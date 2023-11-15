from sqlalchemy import all_
from db import db_session
from data import (
    accounts,
    collections,
    reputations,
    tradables,
    campaigns,
    campaign_reputations,
    series,
    initial_collectibles,
    super_pets_collectibles,
    epic_gamers_collectibles,
    astro_world_collectibles,
    wishlists,
)
import schema_models


def populate_db():
    with db_session() as session:
        for account_value in accounts:
            account_obj = schema_models.Account(
                account_value["username"],
                account_value["password"],
                account_value["email"],
                account_value["is_campaign_manager"],
                account_value["is_admin"],
            )
            session.add(account_obj)
        all_collectible_objects = []

        all_collectibles = []
        all_collectibles.extend(initial_collectibles)
        all_collectibles.extend(epic_gamers_collectibles)
        all_collectibles.extend(astro_world_collectibles)
        all_collectibles.extend(super_pets_collectibles)

        for collectible in all_collectibles:
            collectible_obj = schema_models.Collectible(
                collectible["name"],
                collectible["rarity"],
                collectible["image_id"],
                collectible["series_id"],
            )
            all_collectible_objects.append(collectible_obj)
            session.add(collectible_obj)

        for collection_value in collections:
            collection_obj = schema_models.Collection(
                collection_value["account_id"],
                collection_value["number_of_items"],
            )
            # Add some collectibles into their collection
            for collectible in all_collectible_objects:
                if collectible.name in collection_value["collection_collectibles"]:
                    collection_obj.collectibles.append(collectible)
            session.add(collection_obj)
        for reputation_value in reputations:
            reputation_obj = schema_models.Reputation(
                reputation_value["account_id"],
                reputation_value["average_rating"],
                reputation_value["number_of_ratings"],
                reputation_value["total_rating"],
            )
            session.add(reputation_obj)
        for tradable_value in tradables:
            tradable_obj = schema_models.Tradable(
                tradable_value["account_id"], tradable_value["number_of_items"]
            )
            session.add(tradable_obj)
        for campaign_value in campaigns:
            campaign_obj = schema_models.Campaign(
                campaign_value["campaign_manager_id"],
                campaign_value["campaign_manager_name"],
                campaign_value["name"],
                campaign_value["description"],
                campaign_value["status"],
                campaign_value["series_name"],
                campaign_value["date_start"],
                campaign_value["date_end"],
            )
            session.add(campaign_obj)
        for wishlist_value in wishlists:
            wishlist_obj = schema_models.Wishlist(
                wishlist_value["account_id"],
                wishlist_value["number_of_items"],
            )
            session.add(wishlist_obj)
        for campaign_reputation in campaign_reputations:
            campaign_reputation_obj = schema_models.CampaignReputation(
                campaign_reputation["campaign_name"],
                campaign_reputation["average_rating"],
                campaign_reputation["number_of_ratings"],
                campaign_reputation["total_rating"],
            )
            session.add(campaign_reputation_obj)

        for series_value in series:
            series_obj = schema_models.Series(
                series_value["name"],
                series_value["provider"],
                series_value["total_number_of_collectibles"],
            )
            session.add(series_obj)

        session.commit()
