#!/bin/bash
set -a  # Automatically export all variables

source env/.env

set +a  # Stop exporting


python3 manage.py makemigrations
python3 manage.py migrate
exec daphne -b 0.0.0.0 -p 8002 chatapp.asgi:application