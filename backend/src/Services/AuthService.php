<?php

namespace Src\Services;

use InvalidArgumentException;
use Src\Models\User;
use Src\Repositories\AuthRepository;

class AuthService {
    public function __construct(
        private AuthRepository $userRepository
    ) {}

    public function create(string $name, string $email, string $password): int {
        if (empty($name) || empty($email) || empty($password)) {
            throw new InvalidArgumentException("Todos os campos são obrigatórios.");
        }

        if (trim($name) === '') {
            throw new InvalidArgumentException(
                "O nome é obrigatório."
            );
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException(
                "E-mail inválido."
            );
        }

        if (strlen($password) < 8) {
            throw new InvalidArgumentException(
                "A senha deve possuir pelo menos 8 caracteres."
            );
        }

        $existingUser = $this->userRepository->findByEmail($email);

        if (!empty($existingUser)) {
            throw new InvalidArgumentException(
                "Já existe um usuário com este e-mail."
            );
        }

        $passwordHash = password_hash($password, PASSWORD_BCRYPT);

        $user = new User(null, $name, $email, $passwordHash);
        $user->setName($name);
        $user->setEmail($email);

        return $this->userRepository->save($user);
    }

    public function findByEmail(string $email): ?array {
        return $this->userRepository->findByEmail($email);
    }

    public function save(string $name, string $email, string $password): int {
        return $this->create($name, $email, $password);
    }
}