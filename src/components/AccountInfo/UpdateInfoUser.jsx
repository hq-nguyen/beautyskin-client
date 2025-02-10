/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

const UpdateInfoUser = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');

    return (    
        <div className="max-w-3xl w-full mx-auto p-6 bg-white rounded-lg mt-[36px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
            <h2 className="text-2 xl font-bold mb-6 text-gray-800">Thông tin cá nhân</h2>
            <form className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-2">Họ tên</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Số điện thoại</label>
                    <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Giới tính</label>
                    <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                            <input 
                                type="radio" 
                                name="gender" 
                                value="Nam"
                                checked={gender === 'Nam'}
                                onChange={() => setGender('Nam')}
                                className="form-radio text-red-500"
                            />
                            <span className="ml-2">Nam</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input 
                                type="radio" 
                                name="gender" 
                                value="Nữ"
                                checked={gender === 'Nữ'}
                                onChange={() => setGender('Nữ')}
                                className="form-radio text-red-500"
                            />
                            <span className="ml-2">Nữ</span>
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Ngày sinh</label>
                    <div className="flex space-x-2">
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                            <option>Ngày</option>
                            {[...Array(31)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                            <option>Tháng</option>
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                            <option>Năm</option>
                            {[...Array(100)].map((_, i) => (
                                <option key={i + 1924} value={i + 1924}>{i + 1924}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                    Cập nhật
                </button>
            </form>
        </div>
    );
};

export default UpdateInfoUser;