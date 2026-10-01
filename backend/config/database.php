<?php

use Illuminate\Support\Str;

return [
    'default' => env('DB_CONNECTION', 'mysql'),
    'connections' => [
        'mysql' => [
            'driver' => 'mysql',
            'host' => env('MYSQL_HOST', env('DB_HOST', '127.0.0.1')),
            'port' => env('MYSQL_PORT', env('DB_PORT', '3306')),
            'database' => env('MYSQL_DB', env('DB_DATABASE', 'savorly_f4533b8f')),
            'username' => env('MYSQL_USER', env('DB_USERNAME', 'root')),
            'password' => env('MYSQL_PASSWORD', env('DB_PASSWORD', 'root')),
            'unix_socket' => '',
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
            'engine' => null,
            'options' => array_filter([
                PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => env('MYSQL_SSL') === 'true' ? false : null,
            ]),
        ],
    ],
    'migrations' => [
        'table' => 'migrations',
        'update_date_on_publish' => true,
    ],
];