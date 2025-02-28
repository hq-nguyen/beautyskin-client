import { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Upload, message } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import uploadFile from '../../../utils/upload';
import { addBlog, editBlog } from '../../../apis/blog';
import { toast } from 'react-toastify';

const { Option } = Select;

const BlogModel = ({ isOpen, onClose, onSubmit, initialValues }) => {
    const [form] = Form.useForm();
    const [content, setContent] = useState(initialValues?.content || '');
    const [fileList, setFileList] = useState([]);
    const modalContentRef = useRef(null);

    useEffect(() => {
        form.setFieldsValue({
            title: initialValues?.title || '',
            slug: initialValues?.slug || '',
            author: initialValues?.author || '',
            publish: initialValues?.publish ? dayjs(initialValues.publish) : dayjs(),
            deleted: initialValues?.deleted || false,
        });
        setContent(initialValues?.content || '');

        if (initialValues?.image) {
            setFileList([{
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: initialValues.image,
            }]);
        } else {
            setFileList([]);
        }

    }, [initialValues, form]);

    const handleOk = () => {
        form.validateFields().then(async (values) => {
            const postData = {
                title: values.title,
                slug: values.slug,
                content: content,
                image: fileList.length > 0 ? fileList[0].url : null,
                author: values.author || '', // Author is optional
                publish: values.publish.format('YYYY-MM-DD'),
                deleted: values.deleted,
            };

            try {
                if (initialValues?.id) {
                    await editBlog(initialValues.id, postData);
                    toast.success('Sửa bài viết thành công');
                } else {
                    await addBlog(postData);
                    toast.success('Thêm bài viết thành công');
                }
                onSubmit(postData);
                form.resetFields();
                onClose(); // Call onClose to close the modal
            } catch (error) {
                console.error("Error saving post:", error);
                message.error('Failed to save the blog post.');
            }
        });
    };

    const handleContentChange = (value) => {
        setContent(value);
    };

    const uploadProps = {
        listType: 'picture',
        fileList: fileList,
        maxCount: 1, // Only allow 1 image
        beforeUpload: async (file) => {
            try {
                const uploadedImageURL = await uploadFile(file);

                setFileList([{
                    uid: '-1',
                    name: file.name,
                    status: 'done',
                    url: uploadedImageURL,
                }]);
                return false; // Prevent default upload
            } catch (error) {
                console.error("Error uploading image:", error);
                message.error(`Failed to upload ${file.name}.`);
                return false;
            }
        },
        onRemove: () => {
            setFileList([]);
        },
    };

    return (
        isOpen ? (
            <Modal
                title={initialValues?.id ? "Sửa Blog" : "Thêm Blog"}
                open={isOpen}
                onCancel={onClose}
                footer={[
                    <Button key="cancel" onClick={onClose}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        {initialValues?.id ? "Lưu" : "Thêm"}
                    </Button>,
                ]}
                style={{ top: '40px' }}
                styles={{
                    body: {
                        paddingBottom: '40px',
                    },
                }}
                getContainer={false}
                ref={modalContentRef}
                destroyOnClose={true}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="slug"
                        label="Đường dẫn"
                        rules={[{ required: true, message: 'Vui lòng nhập đường dẫn!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Ảnh bìa">
                        <Upload {...uploadProps} maxCount={1}>
                            <Button>Tải lên ảnh</Button>
                        </Upload>
                    </Form.Item>
                    <div className="flex items-center space-x-4">
                        <Form.Item
                            name="author"
                            label="Tác giả"
                            className="w-1/3"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="publish"
                            label="Ngày đăng"
                            className="w-1/3"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày đăng!' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="deleted"
                            label="Trạng thái"
                            className="w-1/3"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                        >
                            <Select>
                                <Option value={true}>Ẩn bài</Option>
                                <Option value={false}>Công khai</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <Form.Item
                        name="content"
                        label="Nội dung"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                    >
                        <ReactQuill value={content} onChange={handleContentChange} />
                    </Form.Item>
                </Form>
            </Modal>
        ) : null
    );
};

BlogModel.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.shape({
        title: PropTypes.string,
        slug: PropTypes.string,
        content: PropTypes.string,
        image: PropTypes.string,
        author: PropTypes.string,
        publish: PropTypes.string,
        deleted: PropTypes.bool,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
};

export default BlogModel;
