FROM python:3

# Set environment variables
ENV PYTHONUNBUFFERED 1

# Create and set the working directory
RUN mkdir /trans
# WORKDIR /trans

# Copy the content to the working directory
COPY . .

# COPY ./manage.py .
# COPY ./requirements.txt .

# RUN chmod 0777 /trans/manage.py
# Install dependencies
RUN pip install -r requirements.txt
