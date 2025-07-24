import "./globals.css";
import {Metadata} from "next";
import '@ant-design/v5-patch-for-react-19';
import {App, ConfigProvider} from "antd";

export const metadata: Metadata = {
    title: 'Android 在线工具箱',
    icons: {
        icon: '/favicon.svg',
    },
}
export default function RootLayout({children,}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <ConfigProvider>
            <App>
                {children}
            </App>
        </ConfigProvider>
        </body>
        </html>
    );
}
