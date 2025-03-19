import { useState, useEffect } from 'react';
import OptionItem from './OptionItem';
import { assets } from '../../assets/frontend_assets/assets';

const Question = ({
  question,
  currentQuestion,
  totalQuestions,
  answers,
  onAnswer,
  onPrevious,
  onStart
}) => {
  const [showIntro, setShowIntro] = useState(true);
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Subtle entrance effect after component mount
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (showIntro) {
    return (
      <div className="text-center py-10 max-w-3xl mx-auto">
        <h1
          className={`
            text-3xl md:text-4xl font-semibold mb-8
            text-gray-800 relative inline-block
            after:content-[''] after:block after:w-0 after:h-0.5 
            after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2
            after:transition-all after:duration-500
            ${loaded ? 'after:w-full' : ''}
          `}
        >
          Xác định loại da của bạn
        </h1>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 mb-8 shadow-md rounded-lg border border-gray-100">
            <div className="flex justify-center mb-8">
              <img
                src={assets.skin_test}
                alt="Skin Analysis"
                className="w-full max-w-md h-64 object-cover rounded-lg shadow-sm"
              />
            </div>
            <p className="text-gray-700 mb-8 leading-relaxed content-around"> 
              Chào mừng bạn đến với bộ công cụ phân tích da chuyên nghiệp của chúng tôi. Thông qua {totalQuestions} câu hỏi 
              được thiết kế bởi các chuyên gia da liễu, chúng tôi sẽ xác định chính xác loại da của bạn và 
              đưa ra phương pháp chăm sóc phù hợp nhất.
            </p>
            <div className="space-y-5 text-left mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4 shadow-sm">1</div>
                <p className="text-gray-800">Trả lời các câu hỏi về đặc điểm và tình trạng da của bạn</p>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4 shadow-sm">2</div>
                <p className="text-gray-800">Nhận báo cáo phân tích da chi tiết từ hệ thống chuyên gia</p>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4 shadow-sm">3</div>
                <p className="text-gray-800">Khám phá các sản phẩm được đề xuất phù hợp với loại da của bạn</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowIntro(false);
                if (onStart) onStart();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-md shadow-sm transition-all duration-300 hover:shadow"
            >
              Bắt đầu ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-10">
        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {question.text || `Câu hỏi ${currentQuestion + 1}`}
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">{question.description || ''}</p>
      </div>

      <div className="space-y-4">
        {question.options && question.options.length > 0 ? (
          question.options.map((option) => {
            // Check if this option was previously selected
            const isSelected = answers.some(
              a => a.questionId === question.id && a.optionId === option.id
            );

            return (
              <OptionItem
                key={option.id}
                option={option}
                isSelected={isSelected}
                onClick={() => onAnswer(question.id, option.id, option.point)}
              />
            );
          })
        ) : (
          <p className="text-center text-gray-500 py-4">Không có lựa chọn cho câu hỏi này</p>
        )}
      </div>

      <div className="mt-10 flex justify-between items-center">
        <button
          onClick={onPrevious}
          disabled={currentQuestion === 0}
          className={`px-6 py-2.5 rounded-md transition duration-200 ${
            currentQuestion === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </span>
        </button>

        <div className="text-center text-sm font-medium text-gray-600">
          Câu hỏi {currentQuestion + 1} / {totalQuestions}
        </div>
      </div>
    </div>
  );
};

export default Question;