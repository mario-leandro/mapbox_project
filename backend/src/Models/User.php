<?php

namespace Src\Models;

class User {
    public function __construct(
        private ?int $id,
        private string $name,
        private string $email,
        private string $password
    ) {}

    public function getId() {
        return $this->id;
    }

    public function getName() {
        return $this->name;
    }

    public function getEmail() {
        return $this->email;
    }

    public function getPassword() {
        return $this->password;
    }

    public function setName($name) {
        $this->name = $name;
    }

    public function setEmail($email) {
        $this->email = $email;
    }
}