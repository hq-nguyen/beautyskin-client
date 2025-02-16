/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Edit, Trash2, X } from 'lucide-react';
import axios from "axios";
import { toast } from "react-toastify";

const AddressManagement = () => {
    const [addresses, setAddresses] = useState([]);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [errors, setErrors] = useState({});

    const [newAddress, setNewAddress] = useState({
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

    const validateForm = (address) => {
        const newErrors = {};

        // Validate phone (must be 10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(address.phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddAddress = async () => {
        alert('handle address')
    };

    const handleEditAddress = (id) => {
        const addressToEdit = addresses.find(addr => addr.id === id);
        setEditingAddress(addressToEdit);
        setErrors({});
        setShowEditModal(true);
    };

    const handleUpdateAddress = async () => {
        if (!validateForm(editingAddress)) {
            return;
        }

        try {
            const response = await axios.put(
                `https://67825c10c51d092c3dcf2d8d.mockapi.io/address/${editingAddress.id}`,
                editingAddress
            );
            toast.success('Cập nhật địa chỉ thành công');
            await fetch();
            setShowEditModal(false);
        } catch (error) {
            toast.error('Không thể cập nhật địa chỉ');
            console.log("Error updating address", error);
        }
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

            {/* Edit Address Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-[500px]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Chỉnh sửa địa chỉ</h3>
                            <button 
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên người nhận
                                </label>
                                <input
                                    type="text"
                                    value={editingAddress?.name || ''}
                                    onChange={(e) => setEditingAddress({...editingAddress, name: e.target.value})}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.name ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    value={editingAddress?.phone || ''}
                                    onChange={(e) => setEditingAddress({...editingAddress, phone: e.target.value})}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.phone ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Địa chỉ
                                </label>
                                <textarea
                                    value={editingAddress?.address || ''}
                                    onChange={(e) => setEditingAddress({...editingAddress, address: e.target.value})}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.address ? 'border-red-500' : ''
                                    }`}
                                    rows={3}
                                />
                                {errors.address && (
                                    <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                                )}
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={editingAddress?.isDefault || false}
                                    onChange={(e) => setEditingAddress({...editingAddress, isDefault: e.target.checked})}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">
                                    Đặt làm địa chỉ mặc định
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdateAddress}
                                className="px-4 py-2 bg-[#EE1F5B] text-white rounded-lg hover:bg-opacity-80"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>
            )}

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