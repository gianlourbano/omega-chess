import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
        gridTemplateAreas: {
            "dev-content": ["opts board", "stats board"],
            "profile": [
                "profile profile profile friends",
                "stats stats stats friends",
                "stats stats stats friends",
                "stats stats stats friends",
            ],
            "mobile-profile": ["profile", "stats", "friends"],
            "edit-tab": ["username", "email", "passwordOld", "passwordNew"],
        },
    },
    plugins: [require("@savvywombat/tailwindcss-grid-areas")],
};
export default config;
