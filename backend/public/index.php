<?php

require_once __DIR__ . '/../bootstrap/app.php';

use Src\Routes\Routes;

Src\Config\Cors::handle();

$router = new Routes($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
