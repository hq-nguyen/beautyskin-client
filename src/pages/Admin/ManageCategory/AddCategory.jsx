import { useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { addCategory } from '../../../apis/category'; // Import your API method

const AddCategory = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    const handleImageChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const uploadButton = (
        <div>
            {loading ? <div /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            // Prepare data for API
            const categoryData = {
                ...values,
                image: imageUrl, // Send base64 image data
            };

            await addCategory(categoryData);
            form.resetFields();
            setImageUrl(null);
            message.success('Category added successfully!');
        } catch (error) {
            console.error('Failed to add category:', error);
            message.error('Failed to add category!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Thêm danh mục mới</h1>
            <Form
                form={form}
                layout="vertical"
                name="add_category_form"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="name"
                    label="Tên danh mục"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên danh mục!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="desc"
                    label="Mô tả"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mô tả!',
                        },
                    ]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    name="image"
                    label="Ảnh"
                >
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={() => false}
                        onChange={handleImageChange}
                    >
                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Thêm danh mục
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddCategory;