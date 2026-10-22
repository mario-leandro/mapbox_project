const routes = {};

export function registerRoute(path, component) {
    routes[path] = component;
}

export function navigate(path) {
    window.history.pushState({}, "", path);

    renderRoute();
}

export function renderRoute() {
    const path = window.location.pathname;
    const page = routes[path] || routes["/404"];

    const app = document.getElementById("app");
    if (!app || !page) return;
    app.innerHTML = page.render();

    if (typeof page.mount === "function") {
        page.mount();
    }
}

window.addEventListener("popstate", renderRoute);