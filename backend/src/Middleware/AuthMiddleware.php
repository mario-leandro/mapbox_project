<?php

namespace Src\Middleware;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Src\Helpers\Helper;

class AuthMiddleware
{
    function __construct(
        private Helper $helper
    ) {}

    public function Authenticate(): void
    {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';

        if (!str_starts_with($authHeader, 'Bearer ')) {
            $this->helper->Response(false, ['message' => 'Token não informado'], 401);
        }

        $token = str_replace('Bearer ', '', $authHeader);

        if (!$token) {
            $this->helper->Response(false, ['message' => 'Unauthorized'], 401);
        }

        try {
            $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'], 'HS256'));
            if (!$decoded) {
                $this->helper->Response(false, ['message' => 'Unauthorized'], 401);
            }
        } catch (\Exception $e) {
            $this->helper->Response(false, ['message' => 'Unauthorized'], 401);
        }
    }

    public function GetUserId(): ?int
    {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
        $token = str_replace('Bearer ', '', $authHeader);

        if (!$token) {
            return null;
        }

        try {
            $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'], 'HS256'));
            return $decoded->sub ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }
}