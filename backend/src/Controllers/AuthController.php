<?php

namespace Src\Controllers;

use Src\Services\AuthService;
use Firebase\JWT\JWT;
use Src\Helpers\Helper;
use Src\Middleware\AuthMiddleware;

class AuthController
{
    function __construct(
        private AuthService $authService,
        private AuthMiddleware $authMiddleware,
        private Helper $helper,
    ) {
        $this->authService = $authService;
        $this->authMiddleware = $authMiddleware;
        $this->helper = $helper;
    }

    public function register(): void
    {
        $data = $this->helper->Request();

        if (
            empty($data['name']) ||
            empty($data['email']) ||
            empty($data['password'])
        ) {
            $this->helper->Response(
                false, 'Campos obrigatórios', null, 422
            );
            return;
        }

        $this->authService->create(
            $data['name'],
            $data['email'],
            $data['password']
        );

        $this->helper->Response(
            true, 'Usuário criado com sucesso', null, 201
        );
    }

    public function login(): void
    {
        $data = $this->helper->Request();

        $user = $this->authService->findByEmail($data['email'] ?? '');

        if (!$user || !password_verify($data['password'] ?? '', $user['password'])) {
            $this->helper->Response(
                false, 'Email ou senha inválidos', null, 401
            );

            return;
        }

        $payload = [
            'sub' => $user['id'],
            'email' => $user['email'],
            'exp' => time() + 60 * 15 // 15 minutos 
        ];

        $token = JWT::encode($payload, $_ENV['CHAVE_JWT'], 'HS256');

        setcookie('access_token', $token, [
            'expires' => time() + (60 * 15),
            'path' => '/',
            'secure' => true,
            'httponly' => true,
            'samesite' => 'Lax'
        ]);

        $this->helper->Response(
            true, 'Login efetuado com sucesso', null, 200
        );
    }

    public function me(): void
    {
        $payload = $this->authMiddleware->Authenticate();

        $this->helper->Response(
            true, 'Dados do usuário', [
                'id' => $payload['sub'], 
                'email' => $payload['email'], 
                'exp' => $payload['exp']
            ], 200
        );
    }
}