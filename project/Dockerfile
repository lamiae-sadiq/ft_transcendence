FROM python:3
# Set environment variables
ENV PYTHONUNBUFFERED 1


COPY . .
# COPY ./accounts/static /app/accounts/static
COPY ./accounts/static /media

RUN pip install -r requirements.txt

