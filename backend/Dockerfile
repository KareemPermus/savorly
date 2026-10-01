FROM php:8.2-cli

RUN apt-get update && apt-get install -y unzip git libzip-dev libpng-dev && \
    docker-php-ext-install pdo_mysql zip && \
    rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

RUN mkdir -p bootstrap/cache storage/framework/cache storage/framework/sessions storage/framework/views storage/logs && \
    chmod -R 775 bootstrap/cache storage

COPY composer.json composer.lock* ./
RUN composer install --no-dev --optimize-autoloader --no-scripts || composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

COPY . .
RUN composer dump-autoload --optimize

RUN chmod -R 775 bootstrap/cache storage

EXPOSE 8000

CMD php artisan migrate --force --no-interaction && \
    php artisan db:seed --force --no-interaction && \
    php artisan serve --host=0.0.0.0 --port=8000