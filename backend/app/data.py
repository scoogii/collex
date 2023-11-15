from datetime import datetime
from werkzeug.security import generate_password_hash

# Dictionary for starter accounts
accounts = [
    {
        "username": "superuser",
        "password": generate_password_hash("12345"),
        "email": "bt@coolmathgames.com",
        "is_campaign_manager": True,
        "is_admin": True,
    },
    {
        "username": "bud",
        "password": generate_password_hash("bud"),
        "email": "bud@",
        "is_campaign_manager": True,
        "is_admin": False,
    },
    {
        "username": "eddy",
        "password": generate_password_hash("eddy"),
        "email": "eddy@",
        "is_campaign_manager": True,
        "is_admin": False,
    },
    {
        "username": "c1",
        "password": generate_password_hash("c1"),
        "email": "c1@",
        "is_campaign_manager": False,
        "is_admin": False,
    },
    {
        "username": "c2",
        "password": generate_password_hash("c2"),
        "email": "c2@",
        "is_campaign_manager": False,
        "is_admin": False,
    },
    {
        "username": "c3",
        "password": generate_password_hash("c3"),
        "email": "c3",
        "is_campaign_manager": False,
        "is_admin": False,
    },
]

# Dictionary for starter user collection
collections = [
    {
        "account_id": 1,
        "number_of_items": 0,
        "collection_collectibles": [],
    },
    {
        "account_id": 2,
        "number_of_items": 0,
        "collection_collectibles": [],
    },
    {
        "account_id": 3,
        "number_of_items": 0,
        "collection_collectibles": [],
    },
    {
        "account_id": 4,
        "number_of_items": 0,
        "collection_collectibles": ["Astronaut", "Beanie", "President", "Gamer T-Rex"],
    },
    {
        "account_id": 5,
        "number_of_items": 0,
        "collection_collectibles": [
            "Gamer Croc",
            "Gamer Rhino",
            "Super Doge",
            "Super Lamb",
        ],
    },
    {
        "account_id": 6,
        "number_of_items": 0,
        "collection_collectibles": [
            "Astro Yay",
            "Astro Racer",
            "Super Lamb",
            "Gamer Ninja",
        ],
    },
]

# Dictionary for starter user reputation
reputations = [
    {
        "account_id": 1,
        "average_rating": 0,
        "number_of_ratings": 0,
        "total_rating": 0,
    },
    {
        "account_id": 2,
        "average_rating": 0,
        "number_of_ratings": 0,
        "total_rating": 0,
    },
    {
        "account_id": 3,
        "average_rating": 0,
        "number_of_ratings": 0,
        "total_rating": 0,
    },
    {
        "account_id": 4,
        "average_rating": 0,
        "number_of_ratings": 0,
        "total_rating": 0,
    },
    {
        "account_id": 5,
        "average_rating": 0,
        "number_of_ratings": 0,
        "total_rating": 0,
    },
    {
        "account_id": 6,
        "average_rating": 0,
        "number_of_ratings": 0,
        "total_rating": 0,
    },
]

# Dictionary for starter user tradable
tradables = [
    {
        "account_id": 1,
        "number_of_items": 0,
    },
    {
        "account_id": 2,
        "number_of_items": 0,
    },
    {
        "account_id": 3,
        "number_of_items": 0,
    },
    {
        "account_id": 4,
        "number_of_items": 0,
    },
    {
        "account_id": 5,
        "number_of_items": 0,
    },
    {
        "account_id": 6,
        "number_of_items": 0,
    },
]

# Dictionary for initial Series
series = [
    {
        "name": "Swag Monkeys",
        "provider": "Woolworths",
        "total_number_of_collectibles": 5,
    },
    {
        "name": "Crazy Legends",
        "provider": "Coles",
        "total_number_of_collectibles": 5,
    },
    {
        "name": "Epic Gamers",
        "provider": "Woolworths",
        "total_number_of_collectibles": 4,
    },
    {
        "name": "Super Pets",
        "provider": "Coles",
        "total_number_of_collectibles": 5,
    },
    {
        "name": "Astro World",
        "provider": "Woolworths",
        "total_number_of_collectibles": 5,
    },
]

# Dictionary for wishlist
wishlists = [
    {
        "account_id": 1,
        "number_of_items": 0,
    },
    {
        "account_id": 2,
        "number_of_items": 0,
    },
    {
        "account_id": 3,
        "number_of_items": 0,
    },
    {
        "account_id": 4,
        "number_of_items": 0,
    },
    {
        "account_id": 5,
        "number_of_items": 0,
    },
    {
        "account_id": 6,
        "number_of_items": 0,
    },
]
# Dictionary for initial Collectibles
initial_collectibles = [
    {
        "name": "Astronaut",
        "rarity": "Ultra-Rare",
        "image_id": "/astronaut.png",
        "series_id": 1,
    },
    {
        "name": "Beanie",
        "rarity": "Common",
        "image_id": "/beanie.png",
        "series_id": 2,
    },
    {
        "name": "Beats",
        "rarity": "Rare",
        "image_id": "/beats.png",
        "series_id": 2,
    },
    {
        "name": "Doctor",
        "rarity": "Ultra-Rare",
        "image_id": "/doctor.png",
        "series_id": 2,
    },
    {
        "name": "Funky",
        "rarity": "Common",
        "image_id": "/funky.png",
        "series_id": 1,
    },
    {
        "name": "President",
        "rarity": "Legendary",
        "image_id": "/president.png",
        "series_id": 1,
    },
    {
        "name": "Raincoat",
        "rarity": "Ultra-Rare",
        "image_id": "/raincoat.png",
        "series_id": 1,
    },
    {
        "name": "Shades",
        "rarity": "Common",
        "image_id": "/shades.png",
        "series_id": 2,
    },
    {
        "name": "SuperMonkey",
        "rarity": "Legendary",
        "image_id": "/super.png",
        "series_id": 2,
    },
    {
        "name": "Zombie",
        "rarity": "Rare",
        "image_id": "/zombie.png",
        "series_id": 1,
    },
]

epic_gamers_collectibles = [
    {
        "name": "Gamer Croc",
        "rarity": "Common",
        "image_id": "/gamer/gamer_croc.png",
        "series_id": 3,
    },
    {
        "name": "Gamer Ninja",
        "rarity": "Legendary",
        "image_id": "/gamer/gamer_ninja.png",
        "series_id": 3,
    },
    {
        "name": "Gamer Rhino",
        "rarity": "Rare",
        "image_id": "/gamer/gamer_rhino.png",
        "series_id": 3,
    },
    {
        "name": "Gamer T-Rex",
        "rarity": "Ultra-Rare",
        "image_id": "/gamer/gamer_trex.png",
        "series_id": 3,
    },
]

super_pets_collectibles = [
    {
        "name": "Super Doge",
        "rarity": "Legendary",
        "image_id": "/super_pets/super_doge.png",
        "series_id": 4,
    },
    {
        "name": "Super Tiger",
        "rarity": "Rare",
        "image_id": "/super_pets/super_tiger.png",
        "series_id": 4,
    },
    {
        "name": "Super Rabbit",
        "rarity": "Ultra-Rare",
        "image_id": "/super_pets/super_rabbit.png",
        "series_id": 4,
    },
    {
        "name": "Super Giraffe",
        "rarity": "Common",
        "image_id": "/super_pets/super_giraffe.png",
        "series_id": 4,
    },
    {
        "name": "Super Lamb",
        "rarity": "Common",
        "image_id": "/super_pets/super_lamb.png",
        "series_id": 4,
    },
]

astro_world_collectibles = [
    {
        "name": "Astro Alien",
        "rarity": "Ultra-Rare",
        "image_id": "/astro_world/astro_alien.png",
        "series_id": 5,
    },
    {
        "name": "Astro Dab",
        "rarity": "Legendary",
        "image_id": "/astro_world/astro_dab.png",
        "series_id": 5,
    },
    {
        "name": "Astro Holiday",
        "rarity": "Rare",
        "image_id": "/astro_world/astro_holiday.png",
        "series_id": 5,
    },
    {
        "name": "Astro Racer",
        "rarity": "Rare",
        "image_id": "/astro_world/astro_racer.png",
        "series_id": 5,
    },
    {
        "name": "Astro Yay",
        "rarity": "Common",
        "image_id": "/astro_world/astro_yay.png",
        "series_id": 5,
    },
]

# Dictionary for initial campaigns
campaigns = [
    {
        "campaign_manager_id": 2,
        "campaign_manager_name": "bud",
        "name": "Planet of the Monkeys V1",
        "description": "This is the Planet of the Monkey's campaign",
        "series_name": "Swag Monkeys",
        "date_start": datetime(2023, 10, 26),
        "date_end": datetime(2023, 11, 30),
        "status": "Active",
    },
    {
        "campaign_manager_id": 2,
        "campaign_manager_name": "bud",
        "name": "League of Legends Season 1",
        "description": "This is the League of Legends S1 campaign",
        "series_name": "Crazy Legends",
        "date_start": datetime(2023, 10, 26),
        "date_end": datetime(2024, 1, 30),
        "status": "Active",
    },
    {
        "campaign_manager_id": 3,
        "campaign_manager_name": "eddy",
        "name": "League of Legends Season 2",
        "description": "This is the League of Legends S2 campaign",
        "series_name": "Epic Gamers",
        "date_start": datetime(2023, 10, 26),
        "date_end": datetime(2024, 2, 20),
        "status": "Active",
    },
    {
        "campaign_manager_id": 3,
        "campaign_manager_name": "eddy",
        "name": "Super Auto Pets I",
        "description": "This is the Super Auto Pet's campaign",
        "series_name": "Super Pets",
        "date_start": datetime(2023, 10, 26),
        "date_end": datetime(2024, 3, 30),
        "status": "Active",
    },
    {
        "campaign_manager_id": 1,
        "campaign_manager_name": "superuser",
        "name": "Out of this World",
        "description": "This is the Out of this World campaign",
        "series_name": "Astro World",
        "date_start": datetime(2023, 10, 26),
        "date_end": datetime(2024, 4, 30),
        "status": "Active",
    },
]

campaign_reputations = [
    {
        "campaign_name": "Planet of the Monkeys V1",
        "average_rating": 0,
        "number_of_ratings": 0,
        "total_rating": 0,
    },
    {
        "campaign_name": "League of Legends Season 1",
        "average_rating": 0,
        "number_of_ratings": 0,
        "total_rating": 0,
    },
    {
        "campaign_name": "League of Legends Season 2",
        "average_rating": 0,
        "number_of_ratings": 0,
        "total_rating": 0,
    },
    {
        "campaign_name": "Super Auto Pets I",
        "average_rating": 0,
        "number_of_ratings": 0,
        "total_rating": 0,
    },
    {
        "campaign_name": "Out of this World",
        "average_rating": 0,
        "number_of_ratings": 0,
        "total_rating": 0,
    },
]
