/* eslint-disable no-unused-vars */
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { data, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        terms: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const validateFullName = (name) => {
        return name.trim().length > 0;
    };

    const validateUsername = (username) => {
        return /^[a-zA-Z0-9_]{3,20}$/.test(username);
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const validatePassword = (password) => {
        return (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^A-Za-z0-9]/.test(password)
        );
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    useEffect(() => {
        const strength = calculatePasswordStrength(formData.password);
        setPasswordStrength(strength);
    }, [formData.password]);

    const validateForm = () => {
        const newErrors = {};

        if (!validateFullName(formData.fullName)) {
            newErrors.fullName = "Tên người dùng không được để trống";
        }

        if (!validateUsername(formData.username)) {
            newErrors.username = "Tên người dùng gồm từ 3-20 ký tự và chỉ có thể chứa chữ cái, số và dấu gạch dưới";
        }

        if (!validateEmail(formData.email)) {
            newErrors.email = "Địa chỉ email nhập không hợp lệ";
        }

        if (!validatePassword(formData.password)) {
            newErrors.password =
                "Mật khẩu phải có ít nhất 8 ký tự và chứa chữ hoa, chữ thường, số và ký tự đặc biệt";
        }

        if (!formData.terms) {
            newErrors.terms = "Bạn phải chấp nhận các điều khoản và điều kiện!";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setLoading(true);
            try {
                const response = await api.post('register', formData);
                toast.success("Tạo tài khoản mới thành công!");
                navigate('/login');
            } catch (error) {
                toast.error(error.response.data);
                console.log(error.response.data);
            } finally {
                setLoading(false);
            }
        }
    };

    const navigate = useNavigate();
    const handleLoginGoogle = () => {
        console.log("first");
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                const token = result.user.accessToken;
                const user = result.user;

                console.log(user);
                navigate('/login');
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
            <div className="max-w-xl w-full bg-card rounded-lg shadow-lg p-8">
                <h2 className="text-2xl text-primary font-bold text-foreground text-center mb-4">Tạo tài khoản mới</h2>
                <p className="text-[12px] text-gray-600 text-center font-bold mb-5">Đăng ký để không bỏ lỡ quyền lợi tích luỹ và hoàn tiền cho bất kỳ đơn hàng nào</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-gray-600 text-sm font-medium text-foreground mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded-md border ${errors.email ? "border-destructive" : "border-input"} focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-ring`}
                            placeholder="Nhập địa chỉ email của bạn"
                            aria-invalid={errors.email ? "true" : "false"}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-destructive text-red-600">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-gray-600 text-sm font-medium text-foreground mb-1">
                            Tên đăng nhập
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded-md border ${errors.username ? "border-destructive" : "border-input"} focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-ring`}
                            placeholder="Nhập tên đăng nhập"
                            aria-invalid={errors.username ? "true" : "false"}
                        />
                        {errors.username && (
                            <p className="mt-1 text-sm text-destructive text-red-600">{errors.username}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="fullName" className="block text-gray-600 text-sm font-medium text-foreground mb-1">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded-md border ${errors.fullName ? "border-destructive" : "border-input"} focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-ring`}
                            placeholder="Nhập họ và tên"
                            aria-invalid={errors.fullName ? "true" : "false"}
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-sm text-destructive text-red-600">{errors.fullName}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-600 text-sm font-medium text-foreground mb-1">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-md border ${errors.password ? "border-destructive" : "border-input"} focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-ring pr-10`}
                                placeholder="Tạo mật khẩu"
                                aria-invalid={errors.password ? "true" : "false"}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                                {showPassword ? (
                                    <AiOutlineEyeInvisible className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <AiOutlineEye className="w-5 h-5 text-gray-500" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-destructive text-red-600">{errors.password}</p>
                        )}
                        <div className="mt-2 h-2 bg-gray-200 rounded-full">
                            <div
                                className={`h-full rounded-full transition-all ${passwordStrength === 0 ? "w-0" :
                                    passwordStrength === 1 ? "w-1/5 bg-red-500" :
                                        passwordStrength === 2 ? "w-2/5 bg-orange-500" :
                                            passwordStrength === 3 ? "w-3/5 bg-yellow-500" :
                                                passwordStrength === 4 ? "w-4/5 bg-lime-500" :
                                                    "w-full bg-green-500"}`}
                            />
                        </div>
                    </div>

                    <div className="flex items-start">
                        <input
                            type="checkbox"
                            id="terms"
                            name="terms"
                            checked={formData.terms}
                            onChange={handleChange}
                            className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-ring"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-foreground">
                            Tôi đồng ý với {" "}
                            <a href="#" className="text-primary hover:underline">
                                Điều khoản dịch vụ
                            </a>{" "}
                            và{" "}
                            <a href="#" className="text-primary hover:underline">
                                Chính sách bảo mật
                            </a>
                        </label>
                    </div>
                    {errors.terms && (
                        <p className="mt-1 text-sm text-destructive text-red-600">{errors.terms}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        ) : (
                            "Đăng ký"
                        )}
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-input"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-card text-muted-foreground">Hoặc đăng nhập với</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLoginGoogle}
                        className="w-full bg-white text-foreground py-2 px-4 rounded-md border border-input hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <FcGoogle className="w-5 h-5" />
                        Đăng nhập với Google
                    </button>

                    <p className="text-left text-sm text-muted-foreground">
                        Bạn đã có tài khoản?{" "}
                        <Link to={'/login'} className="text-primary hover:underline">
                            Đăng nhập tại đây
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;