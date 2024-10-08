# FROM python:3
# # Set environment variables
# ENV PYTHONUNBUFFERED 1

# COPY . .
# # COPY ./accounts/static /app/accounts/static
# COPY ./accounts/static /media

# RUN pip install -r requirements.txt

# # Copy the entrypoint script

# RUN chmod +x ./entrypoint.sh

# # Set the entrypoint to the script
# ENTRYPOINT ["./entrypoint.sh"]
# Use an explicit Python version for compatibility (Python 3.11 or 3.10 recommended for now)
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED 1

# Install system-level dependencies required by psycopg2 and other common packages
RUN apt-get update && apt-get install -y \
    libpq-dev gcc

# Set the working directory
WORKDIR /app

# Copy the requirements.txt first to leverage Docker's layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Set permissions for the entrypoint script
RUN chmod +x ./entrypoint.sh

# Set the entrypoint to the script
ENTRYPOINT ["./entrypoint.sh"]
