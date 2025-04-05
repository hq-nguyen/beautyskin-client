/* eslint-disable no-unused-vars */
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import api from '../../config/axios';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/features/useSlice';
import { message } from 'antd';


const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = "Vui lòng nhập tên đăng nhập hoặc email";
    } else if (formData.emailOrUsername.trim().length < 3) {
      newErrors.emailOrUsername = "Username must be at least 3 characters";
    } else if (formData.emailOrUsername.trim().length > 50) {
      newErrors.emailOrUsername = "Username must not exceed 50 characters";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu có ít nhất 8 kí tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
    }

    const newFormData = {
      username: formData.emailOrUsername,
      password: formData.password
    }

    try {
      const response = await api.post('login', newFormData);
      const { token, roleEnum, id } = response.data;
      // console.log(response.data);
      localStorage.setItem('token', token);
      localStorage.setItem('id', id);
      // message.success("Đăng nhập thành công")
      dispatch(login(response.data))

      console.log(roleEnum);

      if (roleEnum === 'MANAGER') {
        navigate('/admin')
      } else if (roleEnum === 'STAFF') {
        navigate('/staff/orders')
      } else if (roleEnum === 'USER') {
        navigate('/')
      } 

    } catch (error) {
      message.error(error?.response.data);
    } finally {
      setIsLoading(false)
    }

  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLoginGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setIsLoading(true);
  
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const idToken = await result.user.getIdToken();

      if (!idToken) {
        throw new Error("Không nhận được token từ Google Authentication");
      }
  
      console.log("Firebase ID Token:", idToken);
  
      const response = await api.post('login-google', { 
        token: idToken 
      });
  
      console.log("Backend Response:", response.data); 
  
      if (response?.data) {
        const { token, roleEnum, id } = response.data;
  
        if (!token || !id) {
          console.error("Missing token or id in response:", response.data);
          throw new Error("Phản hồi từ server không chứa token hoặc id");
        }
  
        localStorage.setItem('token', token);
        localStorage.setItem('id', id);
  
        dispatch(login(response.data));
  
        if (roleEnum === 'MANAGER') {
          navigate('/admin')
        } else if (roleEnum === 'STAFF') {
          navigate('/staff/orders')
        } else if (roleEnum === 'USER') {
          navigate('/')
        } 
      } else {
        throw new Error("Không nhận được dữ liệu từ server");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      message.error(error.message || "Đăng nhập Google thất bại");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-xl w-full bg-card rounded-lg shadow-lg p-8">
        <h2 className="text-2xl text-primary font-bold text-foreground text-center mb-4">Đăng nhập</h2>
        <p className="text-[12px] text-gray-600 text-center font-bold mb-5">Đăng ký để không bỏ lỡ quyền lợi tích luỹ và hoàn tiền cho bất kỳ đơn hàng nào</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="emailOrUsername" className="block text-gray-600 text-sm font-medium text-foreground mb-1">
              Email hoặc tên đăng nhập
            </label>
            <input
              type="text"
              id="emailOrUsername"
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border ${errors.emailOrUsername ? "border-destructive" : "border-input"} focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-ring`}
              placeholder="Nhập email hoặc tên đăng nhập của bạn"
              aria-invalid={errors.emailOrUsername ? "true" : "false"}
            />
            {errors.emailOrUsername && (
              <p className="mt-1 text-sm text-destructive text-red-600">{errors.emailOrUsername}</p>
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
                className={`w-full px-4 py-2 rounded-md border ${errors.password ? "border-destructive" : "border-input"}  focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-ring pr-10`}
                placeholder="Nhập mật khẩu"
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
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-foreground">
                Nhớ mật khẩu
              </label>
            </div>

            <Link to={'/forgot-password'} className="hover:text-pink-500 text-sm">
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
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
              "Đăng nhập"
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
            Bạn chưa có tài khoản?{" "}
            <Link to={'/register'} className="text-primary hover:underline">
              Đăng ký tại đây
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;