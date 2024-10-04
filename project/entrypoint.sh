#!/bin/bash
set -a  # Automatically export all variables

echo "Sourcing .env file..."

source SmartContract/.env


set +a  # Stop exporting


echo "Private key is: $private_key"  # Print the private key to verify
# Execute the command provided to the entrypoint
exec "$@"