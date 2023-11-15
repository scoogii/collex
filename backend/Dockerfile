# Use the official Python 3.11 image as the base image
FROM python:3.11-alpine

# Add environment variables here
ENV PYTHONPATH /app
ENV FLASK_APP /app/main.py
ENV TERM xterm-256color
ENV FLASK_COLOR true

# Set the working directory within the container
WORKDIR /app

# Copy the requirements.txt file into the container
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Copy the entire project directory into the container
COPY ./app /app

# Copy the required test files into the container
COPY ./tests /tests

# Expose the port your Flask app will run on (adjust as needed)
EXPOSE 5000

# Define the command to run your Flask app
CMD ["python", "/app/main.py"]
