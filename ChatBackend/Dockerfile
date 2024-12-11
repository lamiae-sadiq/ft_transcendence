# Use the official Python image as the base
FROM python:3.12

# Set the working directory inside the container
WORKDIR /app

# Copy the backend code to the container
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# RUN chmod +x ChatBackend/wait-for-it.sh

RUN chmod +x ./entrypoint.sh

# Expose port 8000 for Django
EXPOSE 8000

# Default command to run the Django server
ENTRYPOINT ["./entrypoint.sh"]
