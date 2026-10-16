<?php

use Src\Core\Router;
use Src\Controllers\AuthController;

return function (Router $router, AuthController $auth): void {
    // Auth
    $router->post('/api/auth/login', [
        $auth,
        'login'
    ]);
    $router->post('/api/auth/register', [
        $auth,
        'register'
    ]);
    $router->post('/api/auth/logout', [
        $auth,
        'logout'
    ]);
};