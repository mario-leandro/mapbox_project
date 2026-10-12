<?php

namespace Src\Helpers;

class Helper 
{
    public static function Request(): array
    {
        return json_decode(file_get_contents('php://input'), true) ?? [];
    }

    public static function Response(bool $success, array $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        echo json_encode([
            "success" => $success,
            "data" => $data,
        ]);
        exit;
    }
}