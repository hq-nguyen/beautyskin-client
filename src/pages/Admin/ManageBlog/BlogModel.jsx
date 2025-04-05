import { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Upload, message } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import uploadFile from '../../../utils/upload';
import { addBlog, editBlog, fetchBlogById } from '../../../apis/blog';

const { Option } = Select;

const BlogModel = ({ isOpen, onClose, onSubmit, initialValues }) => {
    const [form] = Form.useForm();
    const [content, setContent] = useState('');
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const modalContentRef = useRef(null);
    const [initialLoaded, setInitialLoaded] = useState(false);

    // Fetch complete blog data when editing
    useEffect(() => {
        console.log("initialValues in BlogModel:", initialValues);
        const loadBlogDetails = async () => {
            if (initialValues?.id && isOpen) {
                try {
                    setLoading(true);
                    const blogDetails = await fetchBlogById(initialValues.id);
                    setContent(blogDetails.content || '');
                    form.setFieldsValue({
                        title: initialValues.title || '',
                        slug: initialValues.slug || '',
                        author: initialValues.author || '',
                        tag: initialValues.tag || '',
                        publish: initialValues.publish ? dayjs(initialValues.publish) : dayjs(),
                        deleted: initialValues.deleted || false,
                    });

                    if (initialValues.image) {
                        setFileList([{
                            uid: '-1',
                            name: 'image.png',
                            status: 'done',
                            url: initialValues.image,
                        }]);
                    } else {
                        setFileList([]);
                    }
                    
                    setInitialLoaded(true);
                } catch (error) {
                    console.error("Error loading blog details:", error);
                    message.error("Failed to load blog details");
                } finally {
                    setLoading(false);
                }
            } else {
                // Reset form for new blog
                form.resetFields();
                setContent('');
                setFileList([]);
                setInitialLoaded(true);
            }
        };

        if (isOpen) {
            loadBlogDetails();
        } else {
            setInitialLoaded(false);
        }
    }, [initialValues?.id, isOpen, form]);

    const handleOk = () => {
        form.validateFields().then(async (values) => {
            try {
                setLoading(true);
                
                const postData = {
                    title: values.title,
                    slug: values.slug,
                    tag: values.tag,
                    content: content, // Use the state variable
                    image: fileList.length > 0 ? fileList[0].url : null,
                    author: values.author || '', 
                    publish: values.publish.format('YYYY-MM-DD'),
                    deleted: values.deleted,
                };

                console.log("Submitting with content:", content);
                console.log("Post data:", postData);

                if (initialValues?.id) {
                    await editBlog(initialValues.id, postData);
                    message.success('Sửa bài viết thành công');
                } else {
                    await addBlog(postData);
                    message.success('Thêm bài viết thành công');
                }
                
                onSubmit({
                    ...postData,
                    id: initialValues?.id // Make sure to include the ID for proper refresh
                });
                
                form.resetFields();
                setContent('');
                setFileList([]);
                onClose();
            } catch (error) {
                console.error("Error saving post:", error);
                message.error('Failed to save the blog post.');
            } finally {
                setLoading(false);
            }
        });
    };

    const handleContentChange = (value) => {
        setContent(value);
    };

    const uploadProps = {
        listType: 'picture',
        fileList: fileList,
        maxCount: 1,
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
                    <Button key="submit" type="primary" onClick={handleOk} loading={loading}>
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
                {initialLoaded ? (
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
                                name="tag"
                                label="Thẻ"
                                className="w-1/3"
                                rules={[{ required: true, message: 'Vui lòng nhập thẻ!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                        {initialValues?.id && (
                            <Form.Item
                                name="deleted"
                                label="Trạng thái"
                                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                            >
                                <Select>
                                    <Option value={true}>Ẩn bài</Option>
                                    <Option value={false}>Công khai</Option>
                                </Select>
                            </Form.Item>
                        )}
                        <Form.Item
                            label="Nội dung"
                            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                        >
                            <ReactQuill 
                                value={content} 
                                onChange={handleContentChange} 
                            />
                        </Form.Item>
                    </Form>
                ) : (
                    <div className="flex justify-center items-center h-40">
                        Loading...
                    </div>
                )}
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
        tag: PropTypes.string,
        image: PropTypes.string,
        author: PropTypes.string,
        publish: PropTypes.string,
        deleted: PropTypes.bool,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
};

export default BlogModel;