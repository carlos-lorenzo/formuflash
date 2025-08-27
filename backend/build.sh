#!/bin/bash

# Build the project
echo "Building the project..."
pytho3.12 -m pip install -r requirements.txt

echo "Collect Static..."
python3.12 manage.py collectstatic --noinput --clear