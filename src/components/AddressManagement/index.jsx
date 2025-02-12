/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import axios from "axios";


const AddressManagement = () => {
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            name: 'Trương Quốc Hưng',
            phone: '0912726117',
            address: 'Phường Cát Lái, Thành Phố Thủ Đức, Hồ Chí Minh',
            isDefault: true
        },
        {
            id: 2,
            name: 'Trương Quốc Hưng',
            phone: '0912726117',
            address: 'Phường 4, Thành phố Sóc Trăng',
            isDefault: false
        }
    ]);

    const [newAddress, setNewAddress] = useState({
        name: '',
        phone: '',
        address: '',
        isDefault: false
    });

    const handleAddAddress = async () => {
        alert('handle address')
    };

    const handleEditAddress = (id) => {
        alert('edit address')
    };

    const handleDeleteAddress = async (id) => {
        alert('delte address')
    };

    return (
        <div className="flex-1 bg-white p-5 rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] mt-[35px]">
            <h2 className="text-xl font-bold mb-4">Số địa chỉ nhận hàng</h2>

            <div className="space-y-4">
                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        className="border rounded-lg p-4 flex justify-between items-center"
                    >
                        <div>
                            <div className="font-semibold">
                                {addr.name} - {addr.phone}
                                {addr.isDefault && (
                                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded-md text-xs">
                                        Mặc định
                                    </span>
                                )}
                            </div>
                            <div className="text-gray-600">{addr.address}</div>
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEditAddress(addr.id)}
                                className="text-blue-500 hover:bg-blue-100 p-2 rounded-full"
                            >
                                <Edit size={20} />
                            </button>
                            <button
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleAddAddress}
                className="mt-4 w-full text-white py-2 rounded-lg bg-[#EE1F5B] hover:opacity-90 transition"
            >
                Thêm địa chỉ mới
            </button>
        </div>
    );
};

export default AddressManagement;