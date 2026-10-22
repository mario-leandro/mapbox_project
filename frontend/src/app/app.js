import { AppLayout } from "./layout.js";
import {
    registerRoute,
    renderRoute
} from "./core/router.js";

import { Login } from "./pages/Login.js";
import { Register } from "./pages/Register.js";
import { Dashboard } from "./pages/Dashboard.js";
import { NotFound } from "./pages/NotFound.js";

registerRoute("/login", () => AppLayout(Login()));
registerRoute("/register", () => AppLayout(Register()));
registerRoute("/dashboard", () => AppLayout(Dashboard()));
registerRoute("/404", () => AppLayout(NotFound()));

renderRoute();