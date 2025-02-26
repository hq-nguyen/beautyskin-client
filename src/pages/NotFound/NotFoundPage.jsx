// NotFoundPage.js
import { Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Result
        status="404"
        title="Chúng ta gặp chút sự cố!"
        subTitle="Rất tiếc trang của bạn đang tìm hiện tại đang không tồn tại."
        extra={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button className='bg-primary px-3 py-2 rounded-md text-white hover:opacity-90' onClick={() => navigate('/shop')}>
              Mua sắm ngay
            </button>
            <button className='bg-primary px-3 py-2 rounded-md text-white hover:opacity-90' onClick={() => navigate('/')}>
              Trở về trang chủ
            </button>
          </div>
        }
      />
    </div>
  );
};

export default NotFoundPage;
