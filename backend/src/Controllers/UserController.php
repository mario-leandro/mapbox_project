<?php

namespace Src\Controllers;

use InvalidArgumentException;
use Src\Config\Cors;
use Src\Helpers\Helper;
use Src\Models\User;
use Src\Repositories\UserRepository;
use Throwable;
use Src\Services\UserService;

class UserController {
    public function __construct(
        private UserRepository $userRepository,
        private UserService $UserService,
        private Cors $cors,
        private Helper $helper
    ) {}

    public function store() {
        $this->cors->handle();

        try {
            $data = $this->helper->Request();

            if (!is_array($data)) {
                throw new InvalidArgumentException(
                    "JSON inválido."
                );
            }

            $requiredFields = ['name', 'email', 'password'];
            foreach ($requiredFields as $field) {
                if (empty($data[$field])) {
                    throw new InvalidArgumentException(
                        "O campo '$field' é obrigatório."
                    );
                }
            }

            $id = $this->UserService->create(
                $data['name'],
                $data['email'],
                $data['password']
            );

            $this->helper->Response(true, ['message' => 'Usuário criado com sucesso'], 201);
        } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}