<?php

namespace Src\Controllers;

use InvalidArgumentException;
use Src\Config\Cors;
use Src\Helpers\Helper;
use Throwable;
use Src\Services\UserService;

class UserController {
    public function __construct(
        private UserService $userService,
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

            $this->userService->create(
                $data['name'],
                $data['email'],
                $data['password']
            );

            $this->helper->Response(true, ['message' => 'Usuário criado com sucesso'], 201);
        } catch (Throwable $e) {
            http_response_code(500);
            $this->helper->Response(false, ['message' => $e->getMessage()], 500);
        }
    }
}