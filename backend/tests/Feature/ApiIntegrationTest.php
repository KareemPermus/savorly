<?php

use PHPUnit\Framework\TestCase;

final class ApiIntegrationTest extends TestCase
{
    private array $routes = [];

    protected function setUp(): void
    {
        parent::setUp();
        $json = <<<'JSON'
[
  {
    "method": "GET",
    "path": "/api/health",
    "request_path": "/api/health",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [
      "status"
    ],
    "expects_json": true
  }
]
JSON;
        $this->routes = json_decode($json, true) ?? [];
    }

    public function testApiContracts(): void
    {
        $baseUrl = getenv('TEST_BASE_URL') ?: 'http://localhost:8000';

        foreach ($this->routes as $route) {
            $requestPath = $route['request_path'] ?? $route['path'];
            $ch = curl_init($baseUrl . $requestPath);

            $headers = ['Content-Type: application/json'];
            if (!empty($route['auth_required'])) {
                $token = getenv('TEST_AUTH_TOKEN') ?: 'test-token';
                $headers[] = 'Authorization: Bearer ' . $token;
            }

            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $route['method']);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 20);

            if (!empty($route['sample_body']) && is_array($route['sample_body'])) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($route['sample_body']));
            }

            curl_exec($ch);
            $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            $this->assertSame(
                $route['success_status'],
                $status,
                sprintf('%s %s expected %d got %d', $route['method'], $route['path'], $route['success_status'], $status)
            );
        }
    }
}
