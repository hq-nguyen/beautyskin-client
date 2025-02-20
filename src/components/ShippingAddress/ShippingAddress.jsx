import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ShippingAddress = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://67825c10c51d092c3dcf2d8d.mockapi.io/address');
                // Sort addresses to show default address first
                const sortedAddresses = response.data.sort((a, b) => b.isDefault - a.isDefault);
                setAddresses(sortedAddresses);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching addresses", error);
                setLoading(false);
            }
        };

        fetchAddresses();
    }, []);

    // Get default address
    const defaultAddress = addresses.find(addr => addr.isDefault);

    return (
        <div className="flex-1 bg-white p-6 rounded-lg mt-[35px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Số địa chỉ nhận hàng</h2>
                <button className="bg-[#d90429] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-700 transition-colors">
                    <Link to={'/user/add-address'}>Thêm địa chỉ mới →</Link>
                </button>
            </div>
            <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-lg mb-4">Địa chỉ của tôi</h3>
                
                {loading ? (
                    <p className="text-gray-600">Đang tải địa chỉ...</p>
                ) : addresses.length === 0 ? (
                    <div className="flex items-center gap-2">
                        <p className="text-gray-600">Hiện tại bạn chưa có địa chỉ nào!</p>
                        <Link to={'/user/add-address'} className="text-[#d90429] hover:underline">Thêm mới tại đây!</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {defaultAddress && (
                            <div className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between">
                                    <div>
                                        <span className="px-2 py-1 bg-red-100 text-red-600 rounded-md text-xs mb-2 inline-block">
                                            Địa chỉ mặc định
                                        </span>
                                        <h4 className="font-medium">{defaultAddress.name} - {defaultAddress.phone}</h4>
                                        <p className="text-gray-600 mt-1">{defaultAddress.address}</p>
                                    </div>
                                    <Link 
                                        to={'/user/add-address'} 
                                        className="text-blue-500 hover:underline self-start"
                                    >
                                        Thay đổi
                                    </Link>
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-4">
                            <h4 className="font-medium mb-2">Tất cả địa chỉ ({addresses.length})</h4>
                            <Link 
                                to={'/user/manage-address'} 
                                className="text-[#d90429] hover:underline"
                            >
                                Quản lý địa chỉ →
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShippingAddress;