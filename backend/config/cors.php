<?php

$exact = array_values(array_filter(array_map(
    'trim',
    explode(',', (string) env('CORS_ALLOWED_ORIGINS', ''))
)));

$previewDomain = (string) env('PREVIEW_DOMAIN', '');

$patterns = ['#^http://(localhost|127\.0\.0\.1):\d+$#'];
if ($previewDomain !== '' && $previewDomain !== 'localhost') {
    $patterns[] = '#^https://[a-z0-9-]+\.' . preg_quote($previewDomain, '#') . '$#';
}

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => $exact,
    'allowed_origins_patterns' => $patterns,
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];