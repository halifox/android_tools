'use client'
import '@ant-design/v5-patch-for-react-19';
import {Button, Card, Space} from 'antd';

export default function Home() {
    return (
        <div className="w-screen h-screen p-6">
            <Card className="w-full h-full" title={"Android"}>
                <Space direction="horizontal" style={{marginTop: 24}}>
                    <Button type="primary" block href="/proguard">ProGuard 反混淆辅助</Button>
                    <Button type="primary" block href="/splash">Splash.img 生成工具</Button>
                    <Button type="primary" block href="/bootanimation">开机动画制作工具</Button>
                </Space>
            </Card>
        </div>
    );
}
