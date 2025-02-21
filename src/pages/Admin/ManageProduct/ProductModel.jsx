import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Form, Checkbox, Select, Row, Col, Upload, message, Modal, Image, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './ProductModel.css';
import { updateProduct } from '../../../apis/product';
import uploadFile from '../../../utils/upload';

const { TextArea } = Input;

const ProductModel = ({ product, onSave, onCancel, visible }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [isDirty, setIsDirty] = useState(false);
    const [loading, setLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        console.log("Product prop changed:", product); // Debugging
        // Load Existing Images
        if (product && product.images && Array.isArray(product.images)) {
            const initialFileList = product.images.filter(imageUrl => imageUrl !== null).map((imageUrl, index) => ({
                uid: `existing-${product.id}-${index}`, // Unique and stable ID
                name: `image-${index}`,
                status: 'done',
                url: imageUrl,  // This is CRUCIAL!
            }));
            setFileList(initialFileList);
        } else {
            setFileList([]);
        }

        // Load other form values
        form.setFieldsValue({
            name: product?.name || '',
            description: product?.description || '',
            category: product?.category || [],
            brand: product?.brand || '',
            price: product?.price || 0,
            status: product?.status || 'còn hàng',
            tag: product?.tag || [],
            capacity: product?.capacity || [],
            skinType: product?.skinType || [],
            // new fields
            usageInstruction: product?.usageInstruction || '',
            skinConcern: product?.skinConcern || [],
            texture: product?.texture || '',
            ingredients: product?.ingredients || '',
            stock: product?.stock || 0,
        });
        setIsDirty(false);
    }, [product, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            // Extract image URLs directly from fileList and filter out null values
            const imageUrls = fileList.map(file => file.url).filter(url => url !== null);

            const updatedValues = { ...values, images: imageUrls };

            const updatedProduct = await updateProduct(product.id, updatedValues);

            message.success('Cập nhật sản phẩm thành công!');
            onSave(updatedProduct); // Pass the updated product (including images) back to the parent
            form.resetFields();  // Reset the form
            setFileList([]); // Clear the fileList

        } catch (error) {
            message.error(error.message || 'Cập nhật sản phẩm không thành công!');
            console.error("Error updating product:", error);
        } finally {
            setLoading(false);
            onCancel();
        }
    };

    const handleCancel = () => {
        if (isDirty) {
            Modal.confirm({
                title: 'Bạn có chắc chắn muốn hủy?',
                content: 'Bạn có những thay đổi chưa được lưu. Bạn có muốn tiếp tục?',
                okText: 'Có',
                cancelText: 'Không',
                onOk() {
                    onCancel();
                },
            });
        } else {
            onCancel();
        }
    };

    // upload image handler
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });


    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => {
        // console.log('newFileList', newFileList)
        const customFileList = newFileList.map(file => {
            if (file.response) {
                return {
                    ...file,
                    url: file.response,
                };
            }
            return file;
        });
        setFileList(customFileList);
        setIsDirty(true);
    };

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
                cursor: 'pointer',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const uploadImage = async (options) => {
        const { onSuccess, onError, file } = options;

        try {
            const res = await uploadFile(file); // Use your Firebase upload function

            console.log("uploadFile returned:", res);  // Debugging

            // Check if res is defined and has the success property
            if (res) {
                // Construct an object that the Upload component expects
                const imageUrl = res;

                // Update the fileList state *immediately* with the new URL
                setFileList(prevFileList => {
                    const updatedFileList = prevFileList.map(item => {
                        if (item.uid === file.uid) {
                            return { ...item, url: imageUrl, status: 'done' }; // Update existing item
                        }
                        return item;
                    });
                    return updatedFileList;
                });

                onSuccess("Ok"); // Inform Upload component of success
                message.success("Upload successful!"); // Provide user feedback
            } else {
                // Handle the error if uploadFile failed
                console.error("Upload failed:", res); // Log the response for debugging
                onError("Upload failed");
                message.error("Upload failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during upload:", error);
            onError("Upload failed");
            message.error("Upload failed: " + error.message); // Show user-friendly error
        }
    };

    const customRequest = async ({ file, onSuccess, onError }) => {
        try {
            const imageUrl = await uploadFile(file);
            onSuccess(imageUrl);
        } catch (error) {
            onError(error);
        }
    };


    const handleRemove = (file) => {
        setFileList((prevFileList) => {
            const newFileList = prevFileList.filter((item) => item.uid !== file.uid);
            return newFileList;
        });
    };

    return (
        <Modal
            title="Chỉnh sửa sản phẩm"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="save" type="primary" loading={loading} onClick={handleSave}>
                    Lưu
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    name="name"
                    label="Tên sản phẩm"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên sản phẩm!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả sản phẩm"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mô tả sản phẩm!',
                        },
                    ]}
                >
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    name="usageInstruction"
                    label="Hướng dẫn sử dụng"
                >
                    <TextArea rows={4} />
                </Form.Item>

                <Form.Item name="category" label="Danh mục">
                    <Checkbox.Group>
                        <Row>
                            {['Chăm sóc da', 'Makeup', 'Đặc trị', 'Dưỡng da', 'Thiết bị'].map((cat) => (
                                <Col span={8} key={cat}>
                                    <Checkbox value={cat}>{cat}</Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>

                <Form.Item name="brand" label="Thương hiệu">
                    <Select>
                        {['Brand A', 'Brand B', 'Brand C', 'Brand D'].map((brand) => (
                            <Select.Option key={brand} value={brand}>
                                {brand}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="publish" label="Ngày xuất khẩu" rules={[{ required: true }]}>
                    <DatePicker />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Giá tiền"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập giá tiền!',
                        },
                    ]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item name="status" label="Trạng thái">
                    <Select>
                        <Select.Option value="còn hàng">Còn hàng</Select.Option>
                        <Select.Option value="hết hàng">Hết hàng</Select.Option>
                        <Select.Option value="hết hàng">Ngừng kinh doanh</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item name="tag" label="Tags">
                    <Checkbox.Group>
                        <Row>
                            {['Sản phẩm mới', 'Bán chạy', 'Hàng giới hạn', 'Phổ biến', 'Mềm', 'Mùi thơm'].map((tag) => (
                                <Col span={8} key={tag}>
                                    <Checkbox value={tag}>{tag}</Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>

                <h3 className="text-xl font-semibold mb-4">Chi tiết cụ thể</h3>

                <Form.Item name="capacity" label="Dung tích / khối lượng">
                    <Checkbox.Group>
                        <Row>
                            {['100ml', '80ml', '100g', '80g'].map((tag) => (
                                <Col span={8} key={tag}>
                                    <Checkbox value={tag}>{tag}</Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>

                <Form.Item name="skinType" label="Loại da">
                    <Checkbox.Group>
                        <Row>
                            {['Da dầu', 'Da khô', 'Da tổng hợp', 'Da thường'].map((type) => (
                                <Col className="mr-4" span={8} key={type}>
                                    <Checkbox value={type}>{type}</Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>

                <Form.Item name="skinConcern" label="Vấn đề da">
                    <Checkbox.Group>
                        <Row>
                            {['Da mụn', 'Da lão hóa', 'Da lỗ chân lông', 'Da có nếp nhăn'].map((type) => (
                                <Col className="mr-4" span={8} key={type}>
                                    <Checkbox value={type}>{type}</Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>

                <Form.Item
                    name="ingredients"
                    label="Thành phần"
                >
                    <Input />
                </Form.Item>

                <Form.Item name="texture" label="Chất liệu">
                    <Select>
                        {['Dạng dung dịch', 'Dạng kem', 'Serum', 'Tạo bọt', 'Kết cấu gel'].map((texture) => (
                            <Select.Option key={texture} value={texture}>
                                {texture}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="origin" label="Xuất xứ">
                    <Select>
                        {['Hàn Quốc', 'Trung Quốc', 'Việt Nam', 'Ấn Độ', 'Singapore', 'England', 'US'].map((origin) => (
                            <Select.Option key={origin} value={origin}>
                                {origin}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="stock"
                    label="Tồn kho"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tồn kho!',
                        },
                    ]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item label="Hình ảnh sản phẩm">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        customRequest={customRequest}
                        onRemove={handleRemove}
                        onPreview={handlePreview}
                    >
                        {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                    {previewImage && (
                        <Image
                            wrapperStyle={{
                                display: 'none',
                            }}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) => setPreviewOpen(visible),
                                afterOpenChange: (visible) => !visible && setPreviewImage(''),
                            }}
                            src={previewImage}
                        />
                    )}
                </Form.Item>
            </Form>
        </Modal>
    );
};
ProductModel.propTypes = {
    product: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
};

export default ProductModel;
