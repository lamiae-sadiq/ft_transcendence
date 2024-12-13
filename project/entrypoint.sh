#!/bin/bash
set -a  # Automatically export all variables

source SmartContract/.env

set +a  # Stop exporting


wait-for-it db:5432 --timeout=30 --strict -- echo "Database is ready!"


python3 manage.py makemigrations
python3 manage.py migrate
# Execute the command provided to the entrypoint
exec "$@"