"use client"

import { BackButton, WebAppProvider } from "@vkruglikov/react-telegram-web-app";

interface TelegramWebAppProviderProps {
    options: any;
    children: React.ReactNode;
}


const TelegramWebAppProvider = ({ children, options } : TelegramWebAppProviderProps) => (
    <WebAppProvider options={options}>
        {children}
        <BackButton />
    </WebAppProvider>
);

export default TelegramWebAppProvider;