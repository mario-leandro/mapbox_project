<?php

namespace Src\Helpers;

class Helper 
{
    public function Request(): array
    {
        return json_decode(file_get_contents('php://input'), true) ?? [];
    }

    public function Response(bool $success, string $message, ?array $data = null, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        echo json_encode([
            "success" => $success,
            "message" => $message,
            "data" => $data ?? null
        ]);
        exit;
    }
}