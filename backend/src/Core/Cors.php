<?php

namespace Src\Core;

class Cors
{
    public static function handle(): void
    {
        $origins = $_ENV['CORS_ALLOWED_ORIGINS']
            ?? 'http://localhost:3000,http://localhost:5500';
        $allowedOrigins = array_filter(array_map('trim', explode(',', $origins)));

        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if (in_array($origin, $allowedOrigins, true)) {
            header("Access-Control-Allow-Origin: $origin");
            header('Access-Control-Allow-Credentials: true');
        }

        header('Vary: Origin');
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }
}