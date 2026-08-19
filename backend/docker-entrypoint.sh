#!/bin/sh

cat > /var/www/html/.env <<EOF
APP_ENV=${APP_ENV}
APP_DEBUG=${APP_DEBUG}
APP_KEY=${APP_KEY}
APP_URL=${APP_URL}
DB_CONNECTION=${DB_CONNECTION}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_DATABASE=${DB_DATABASE}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
SESSION_DRIVER=${SESSION_DRIVER}
QUEUE_CONNECTION=${QUEUE_CONNECTION}
CACHE_STORE=${CACHE_STORE}
EOF

chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

rm -f /var/www/html/bootstrap/cache/config.php

exec php-fpm
