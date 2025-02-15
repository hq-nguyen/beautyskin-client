import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Modal, Button, Image } from 'antd';
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { fetchProducts, deleteProduct } from '../../../apis/product';
import ProductModel from './ProductModel';
import { Link } from 'react-router-dom';

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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
    console.log("Product to edit:", product); // Debugging
    setCurrentProduct(product);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setCurrentProduct(null); // Reset currentProduct when closing
  };

  const handleSaveProduct = (updatedProduct) => {
    console.log("Updated Product:", updatedProduct); // Debugging
    console.log("Updated product images:", updatedProduct.images);
    const updatedProducts = products.map(product =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    setProducts(updatedProducts);
    setIsModalVisible(false); // Close the modal
    setCurrentProduct(null);
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

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ảnh',
      dataIndex: 'images',
      key: 'images',
      render: (images) => {
        if (images && images.length > 0) { // Make sure images exist and is an array
          return (
            <Image
              src={images[0]} // Display the first image
              alt="product"
              style={{ width: 50, height: 50 }}
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = "no img"; // Replace with a default image URL
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
    },
    {
      title: 'Phân loại',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        const categories = Array.isArray(category) ? category : [category || 'No Category'];
        return categories.map((cat, index) => (
          <Tag color="blue" key={`${cat}-${index}`}>{cat}</Tag>
        ));
      }
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString()} đ`
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)} icon={<CiEdit className="text-blue-500 w-5 h-5" />} />
          <Button onClick={() => handleDelete(record)} icon={<MdOutlineDeleteOutline className="text-red-500 w-5 h-5" />} />
          <Button icon={<MdOutlineRemoveRedEye className="text-blue-500 w-5 h-5" />}></Button>
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
        />
      )}

      {currentProduct && (
        <ProductModel
          key={`${currentProduct.id}-${Date.now()}`} // Add a unique key
          product={currentProduct}
          onSave={handleSaveProduct}
          onCancel={handleCloseModal}
          visible={isModalVisible}
        />
      )}
    </div>
  );
};

export default ManageProduct;
