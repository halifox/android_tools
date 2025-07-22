import "./globals.css";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'ProGuard 反混淆工具',
    description: '在线解析和还原 ProGuard 混淆的类与方法，支持批量映射处理',
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
        {children}
        </body>
        </html>
    );
}
