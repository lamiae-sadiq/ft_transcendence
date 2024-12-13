FROM python:3.11-slim

ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y \
    libpq-dev gcc

# RUN mkdir -p /media/images
# COPY ./project/accounts/static /media/images

WORKDIR /app

COPY requirements.txt .

COPY ./accounts/static ./media

RUN pip install --no-cache-dir -r requirements.txt

COPY . .
COPY ./entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Set the entrypoint to the script
ENTRYPOINT ["./entrypoint.sh"]

