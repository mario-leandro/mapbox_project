<?php

namespace Src\Repositories;

use Src\Core\Database;

class AuthRepository {
    public function __construct(
        private Database $db_connection
    ) {}

    public function create(array $data): bool
    {
        return $this->db_connection->insert('users', $data);
    }

    public function findAll(): array
    {
        return $this->db_connection->select('users', []);
    }

    public function findByEmail(string $email): array
    {
        $result = $this->db_connection->select('users', ['email' => $email]);
        return $result ? $result[0] : [];
    }

    public function findById(int $id): array
    {
        $result = $this->db_connection->select('users', ['id' => $id]);
        return $result ? $result[0] : [];
    }

    public function deleteById(int $id): bool
    {
        return $this->db_connection->delete('users', ['id' => $id]);
    }

    public function updateById(int $id, array $data): bool
    {
        return $this->db_connection->update('users', $data, ['id' => $id]);
    }
}