export function Button({
    text,
    type = "button",
    variant = "primary"
}) {
    const variants = {
        primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900"
    };

    return `
        <button
            type="${type}"
            class="px-4 py-2 rounded-lg transition-colors ${variants[variant]}"
        >
            ${text}
        </button>
    `;
}