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
                false, ['message' => 'Campos obrigatórios'], 422
            );
            return;
        }

        $this->authService->create(
            $data['name'],
            $data['email'],
            $data['password']
        );

        $this->helper->Response(
            true, ['message' => 'Usuário criado com sucesso'], 201
        );
    }

    public function login(): void
    {
        $data = $this->helper->Request();

        $user = $this->authService->findByEmail($data['email'] ?? '');

        if (!$user || !password_verify($data['password'] ?? '', $user['password'])) {
            $this->helper->Response(
                false, ['message' => 'Email ou senha inválidos'], 401
            );
        }

        $payload = [
            'sub' => $user['id'],
            'email' => $user['email'],
            'exp' => time() + 60 * 60 * 24 * 30
        ];

        JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');

        $this->helper->Response(
            true, [
                'message' => 'Login efetuado com sucesso',
            ], 200
        );
    }

    public function me(): void
    {
        $payload = $this->authMiddleware->Authenticate();

        $this->helper->Response(
            true, 
            [
                'data' => [
                    'id' => $payload['sub'], 
                    'email' => $payload['email'], 
                    'exp' => $payload['exp']
                ]
            ], 200
        );
    }
}