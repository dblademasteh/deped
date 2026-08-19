#!/bin/sh

chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

rm -f /var/www/html/bootstrap/cache/config.php

exec php-fpm
