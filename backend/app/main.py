import os
import sys
import logging

from flask import Flask
from flask_cors import CORS
from flasgger import Swagger

from db import db_session, init_db
from populate_db import populate_db
from blueprints import (
    auth,
    collectible,
    collection,
    reputation,
    trading,
    wishlist,
    search,
    campaign,
    message,
    administration,
)

from schema_models import (
    Account,
    Series,
    Collectible,
    Collection,
    Reputation,
    Review,
    TradeListing,
    Tradable,
    Wishlist,
    Recommended,
)


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)
    database_path = os.path.join(os.getcwd(), "instance", "collex.sqlite")
    app.config.from_mapping(
        # Secret Key is set to 'dev' for development
        # Randomise for production environment
        SECRET_KEY="dev",
        DATABASE=f"sqlite:///{database_path}",
    )

    if test_config is None:
        # Load the instance config, if it exists, when NOT testing
        app.config.from_pyfile("config.py", silent=True)
    else:
        # Load the test config if it exists
        app.config.from_mapping(test_config)

    # Ensure the instance folder exists
    # The instance folder contains config secrets, db etc.
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db_session.remove()

    # Test Endpoint
    @app.route("/hello")
    def hello():
        return "Hello, H13A Young CEOs!"

    # Initialise the database for the app
    init_db()
    populate_db()
    # Register route blueprints
    app.register_blueprint(auth.bp)
    app.register_blueprint(collection.bp)
    app.register_blueprint(trading.bp)
    app.register_blueprint(collectible.bp)
    app.register_blueprint(reputation.bp)
    app.register_blueprint(wishlist.bp)
    app.register_blueprint(search.bp)
    app.register_blueprint(campaign.bp)
    app.register_blueprint(message.bp)
    app.register_blueprint(administration.bp)

    # Initialize Flasgger for Swagger documentation
    swagger_config = {
        "swagger": "2.0",
        "info": {
            "title": "ColleX",
            "version": "1.0",
        },
    }

    swagger = Swagger(
        app,
        template=swagger_config,
    )

    return app


if __name__ == "__main__":
    app = create_app()
    # Configure logger
    # Configure the Flask logger to send logs to stdout
    app.logger.addHandler(logging.StreamHandler(sys.stdout))
    app.logger.setLevel(logging.DEBUG)  # Set the desired log level

    app.run(debug=True, host="0.0.0.0", port=5000)
