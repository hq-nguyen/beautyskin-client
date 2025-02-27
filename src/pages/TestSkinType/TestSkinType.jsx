/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SkinTypeQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [skinType, setSkinType] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('id');
    if (userIdFromStorage) {
      setId(userIdFromStorage);
    }
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://67b8aa17699a8a7baef4dc18.mockapi.io/SkinQuestion');
        
        const validatedData = response.data.map(question => {
          if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {
            console.warn(`Question ${question.id} has invalid options:`, question.options);
            return {
              ...question,
              options: [
                { id: 1, text: "Option 1", point: 1 },
                { id: 2, text: "Option 2", point: 2 },
                { id: 3, text: "Option 3", point: 3 },
                { id: 4, text: "Option 3", point: 4 },
                { id: 5, text: "Option 3", point: 5 }
              ]
            };
          }
          let tempP = 0;
          const validOptions = question.options.map(option => {
            tempP += 1
            if (typeof option !== 'object') {
              return { id: option, text: `Option ${option}`, point: 3 };
            } 
            
            return {
              id: option.id,
              text: option.text || `Option ${option.id}`,
              point: option.point || tempP 
            };
          });
          
          return {
            ...question,
            options: validOptions
          };
        });
        
        console.log('Validated questions:', validatedData);
        setQuestions(validatedData);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải câu hỏi. Vui lòng thử lại sau.');
        setLoading(false);
        console.error('Error fetching questions:', err);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = async (questionId, optionId, point) => {
    const newAnswer = { questionId, optionId, point };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    
    try {
      await axios.post('https://67b8aa17699a8a7baef4dc18.mockapi.io/SkinAnswer', {
        id,
        questionId,
        optionId,
        point
      });
    } catch (err) {
      console.error('Error saving answer:', err);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const sum = newAnswers.reduce((acc, curr) => acc + curr.point, 0);
      setTotalPoints(sum);
      
      try {
        const result = await axios.post('https://67b8aa17699a8a7baef4dc18.mockapi.io/SkinAnswer', {
          id,
          totalPoints: sum,
          answers: newAnswers
        });
        
        setSkinType(result.data.skinType);
        setRecommendations(result.data.recommendations);
      } catch (err) {
        console.error('Error getting results:', err);
        const fallbackSkinType = determineSkinType(sum);
        setSkinType(fallbackSkinType.type);
        setRecommendations(fallbackSkinType.recommendations);
      } finally {
        setShowResult(true);
      }
    }
  };

  const determineSkinType = (points) => {
    if (points < 10) {
      return {
        type: 'Da khô',
        recommendations: 'Nên sử dụng các sản phẩm dưỡng ẩm đậm đặc, tránh rửa mặt quá nhiều lần trong ngày.'
      };
    } else if (points < 20) {
      return {
        type: 'Da thường',
        recommendations: 'Da của bạn khá cân bằng. Hãy duy trì chế độ chăm sóc da hiện tại và tập trung vào việc bảo vệ da khỏi tác động môi trường.'
      };
    } else if (points < 30) {
      return {
        type: 'Da hỗn hợp',
        recommendations: 'Nên sử dụng sản phẩm phù hợp cho từng vùng da trên mặt, cân bằng độ ẩm và dầu.'
      };
    } else {
      return {
        type: 'Da dầu',
        recommendations: 'Nên sử dụng sữa rửa mặt nhẹ nhàng, không chứa dầu và tránh các sản phẩm dưỡng quá đậm đặc.'
      };
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setTotalPoints(0);
    setSkinType('');
    setRecommendations('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Đã xảy ra lỗi</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Check if questions array is empty
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Không có câu hỏi</h2>
          <p className="text-gray-600 mb-4">Không tìm thấy câu hỏi nào trong hệ thống.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-800 mb-4">BÀI KIỂM TRA LOẠI DA & CÁCH CHĂM SÓC</h1>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-md mb-6">
            <img 
              src="src/assets/frontend_assets/SkinType.jpg" 
              alt="Chuyên gia da liễu tư vấn" 
              className="w-full h-auto"
            />
            <div className="p-6 text-center">
              <div className="inline-block px-6 py-3 bg-teal-100 text-teal-700 rounded-md mb-3">
                <h2 className="text-xl font-medium mb-1">CHUYÊN GIA DA LIỄU</h2>
                <p className="text-sm">CHÚNG TÔI CHIA SẺ NHỮNG KIẾN THỨC VỀ LÀN DA</p>
              </div>
              
              <p className="text-gray-700 mb-4">
                Mỗi người chúng ta đều có một cơ địa và làn da khác nhau. Để có cách chăm sóc da đúng đắn, điều quan trọng là bạn 
                cần phải hiểu làn da. Grace Skincare Clinic hân hạnh mang đến bài trắc nghiệm nhỏ để bạn có thể tự kiểm tra loại 
                da và tình trạng da của mình.
              </p>
              
              <p className="text-gray-700">
                Hãy trả lời 9 câu hỏi trong bài trắc nghiệm dưới đây để hiểu hơn về làn da của mình, từ đó biết được cách thức chăm da 
                nào sẽ phù hợp với bạn.
              </p>
              
              <p className="text-right text-gray-500 text-sm mt-2">
                Tác giả: <span className="text-blue-500">Bác sĩ Da liễu Huỳnh Kim Thảo</span>
              </p>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6">
          {!showResult ? (
            <div>
              {questions.length > 0 && currentQuestion < questions.length && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      Q{currentQuestion + 1}: {questions[currentQuestion].text || `Câu hỏi ${currentQuestion + 1}`}
                    </h2>
                    <p className="text-gray-600 mb-4">{questions[currentQuestion].description || ''}</p>
                  </div>

                  <div className="space-y-3">
                    {questions[currentQuestion].options && questions[currentQuestion].options.length > 0 ? (
                      questions[currentQuestion].options.map((option) => (
                        <div 
                          key={option.id} 
                          className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleAnswer(questions[currentQuestion].id, option.id, option.point)}
                        >
                          <span className="text-gray-700">{option.text}</span>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {option.point} điểm
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">Không có lựa chọn cho câu hỏi này</p>
                    )}
                  </div>
                  
                  <div className="mt-6 text-center text-sm text-gray-500">
                    Câu hỏi {currentQuestion + 1} / {questions.length}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Kết quả của bạn</h2>
                <p className="text-gray-600">Tổng điểm: {totalPoints}</p>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  Loại da của bạn: {skinType}
                </h3>
                <p className="text-gray-700">{recommendations}</p>
              </div>
              
              <button 
                onClick={resetQuiz}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Làm lại bài kiểm tra
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkinTypeQuiz;