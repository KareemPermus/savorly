<?php

use PHPUnit\Framework\TestCase;

final class UnitContractsTest extends TestCase
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

    private function curlStatus(string $method, string $url, ?array $body = null, ?string $token = null): int
    {
        $ch = curl_init($url);
        $headers = ['Content-Type: application/json'];
        if ($token !== null) {
            $headers[] = 'Authorization: Bearer ' . $token;
        }
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 20);
        if ($body !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        }
        curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return $status;
    }

    public function testMissingRequiredField(): void
    {
        $baseUrl = getenv('TEST_BASE_URL') ?: 'http://localhost:8000';
        foreach ($this->routes as $route) {
            $body = $route['sample_body'] ?? null;
            if (!is_array($body) || count($body) < 2) {
                continue;
            }
            foreach (array_keys($body) as $omitKey) {
                $partial = array_filter($body, fn($k) => $k !== $omitKey, ARRAY_FILTER_USE_KEY);
                $requestPath = $route['request_path'] ?? $route['path'];
                $status = $this->curlStatus($route['method'], $baseUrl . $requestPath, $partial);
                $this->assertTrue(
                    $status === 400 || $status === 422,
                    sprintf('%s %s missing \'%s\' expected 400/422 got %d', $route['method'], $route['path'], $omitKey, $status)
                );
            }
        }
    }

    public function testAuthRejection(): void
    {
        $baseUrl = getenv('TEST_BASE_URL') ?: 'http://localhost:8000';
        foreach ($this->routes as $route) {
            if (empty($route['auth_required'])) {
                continue;
            }
            $requestPath = $route['request_path'] ?? $route['path'];
            $status = $this->curlStatus($route['method'], $baseUrl . $requestPath);
            $this->assertSame(
                401,
                $status,
                sprintf('%s %s expected 401 (no auth) got %d', $route['method'], $route['path'], $status)
            );
        }
    }

    public function testWrongMethod(): void
    {
        $baseUrl = getenv('TEST_BASE_URL') ?: 'http://localhost:8000';
        foreach ($this->routes as $route) {
            $wrong = $route['method'] === 'GET' ? 'POST' : 'GET';
            $requestPath = $route['request_path'] ?? $route['path'];
            $status = $this->curlStatus($wrong, $baseUrl . $requestPath);
            $this->assertSame(
                405,
                $status,
                sprintf('wrong method %s on %s expected 405 got %d', $wrong, $route['path'], $status)
            );
        }
    }
}
