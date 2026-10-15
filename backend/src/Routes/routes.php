<?php

namespace Src\Routes;

use Src\Helpers\Helper;

class Routes {
    private array $routes = [];
    private Helper $helper;
    
    public function __construct() {
        $this->helper = new Helper();
    }

    public function get(string $path, callable $callback): void
    {
        $this->routes['GET'][$path] = $callback;
    }

    public function post(string $path, callable $callback): void
    {
        $this->routes['POST'][$path] = $callback;
    }

    public function put(string $path, callable $callback): void
    {
        $this->routes['PUT'][$path] = $callback;
    }

    public function patch(string $path, callable $callback): void
    {
        $this->routes['PATCH'][$path] = $callback;
    }

    public function delete(string $path, callable $callback): void
    {
        $this->routes['DELETE'][$path] = $callback;
    }

    public function dispatch(string $method, string $uri) {
        $path = parse_url($uri, PHP_URL_PATH);

        $routes = $this->routes[$method] ?? [];

        foreach($routes as $route => $callback) {
            $pattern = preg_replace('#\{[^/]+\}#', '([^/]+)', $route);
            $pattern = '#^' . $pattern . '$#';

            if (preg_match($pattern, $path, $matches)) {
                array_shift($matches);
                return call_user_func_array($callback, $matches);
            } else {
                http_response_code(404);
                $this->helper->Response(false, ['message' => "Rota não encontrada: " . $path], 404);
            }
        }
    }
}