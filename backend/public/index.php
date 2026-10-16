<?php

require_once __DIR__ . '/../bootstrap/app.php';

use Src\Core\Router;
use Src\Controllers\AuthController;
use Src\Services\AuthService;
use Src\Core\Database;
use Src\Repositories\AuthRepository;
use Src\Middleware\AuthMiddleware;
use Src\Helpers\Helper;

$db_connection = new Database();
$userRepository = new AuthRepository($db_connection);
$authService = new AuthService($userRepository);
$helper = new Helper();
$authController = new AuthController($authService,  new AuthMiddleware($helper), $helper);

$router = new Router();

$registerRoutes = require __DIR__ . '/../src/Routes/api.php';

$registerRoutes($router, $authController);

$router->dispatch(
    $_SERVER['REQUEST_METHOD'],
    $_SERVER['REQUEST_URI']
);
