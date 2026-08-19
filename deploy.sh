#!/bin/bash

# NAS Git Deployment Script
# Usage: ./deploy.sh <nas-host> <nas-user> <git-repo-url> [branch]

set -e

NAS_HOST=${1:-"192.168.1.100"}
NAS_USER=${2:-"admin"}
GIT_REPO=${3:-"https://github.com/dblademasteh/deped.git"}
BRANCH=${4:-"main"}
REMOTE_PATH="/volume1/docker/laravel-dashboard"

echo "Deploying ${BRANCH} to ${NAS_USER}@${NAS_HOST}"

# Clone or pull on NAS
ssh ${NAS_USER}@${NAS_HOST} << EOF
  if [ -d "${REMOTE_PATH}/.git" ]; then
    cd ${REMOTE_PATH}
    git fetch origin
    git reset --hard origin/${BRANCH}
    git pull origin ${BRANCH}
  else
    rm -rf ${REMOTE_PATH}
    git clone -b ${BRANCH} ${GIT_REPO} ${REMOTE_PATH}
    cd ${REMOTE_PATH}
  fi

  # Setup env if missing
  if [ ! -f backend/.env ]; then
    cp .env.docker backend/.env
    cd backend
    php artisan key:generate
  fi

  # Build and restart
  docker compose down
  docker compose build --no-cache
  docker compose up -d

  # Migrate and optimize
  docker compose exec app php artisan migrate --force
  docker compose exec app php artisan config:cache
  docker compose exec app php artisan route:cache
  docker compose exec app php artisan view:cache
EOF

echo "Done! App running on http://${NAS_HOST}:8080"
