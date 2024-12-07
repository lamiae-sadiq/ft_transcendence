FROM python:3.11-slim

ENV PYTHONUNBUFFERED 1

# Install necessary dependencies for PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev gcc

WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .

# Copy static files
COPY ./accounts/static ./media

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Copy the wait-for-it script into the container and make it executable
COPY wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

# Ensure the entrypoint script is executable
RUN chmod +x ./entrypoint.sh

# Set the entrypoint to your custom script
ENTRYPOINT ["./entrypoint.sh"]
