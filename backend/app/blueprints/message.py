from flask import Blueprint, request, jsonify

from flasgger import swag_from
from blueprints.trading import get_users_account_id

from swagger_docs import message_docs
from models.message_models import Message
from models.error_models import BackendException

from db import db_session
from schema_models import Account, Message, Conversation

bp = Blueprint("message", __name__, url_prefix="/message")


@bp.errorhandler(BackendException)
def backend_exception(e):
    return jsonify(e.to_dict()), e.status_code


@bp.route("/get_conversation", methods=["GET"])
@swag_from(message_docs.get_conversation)
def get_conversation():
    """
    Get a conversation
    If it does not exist, create it
    """
    request_data = request.args
    user1_username = request_data["user1_username"]
    user2_username = request_data["user2_username"]

    # Check that the users exist
    user1 = db_session.query(Account).filter_by(username=user1_username).first()
    user2 = db_session.query(Account).filter_by(username=user2_username).first()
    if user1 is None:
        raise BackendException("User 1 does not exist", status_code=404)
    elif user2 is None:
        raise BackendException("User 2 does not exist", status_code=404)

    # Check if the conversation already exists
    conversation_1 = (
        db_session.query(Conversation)
        .filter_by(user1_id=user1.id, user2_id=user2.id)
        .first()
    )
    conversation_2 = (
        db_session.query(Conversation)
        .filter_by(user1_id=user2.id, user2_id=user1.id)
        .first()
    )

    conversation = conversation_1 if not conversation_2 else conversation_2
    if conversation:
        if conversation.unread == user1_username:
            conversation.unread = ""
            conversation.num_unread_messages = 0
            db_session.commit()

        messages = [message.to_dict() for message in conversation.messages]
        # Sort messages by timestamp
        if messages:
            messages.sort(key=lambda x: x["timestamp"], reverse=False)

        # Change messages to show username
        formatted_messages = []
        for message in messages:
            formatted_message = {}
            formatted_message["message"] = message["message"]
            formatted_message["timestamp"] = message["timestamp"].strftime(
                "%I:%M%p (%d/%m/%y)"
            )
            formatted_message["sender"] = (
                user1.username if message["sender_id"] == user1.id else user2.username
            )
            formatted_messages.append(formatted_message)
        return {
            "status": "success",
            "message": "Conversation retrieved",
            "conversation_id": conversation.id,
            "messages": formatted_messages,
        }

    # Create the conversation
    new_conversation = Conversation(
        user1_id=user1.id,
        user2_id=user2.id,
    )
    db_session.add(new_conversation)
    db_session.commit()

    return {
        "status": "success",
        "message": "Conversation created",
        "conversation_id": new_conversation.id,
        "messages": [],
    }


@bp.route("/send_message", methods=["POST"])
@swag_from(message_docs.send_message)
def send_message():
    """
    Send a message
    """
    request_data = request.get_json()
    sender_username = request_data["sender_username"]
    receiver_username = request_data["receiver_username"]
    message = request_data["message"]
    conversation_id = request_data["conversation_id"]

    # Check that the sender and receiver exist
    sender = db_session.query(Account).filter_by(username=sender_username).first()
    receiver = db_session.query(Account).filter_by(username=receiver_username).first()
    if sender is None:
        raise BackendException("Sender does not exist", status_code=404)
    elif receiver is None:
        raise BackendException("Receiver does not exist", status_code=404)

    # Check that the conversation exists
    conversation = db_session.query(Conversation).filter_by(id=conversation_id).first()
    if conversation is None:
        raise BackendException("Conversation does not exist", status_code=404)

    # Add the message to the database
    new_message = Message(
        sender_id=sender.id,
        receiver_id=receiver.id,
        message=message,
    )
    db_session.add(new_message)
    # Add the message to the conversation
    conversation.messages.append(new_message)
    conversation.unread = receiver_username
    conversation.num_unread_messages += 1

    db_session.commit()

    return {"status": "success", "message": "Message sent successfully"}


@bp.route("/preview_all_messages", methods=["GET"])
@swag_from(message_docs.preview_all_messages)
def preview_all_messages():
    """
    Get the most recent message from all conversations
    """

    username = str(request.args.get("username"))
    account_id = get_users_account_id(username)
    # Get all the conversations a person is involved in
    conversations = db_session.query(Conversation).filter_by(user1_id=account_id).all()
    conversation_2 = db_session.query(Conversation).filter_by(user2_id=account_id).all()
    conversations.extend(conversation_2)

    # Message previews list
    message_previews = []
    for conversation in conversations:
        if conversation.messages == []:
            return message_previews
        most_recent_message = conversation.messages[-1]
        receiver = (
            db_session.query(Account)
            .filter_by(id=most_recent_message.receiver_id)
            .first()
        )
        sender = (
            db_session.query(Account)
            .filter_by(id=most_recent_message.sender_id)
            .first()
        )
        user = receiver.username if receiver.username != username else sender.username
        preview_dict = {
            "user": user,
            "last_message": {
                "message": most_recent_message.message,
                "sender": sender.username,
                "timestamp": most_recent_message.timestamp.strftime(
                    "%I:%M%p (%d/%m/%y)"
                ),
            },
            "unread": username == conversation.unread,
            "num_unread": conversation.num_unread_messages,
        }
        message_previews.append(preview_dict)

    return message_previews


@bp.route("/get_unread_conversations", methods=["GET"])
@swag_from(message_docs.get_unread_conversations)
def get_unread_conversations():
    """
    Get number of unread conversations
    """
    username = request.args.get("username")
    account_id = get_users_account_id(username)
    conversation_1 = (
        db_session.query(Conversation)
        .filter_by(user1_id=account_id, unread=username)
        .all()
    )
    conversation_2 = (
        db_session.query(Conversation)
        .filter_by(user2_id=account_id, unread=username)
        .all()
    )
    conversation_1.extend(conversation_2)
    print(conversation_1)

    return {"status": "success", "unread_conversations": len(conversation_1)}
