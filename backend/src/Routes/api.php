<?php

use Src\Core\Router;
use Src\Controllers\AuthController;

return function (Router $router, AuthController $auth): void {
    // var_dump([
    //     'login' => is_callable([$auth, 'login']),
    //     'register' => is_callable([$auth, 'register']),
    //     'logout' => is_callable([$auth, 'logout'])
    // ]);

    // exit;

    // Auth
    $router->post('/api/auth/login', [
        $auth,
        'login'
    ]);
    $router->post('/api/auth/register', [
        $auth,
        'register'
    ]);
    $router->get('/api/auth/me', [
        $auth,
        'me'
    ]);
};