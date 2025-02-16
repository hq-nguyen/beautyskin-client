import { useEffect, useState, useRef } from 'react';
import { Button, Space, Table, Image, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { fetchCategory } from '../../../apis/category';
// import { MdOutlineDeleteOutline, MdOutlineRemoveRedEye } from 'react-icons/md';
import Highlighter from 'react-highlight-words';
import { Link } from 'react-router-dom';

const ManageCategory = () => {
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCategory = async () => {
            try {
                const data = await fetchCategory();
                setCategory(data);
            } catch (error) {
                console.error("Error fetching category:", error);
            } finally {
                setLoading(false);
            }
        };
        getCategory();
    }, []);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
                        Search
                    </Button>
                    <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }} searchWords={[searchText]} autoEscape textToHighlight={text ? text.toString() : ''} />
            ) : (
                text
            ),
    });

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Ảnh', dataIndex: 'image', key: 'image', render: (image) => <Image src={image} width={50} /> },
        { title: 'Tên danh mục', dataIndex: 'name', key: 'name', ...getColumnSearchProps('name') },
        { title: 'Mô tả', dataIndex: 'desc', key: 'desc' },
        { title: 'Số lượng sản phẩm', dataIndex: 'quantity', key: 'quantity', sorter: (a, b) => a.quantity - b.quantity },
        { title: 'Số lượng đã bán', dataIndex: 'sale', key: 'sale', sorter: (a, b) => a.sale - b.sale },
        { title: 'Hành động', key: 'action', render: (_, record) => (
            <Space size="middle">
                {/* Add action buttons here */}
            </Space>
          ) 
      },
    ];

    return (
        <div className='p-4'>
            {/* Header */}
            <div className='flex justify-between items-center mb-4'>
                <h1 className="text-2xl font-bold mb-4 text-black">Danh sách danh mục</h1>
                
                {/* Button to Add New Category */}
                <Link to={'/admin/add-category'}>
                  <Button>Thêm danh mục mới</Button>
                </Link>
                
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={category}
                    onChange={(pagination, filters, sorter) => {
                      setFilteredInfo(filters);
                      setSortedInfo(sorter);
                  }}
                  rowKey="id"
                  pagination={{ position: ['bottomRight'] }}
                  rowClassName={(_, index) => (index % 2 === 0 ? "bg-gray-100" : "bg-white")}
                  className="w-full border rounded-lg shadow-md"
              />
          )}
      </div>
  );
};

export default ManageCategory;
