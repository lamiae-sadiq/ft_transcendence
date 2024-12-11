#!/bin/bash
set -a  # Automatically export all variables

source SmartContract/.env

set +a  # Stop exporting


python3 manage.py makemigrations
python3 manage.py migrate
# Execute the command provided to the entrypoint
exec "$@"