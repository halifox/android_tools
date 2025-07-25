'use client'
import '@ant-design/v5-patch-for-react-19';
import {retrace} from './actions'
import {App, Button, Card, Form, Input, Space, Upload, UploadFile} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import {useState} from 'react'

export default function Home() {
    const {message, notification, modal} = App.useApp();
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async ({mapping, obfuscated}: { mapping: string, obfuscated: string }) => {
        try {
            setLoading(true)
            const deobfuscated = await retrace(mapping, obfuscated)
            form.setFieldsValue({obfuscated: deobfuscated})
        } catch (e: unknown) {
            const error = e instanceof Error ? e : new Error(String(e));
            modal.error({
                title: '失败',
                content: error.stack || error.message,
            })
        } finally {
            setLoading(false)
        }
    }

    const onChange = ({file}: { file: UploadFile }) => {
        if (file.status === 'done') {
            const url = file.response.url;
            form.setFieldValue('mapping', url)
        }
    }

    return (
        <Card
            title="ProGuard 反混淆工具"
            style={{margin: '24px'}}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="mapping" hidden={true}>
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="上传文件"
                    name="upload"
                    valuePropName="fileList"
                    getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
                    rules={[{
                        required: true,
                        message: '请上传文件',
                        validator: (_, value) =>
                            form.getFieldValue("mapping")
                                ? Promise.resolve()
                                : Promise.reject(new Error('请上传文件')),
                    }]}
                >
                    <Upload action="/api/upload" maxCount={1} accept=".txt" onChange={onChange}>
                        <Button icon={<UploadOutlined/>}>选择文件</Button>
                    </Upload>
                </Form.Item>
                <Form.Item label="混淆内容" name="obfuscated" rules={[{required: true, message: '请输入混淆内容'}]}>
                    <Input.TextArea
                        rows={30}
                        placeholder="粘贴混淆日志..."
                        style={{
                            flex: 1,
                            minHeight: 0,
                            fontFamily: 'monospace',
                            fontSize: 14,
                            whiteSpace: 'pre',
                            overflow: 'auto',
                            resize: 'none',
                            backgroundColor: '#f5f5f5',
                            border: '1px solid #ccc',
                            padding: 10,
                            lineHeight: 1.5
                        }}
                    />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button htmlType="submit" type="primary" loading={loading}>
                            反混淆
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    )
}
