import { Header } from "../components/Header.js";

export function AppLayout(content) {
    return `
        <div class="min-h-screen bg-gray-100">

            ${Header()}

            <main class="max-w-7xl mx-auto p-6">
                ${content}
            </main>

        </div>
    `;
}