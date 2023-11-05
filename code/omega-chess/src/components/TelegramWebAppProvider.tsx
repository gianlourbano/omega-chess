"use client"

import { WebAppProvider } from "@vkruglikov/react-telegram-web-app";

interface TelegramWebAppProviderProps {
    options: any;
    children: React.ReactNode;
}


const TelegramWebAppProvider = ({ children, options } : TelegramWebAppProviderProps) => (
    <WebAppProvider options={options}>
        {children}
    </WebAppProvider>
);

export default TelegramWebAppProvider;