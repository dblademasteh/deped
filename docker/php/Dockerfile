FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
    bash \
    git \
    curl \
    libpng \
    libjpeg-turbo \
    freetype \
    oniguriri \
    libxml2 \
    libxslt \
    zip \
    unzip \
    nodejs \
    npm \
    yarn

RUN docker-php-ext-install pdo pdo_mysql bcmath exif pcntl

RUN pecl install redis && docker-php-ext-enable redis

WORKDIR /var/www/html

COPY composer.json ./
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

COPY . .

CMD ["php-fpm"]