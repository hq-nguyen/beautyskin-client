import { useState, useEffect } from 'react';
import { Button, Modal, Space, Table, Tag } from 'antd';
import { deleteBlog, fetchBlogsIsFalse } from '../../../apis/blog';
import dayjs from 'dayjs';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import BlogModel from './BlogModel';

const ManageBlog = () => {
    const [blog, setBlog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [initialValues, setInitialValues] = useState({});

    const handleOpenModel = () => {
        setIsOpen(true);
    };

    const handleCloseModel = () => {
        setIsOpen(false);
        setInitialValues(null);
    };

    const handleSubmit = async (values) => {
        console.log(values);
        const updatedBlogs = await fetchBlogsIsFalse();
        setBlog(updatedBlogs);
        setIsOpen(false);
        setInitialValues(null);
    };

    const handleEdit = (record) => {
        setInitialValues(record);
        handleOpenModel();
    }

    const handleDelete = (item) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa khách hàng này?',
            content: 'Hành động này không thể hoàn tác!',
            okText: 'Có, xóa',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                try {
                    await deleteBlog(item.id); 
                    setBlog(blog.filter(b => b.id !== item.id));
                    Modal.success({ content: 'Xóa blog thành công!' });
                } catch (e) {
                    Modal.error({ title: 'Xóa blog thất bại!', content: e.message });
                }
            },
        });
    };

    useEffect(() => {
        const getBlog = async () => {
            try {
                const data = await fetchBlogsIsFalse();
                setBlog(data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        getBlog();
    }, []);

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            render: (title) => (
                <span title={title}>{title.length > 16 ? title.substring(0, 16) + '...' : title}</span>
            ),
        },
        {
            title: 'Ảnh nền',
            dataIndex: 'image',
            key: 'image',
            render: (image) => (
                <img src={image} alt="blog" className="w-20 h-20 object-cover" />
            ),
        },
        {
            title: 'Ngày đăng',
            dataIndex: 'publish',
            key: 'publish',
            sorter: (a, b) => dayjs(a.publish).valueOf() - dayjs(b.publish).valueOf(),
            sortDirections: ['ascend', 'descend'],
            render: (publish) => dayjs(publish).format('DD-MM-YYYY'),
        },
        {
            title: 'Tags',
            dataIndex: 'tag',
            key: 'tag',
            render: (tag) => (
                <Tag color="blue">{tag}</Tag>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'deleted',
            key: 'deleted',
            render: (deleted) => (
                <Tag color={deleted ? 'red' : 'green'}>
                    {deleted ? 'Không hiển thị' : 'Đang hiển thị'}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type='text' onClick={() => handleEdit(record)} icon={<CiEdit className="text-blue-500 w-5 h-5" />} />
                    <Button type='text' onClick={() => handleDelete(record)} icon={<MdOutlineDeleteOutline className="text-blue-500 w-5 h-5"/>}></Button>
                </Space>
            ),
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <div className='p-4'>
            {/* Header */}
            <div className='flex justify-between items-center mb-4'>
                <h1 className="text-2xl font-bold mb-4 text-black">Danh sách bài viết</h1>
                {/* Button to Add New Blog */}
                <Button type="primary" onClick={handleOpenModel}>Thêm bài viết</Button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={blog}
                    onChange={onChange}
                    rowKey="id"
                    pagination={{ position: ['bottomRight'] }}
                    rowClassName={(_, index) => (index % 2 === 0 ? "bg-gray-100" : "bg-white")}
                    className="w-full border rounded-lg shadow-md"
                />
            )}

            <BlogModel
                isOpen={isOpen}
                onClose={handleCloseModel}
                onSubmit={handleSubmit}
                initialValues={initialValues}
            />
        </div>
    );
};

export default ManageBlog;