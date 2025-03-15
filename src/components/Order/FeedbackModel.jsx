import { useState } from 'react';
import { Modal, Rate, Input, Button, message, Card } from 'antd';
import { createFeedback } from '../../apis/feedback';

const { TextArea } = Input;

// This component can be added to the same file as OrderHistory or in a separate file
const FeedbackModal = ({ isVisible, onClose, orderId, product }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating) {
      message.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    try {
      setSubmitting(true);
      
      const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      const feedbackData = {
        rating: rating,
        comment: comment,
        feedBackDate: currentDate
      };
      
      await createFeedback(product.id, feedbackData);
      
      message.success('Cảm ơn đánh giá của bạn!');
      onClose(true); // Pass true to indicate successful submission
    } catch (error) {
      message.error('Không thể gửi đánh giá. Vui lòng thử lại!');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Đánh giá sản phẩm"
      open={isVisible}
      onCancel={() => onClose(false)}
      footer={null}
      centered
      width={500}
    >
      <Card className="border border-gray-200 rounded-lg mt-4">
        <div className="flex items-start gap-4">
          <img
            src={product?.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770"}
            alt={product?.name}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150";
            }}
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{product?.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{product?.category}</p>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Đánh giá của bạn</p>
              <Rate 
                allowHalf 
                defaultValue={5} 
                value={rating}
                onChange={setRating} 
              />
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Nhận xét (tùy chọn)</p>
              <TextArea 
                rows={3} 
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button onClick={() => onClose(false)}>
                Hủy
              </Button>
              <Button
                type="primary"
                className="bg-rose-600 hover:bg-rose-700 border-rose-600"
                onClick={handleSubmit}
                loading={submitting}
              >
                Gửi đánh giá
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Modal>
  );
};

export default FeedbackModal;