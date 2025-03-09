import { useState, useEffect } from 'react';
import { Table, Tag, Space, Modal, Button, Image, Badge } from 'antd';
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { fetchProducts, deleteProduct } from '../../../apis/product';
import { ProductAttributeService } from '../../../apis/productAttribute';
import ProductModel from './ProductModel';
import QuickViewModal from './QuickViewProduct';
import { Link } from 'react-router-dom';

const ManageProduct = () => {
    const [products, setProducts] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    // Add these state variables to store the attributes
    const [categories, setCategories] = useState([]);
    const [textures, setTextures] = useState([]);
    const [skinTypes, setSkinTypes] = useState([]);
    const [skinConcerns, setSkinConcerns] = useState([]);
    const [tags, setTags] = useState([]);

    // Fetch product attributes
    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                const [cate, text, skinType, concerns, tagList] = await Promise.all([
                    ProductAttributeService.getCategories(),
                    ProductAttributeService.getTextures(),
                    ProductAttributeService.getSkinType(),
                    ProductAttributeService.getConcern(),
                    ProductAttributeService.getTags()
                ]);

                setCategories(cate);
                setTextures(text);
                setSkinTypes(skinType);
                setSkinConcerns(concerns);
                setTags(tagList);
            } catch (error) {
                console.error("Error fetching product attributes:", error);
            }
        };

        fetchAttributes();
    }, []);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setCurrentProduct(null);
    };

    const handleQuickView = (product) => {
        setCurrentProduct(product);
        setIsQuickViewOpen(true);
    };

    const handleCloseQuickView = () => {
        setIsQuickViewOpen(false);
        setCurrentProduct(null);
    };

    const handleSaveProduct = (updatedProduct) => {
        try {
            // Reconstruct the complete product object with all relational data
            const updatedProductWithRelations = {
                ...updatedProduct,
                // Reconstruct the category object
                category: updatedProduct.categoryId
                    ? categories.find(c => c.id === updatedProduct.categoryId)
                    : null,
                // Reconstruct the skinTypes array
                skinTypes: updatedProduct.skinTypeId
                    ? updatedProduct.skinTypeId.map(id => skinTypes.find(type => type.id === id)).filter(Boolean)
                    : [],
                // Reconstruct the skinConcerns array
                skinConcerns: updatedProduct.skinConcernId
                    ? updatedProduct.skinConcernId.map(id => skinConcerns.find(concern => concern.id === id)).filter(Boolean)
                    : [],
                // Reconstruct the textures array
                textures: updatedProduct.forms && updatedProduct.forms.length > 0
                    ? [textures.find(texture => texture.id === updatedProduct.forms[0])].filter(Boolean)
                    : [],
                // Reconstruct the tags array
                tags: updatedProduct.tagId
                    ? updatedProduct.tagId.map(id => tags.find(tag => tag.id === id)).filter(Boolean)
                    : []
            };

            const updatedProducts = products.map(product =>
                product.id === updatedProductWithRelations.id ? updatedProductWithRelations : product
            );
            setProducts(updatedProducts);
            setIsModalVisible(false);
            setCurrentProduct(null);
        } catch (error) {
            console.error("Error updating product in state:", error);
        }
    };

    const handleDelete = (product) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
            content: 'Hành động này không thể hoàn tác!',
            okText: 'Có, xóa',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                try {
                    await deleteProduct(product.id);
                    setProducts(products.filter(p => p.id !== product.id));
                    Modal.success({
                        content: 'Xóa sản phẩm thành công!',
                    });
                } catch (error) {
                    Modal.error({
                        title: 'Xóa sản phẩm thất bại!',
                        content: error.message,
                    });
                }
            },
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return 'success';
            case 'OUT_OF_STOCK':
                return 'error';
            case 'INSUFFICIENT_STOCK':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return 'Có sẵn';
            case 'OUT_OF_STOCK':
                return 'Hết hàng';
            case 'INSUFFICIENT_STOCK':
                return 'Ngừng kinh doanh';
            default:
                return status;
        }
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Ảnh',
            key: 'image',
            width: 80,
            render: (record) => {
                if (record.images && record.images.length > 0) {
                    return (
                        <Image
                            src={record.images[0].url}
                            alt="product"
                            style={{ width: 50, height: 50, objectFit: 'cover' }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/no-image.png";
                            }}
                        />
                    );
                } else {
                    return <div>No Image</div>;
                }
            },
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
        },
        {
            title: 'Danh mục',
            key: 'category',
            render: (record) => {
                if (record.category) {
                    return <Tag color="blue">{record.category.name}</Tag>;
                } else {
                    return <Tag color="default">Chưa phân loại</Tag>;
                }
            }
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            key: 'price',
            render: (price) => price ? `${price.toLocaleString()} đ` : 'N/A'
        },
        {
            title: 'Tồn kho',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock) => stock ? stock.toLocaleString() : 0
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Badge
                    status={getStatusColor(status)}
                    text={getStatusText(status)}
                />
            )
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createDateTime',
            key: 'createDateTime',
            render: (date) => new Date(date).toLocaleDateString('vi-VN')
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => handleEdit(record)} icon={<CiEdit className="text-blue-500 w-5 h-5" />} />
                    <Button onClick={() => handleDelete(record)} icon={<MdOutlineDeleteOutline className="text-red-500 w-5 h-5" />} />
                    <Button onClick={() => handleQuickView(record)} icon={<MdOutlineRemoveRedEye className="text-blue-500 w-5 h-5" />} />
                </Space>
            ),
        },
    ];

    return (
        <div className="p-4">
            <div className='flex justify-between items-center mb-4'>
                <h1 className="text-2xl font-bold mb-4 text-black">Danh sách sản phẩm</h1>
                <Link to="/admin/add-product">
                    <Button type="primary">Thêm sản phẩm</Button>
                </Link>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={products}
                    rowKey="id"
                    pagination={{ position: ['bottomRight'] }}
                    rowClassName={(_, index) => (index % 2 === 0 ? "bg-gray-100" : "bg-white")}
                    className="w-full border rounded-lg shadow-md"
                    scroll={{ x: 1200 }}
                />
            )}

            {currentProduct && (
                <ProductModel
                    key={currentProduct.id}
                    product={currentProduct}
                    onSave={handleSaveProduct}
                    onCancel={handleCloseModal}
                    visible={isModalVisible}
                    categories={categories}
                    textures={textures}
                    skinTypes={skinTypes}
                    skinConcerns={skinConcerns}
                    tags={tags}
                />
            )}

            <QuickViewModal
                product={currentProduct}
                onCancel={handleCloseQuickView}
                visible={isQuickViewOpen}
            />
        </div>
    );
};

export default ManageProduct;