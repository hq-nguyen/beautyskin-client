import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const Unauthorized = () => {
    return (
        <>
        <Navbar />
            <div className="flex flex-col items-center justify-center h-96 bg-gray-100">
                <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Không có quyền truy cập</h1>
                    <p className="text-gray-700 mb-6">
                    Bạn không có quyền truy cập trang này. Vui lòng liên hệ với quản trị viên nếu bạn cho rằng đây là lỗi.
                    </p>
                    <div className="flex justify-center">
                        <Link
                            to="/"
                            className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors"
                        >
                            Trở về Trang chủ
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Unauthorized;