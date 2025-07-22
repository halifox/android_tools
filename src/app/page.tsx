'use client'
import {retrace, uploadMapping} from './actions'
import {Button, Card, Form, Input, Space, Upload} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import {useState} from 'react'

export default function Home() {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(true)

    const handleUpload = async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        const mapping = await uploadMapping(formData)
        form.setFieldsValue({mapping})
        setDisabled(false)
        return true
    }

    const handleSubmit = async ({mapping, obfuscated}: { mapping: string, obfuscated: string }) => {
        setLoading(true)
        const deobfuscated = await retrace(mapping, obfuscated)
        form.setFieldsValue({obfuscated: deobfuscated})
        setLoading(false)
    }

    return (
        <Card
            title="ProGuard 反混淆工具"
            style={{margin: '24px'}}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="mapping" hidden>
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="上传 mapping.txt 文件"
                    name="mapping_file"
                    rules={[{required: true, message: '请上传 mapping.txt 文件'}]}
                    valuePropName="fileList"
                    getValueFromEvent={e => e?.fileList}
                >
                    <Upload beforeUpload={handleUpload} maxCount={1} accept=".txt" showUploadList={true}>
                        <Button icon={<UploadOutlined/>}>选择文件</Button>
                    </Upload>
                </Form.Item>
                <Form.Item
                    label="混淆内容"
                    name="obfuscated"
                    rules={[{required: true, message: '请输入混淆内容'}]}
                >
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
                        <Button
                            htmlType="submit"
                            type="primary"
                            loading={loading}
                        >
                            反混淆
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    )
}
