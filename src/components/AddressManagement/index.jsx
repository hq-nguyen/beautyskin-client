/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Edit, Trash2, X } from 'lucide-react';
import axios from "axios";
import { toast } from "react-toastify";

const AddressManagement = () => {
    const [addresses, setAddresses] = useState([]);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);

    const [newAddress,  setNewAddress] = useState({
        name: '',
        phone: '',
        address: '',
        isDefault: false
    }); 

    const fetch = async () => {
        console.log("fetching address");
        const response = await axios.get('https://67825c10c51d092c3dcf2d8d.mockapi.io/address')
        console.log(response.data);
        setAddresses(response.data)
        console.log("done fetching address");
    }

    useEffect(() => {
        fetch();
    }, [])

    const handleAddAddress = async () => {
        alert('handle address')
    };

    const handleEditAddress = (id) => {
        
    };

    const confirmDelete = (id) => {
        setAddressToDelete(id);
        setShowConfirmDelete(true);
    };

    const handleDeleteAddress = async () => {
        try {
            const response = await axios.delete(`https://67825c10c51d092c3dcf2d8d.mockapi.io/address/${addressToDelete}`)
            toast.success('successful delete address')
            await fetch();
            setShowConfirmDelete(false);
        } catch (error) {
            toast.error('Fail to delete address')
            console.log("Error deleting address", error);
        }
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
                                onClick={() => confirmDelete(addr.id)}
                                className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Confirm Delete Modal */}
            {showConfirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Xác nhận xóa</h3>
                            <button 
                                onClick={() => setShowConfirmDelete(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <p className="mb-6">Bạn có chắc chắn muốn xóa địa chỉ này không?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowConfirmDelete(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDeleteAddress}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}

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