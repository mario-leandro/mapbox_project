<?php

namespace Src\Core;
use PDO;
use PDOException;

class Database {
    protected ?PDO $db_connection = null;

    function __construct() {
        $this->db_connection = $this->getDbConnection();
    }

    public function getDbConnection()
    {
        try {
            $this->db_connection = new PDO('mysql:host=' . $_ENV['DB_HOST'] . ';dbname=' . $_ENV['DB_NAME'], $_ENV['DB_USER'], $_ENV['DB_PASS']);

            $this->db_connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->db_connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

            return $this->db_connection;
        } catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
        }
    }

    public function closeDbConnection() {
        if ($this->db_connection !== null) {
            $this->db_connection = null;
        }
    }

    public function select(string $tabela, array $condicoes = [], array $parametros = ["*"], string $orderBy = "", string $limit = ""): array
    {
        $query = "SELECT " . implode(", ", $parametros) . " FROM " . $tabela;

        if (!empty($condicoes)) {
            $query .= " WHERE " . implode(" AND ", array_map(fn($key) => "$key = :$key", array_keys($condicoes)));
        }

        if (!empty($orderBy)) {
            $query .= " ORDER BY " . $orderBy;
        }

        if (!empty($limit)) {
            $query .= " LIMIT " . $limit;
        }

        $stmt = $this->db_connection->prepare($query);
        $stmt->execute($condicoes);

        return $stmt->fetchAll();
    }

    public function insert(string $tabela, array $dados): bool
    {
        $colunas = implode(", ", array_keys($dados));
        $placeholders = implode(", ", array_map(fn($key) => ":$key", array_keys($dados)));

        $query = "INSERT INTO " . $tabela . " (" . $colunas . ") VALUES (" . $placeholders . ")";

        $stmt = $this->db_connection->prepare($query);
        return $stmt->execute($dados);
    }

    public function update(string $tabela, array $dados, array $condicoes): bool
    {
        $set = implode(", ", array_map(fn($key) => "$key = :$key", array_keys($dados)));
        $where = implode(" AND ", array_map(fn($key) => "$key = :$key", array_keys($condicoes)));

        $query = "UPDATE " . $tabela . " SET " . $set . " WHERE " . $where;

        $stmt = $this->db_connection->prepare($query);
        return $stmt->execute(array_merge($dados, $condicoes));
    }

    public function delete(string $tabela, array $condicoes): bool
    {
        $where = implode(" AND ", array_map(fn($key) => "$key = :$key", array_keys($condicoes)));

        $query = "DELETE FROM " . $tabela . " WHERE " . $where;

        $stmt = $this->db_connection->prepare($query);
        return $stmt->execute($condicoes);
    }

    public function sql(string $query) {
        $stmt = $this->db_connection->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}