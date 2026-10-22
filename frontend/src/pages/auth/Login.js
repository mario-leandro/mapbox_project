import { authService } from "../services/authService.js";
import { navigate } from "../core/router.js";

export const Login = {
    render() {
        return `
            <main class="min-h-screen flex items-center justify-center">
                <form id="login-form" class="space-y-4">

                    <h1 class="text-2xl font-bold">
                        Login
                    </h1>

                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        required
                    >

                    <input
                        type="password"
                        name="password"
                        placeholder="Senha"
                        required
                    >

                    <button type="submit">
                        Entrar
                    </button>

                </form>
            </main>
        `;
    },

    mount() {
        const form = document.getElementById("login-form");

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = new FormData(form);

            const email = formData.get("email");
            const password = formData.get("password");

            try {
                await authService.login(email, password);

                navigate("/dashboard");

            } catch (error) {
                alert(error.message);
            }
        });
    }
};