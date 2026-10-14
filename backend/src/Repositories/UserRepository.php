<?php

namespace Src\Repositories;

use Src\Config\Database;

class UserRepository {
    public function __construct(
        private Database $db_connection
    ) {}

    public function save(array $data): bool
    {
        return $this->db_connection->insert('users', $data);
    }

    public function findByEmail(string $email): array
    {
        $result = $this->db_connection->select('users', ['email' => $email]);
        return $result ? $result[0] : [];
    }
}