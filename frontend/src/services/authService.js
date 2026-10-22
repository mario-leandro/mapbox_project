import { api } from "../core/api.js";

export const authService = {
    login(email, password) {
        return api("/auth/login", {
            email,
            password
        }, "POST");
    },

    register(name, email, password) {
        return api("/auth/register", {
            name,
            email,
            password
        }, "POST");
    },

    me() {
        return api("/auth/me");
    }
};