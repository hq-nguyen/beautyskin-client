import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import api from '../../config/axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !validateEmail(email)) {
      setError("Vui lòng nhập email hợp lệ");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`user/forgot-password?email=${encodeURIComponent(email)}`);
      setEmailSent(true);
      toast.success("Link đặt lại mật khẩu đã được gửi đến email của bạn");
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu đặt lại mật khẩu:", error);
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally { 
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    await handleSendResetLink();
  };

  const handleTryAnotherMethod = () => {
    setEmailSent(false);
    setEmail("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-xl w-full bg-card rounded-lg shadow-lg p-8">
        <h2 className="text-2xl text-primary font-bold text-foreground text-center mb-4">Quên mật khẩu</h2>
        
        {!emailSent ? (
          <>
            <p className="text-sm text-gray-600 text-center mb-5">
              Vui lòng nhập email để nhận link đặt lại mật khẩu
            </p>

            <form onSubmit={handleSendResetLink} className="space-y-6">
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
                  "Gửi link đặt lại mật khẩu"
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 text-center mb-5">
              Link đặt lại mật khẩu đã được gửi đến {email}. Vui lòng kiểm tra hộp thư của bạn (bao gồm cả thư mục spam).
            </p>
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleResendEmail}
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
                  "Gửi lại email"
                )}
              </button>
              <button
                type="button"
                onClick={handleTryAnotherMethod}
                className="w-full border border-gray-300 bg-gray-100 text-gray-800 py-2 px-4 rounded-md transition-colors hover:bg-gray-200"
              >
                Thử cách khác
              </button>
            </div>
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