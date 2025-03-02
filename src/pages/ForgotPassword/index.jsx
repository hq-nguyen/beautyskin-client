import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import api from '../../config/axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Vui lòng nhập địa chỉ email hợp lệ");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('user/forgetPassword', { email });
      console.log(response);
      toast.success("Mã OTP đã được gửi đến email của bạn");
      setOtpSent(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau.";
      toast.error(errorMessage);
      if (error.response?.status === 404) {
        setError("Email không tồn tại trong hệ thống");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length < 4) {
      setError("Vui lòng nhập mã OTP hợp lệ");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Xác nhận mật khẩu không khớp");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('forgot-password/reset', { 
        email, 
        otp, 
        newPassword 
      });
      toast.success("Mật khẩu đã được đặt lại thành công");
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau.";
      toast.error(errorMessage);
      if (error.response?.status === 400) {
        setError("Mã OTP không hợp lệ hoặc đã hết hạn");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-xl w-full bg-card rounded-lg shadow-lg p-8">
        <h2 className="text-2xl text-primary font-bold text-foreground text-center mb-4">Quên mật khẩu</h2>
        
        {!otpSent ? (
          <>
            <p className="text-sm text-gray-600 text-center mb-5">
              Vui lòng nhập email để nhận mã OTP đặt lại mật khẩu
            </p>

            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-gray-600 text-sm font-medium text-foreground mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 rounded-md border ${error ? "border-destructive" : "border-input"} focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-ring`}
                  placeholder="Nhập địa chỉ email"
                  aria-invalid={error ? "true" : "false"}
                />
                {error && (
                  <p className="mt-1 text-sm text-destructive">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                  "Gửi mã OTP"
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 text-center mb-5">
              Mã OTP đã được gửi đến {email}. Vui lòng kiểm tra hộp thư của bạn.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-gray-600 text-sm font-medium text-foreground mb-1">
                  Mã OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-ring"
                  placeholder="Nhập mã OTP"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-gray-600 text-sm font-medium text-foreground mb-1">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-ring"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-gray-600 text-sm font-medium text-foreground mb-1">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-ring"
                  placeholder="Xác nhận mật khẩu mới"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                    "Đặt lại mật khẩu"
                  )}
                </button>
              </div>
            </form>
          </>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          Quay lại trang{" "}
          <Link to="/login" className="text-primary hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;