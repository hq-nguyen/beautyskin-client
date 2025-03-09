import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuizzes } from '../../apis/quiz';
import QuizHeader from '../../components/Quiz/QuizHeader';
import Loading from '../../components/Quiz/Loading';
import Error from '../../components/Quiz/Error';
import EmptyQuestions from '../../components/Quiz/EmptyQuestion';
import Question from '../../components/Quiz/Question';
import Result from '../../components/Quiz/Result';

const SkinTypeQuiz = () => {
  const navigate = useNavigate();
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
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const data = await fetchQuizzes();
        
        const validatedData = data.map(question => {
          return {
            id: question.id,
            text: question.question,
            description: question.description,
            options: question.answers.map(option => ({
              id: option.id,
              text: option.answer,
              point: option.points
            }))
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

    loadQuestions();
  }, []);

  const handleAnswer = (questionId, optionId, point) => {
    const newAnswer = { questionId, optionId, point };
    
    // If we're updating an existing answer (going back and changing)
    const answerIndex = answers.findIndex(a => a.questionId === questionId);
    let newAnswers;
    
    if (answerIndex !== -1) {
      // Replace the existing answer
      newAnswers = [...answers];
      newAnswers[answerIndex] = newAnswer;
    } else {
      // Add new answer
      newAnswers = [...answers, newAnswer];
    }
    
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const sum = newAnswers.reduce((acc, curr) => acc + curr.point, 0);
      setTotalPoints(sum);
      
      const skinTypeResult = determineSkinType(sum);
      setSkinType(skinTypeResult.type);
      setRecommendations(skinTypeResult.recommendations);
      setShowResult(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const determineSkinType = (points) => {
    if (points <= 11) {
      return {
        type: 'Da dầu',
        recommendations: 'Nên sử dụng sữa rửa mặt nhẹ nhàng, không chứa dầu và tránh các sản phẩm dưỡng quá đậm đặc. Sử dụng toner cân bằng độ pH và kem dưỡng ẩm không dầu. Nên tẩy da chết 1-2 lần/tuần.',
        route: '/test-skin/oily'
      };
    } else if (points <= 20) {
      return {
        type: 'Da hỗn hợp / tổng hợp',
        recommendations: 'Nên sử dụng sản phẩm phù hợp cho từng vùng da trên mặt, cân bằng độ ẩm và dầu. Vùng T-zone có thể cần sản phẩm kiểm soát dầu, trong khi các vùng khác cần dưỡng ẩm nhiều hơn.',
        route: '/test-skin/combination'
      };
    } else if (points <= 26) {
      return {
        type: 'Da thường',
        recommendations: 'Da của bạn khá cân bằng. Hãy duy trì chế độ chăm sóc da hiện tại và tập trung vào việc bảo vệ da khỏi tác động môi trường. Nên sử dụng kem chống nắng hàng ngày và dưỡng ẩm đều đặn.',
        route: '/test-skin/normal'
      };
    } else if (points <= 35) {
      return {
        type: 'Da nhạy cảm',
        recommendations: 'Nên sử dụng các sản phẩm dịu nhẹ, không chứa hương liệu và cồn. Tránh các sản phẩm tẩy tế bào chết mạnh và luôn thử nghiệm sản phẩm mới trên một vùng da nhỏ trước khi sử dụng.',
        route: '/test-skin/sensitive'
      };
    } else {
      return {
        type: 'Da khô',
        recommendations: 'Nên sử dụng các sản phẩm dưỡng ẩm đậm đặc, tránh rửa mặt quá nhiều lần trong ngày. Sử dụng sữa rửa mặt dạng kem và tránh nước quá nóng. Nên bổ sung thêm serum cấp ẩm và dầu dưỡng vào quy trình chăm sóc da.',
        route: '/test-skin/dry'
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

  const navigateToSkinTypePage = (route) => {
    // Save results to localStorage for potential use on landing page
    localStorage.setItem('skinTestResults', JSON.stringify({
      skinType,
      totalPoints,
      recommendations,
      date: new Date().toISOString()
    }));
    
    // Navigate to the corresponding skin type page
    navigate(route);
  };

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (questions.length === 0) return <EmptyQuestions />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <QuizHeader questionsCount={questions.length} />

        <div className="bg-white rounded-lg shadow-md p-6">
          {!showResult ? (
            <Question 
              question={questions[currentQuestion]}
              currentQuestion={currentQuestion}
              totalQuestions={questions.length}
              answers={answers}
              onAnswer={handleAnswer}
              onPrevious={handlePreviousQuestion}
            />
          ) : (
            <Result 
              skinType={skinType}
              totalPoints={totalPoints}
              recommendations={recommendations}
              onReset={resetQuiz}
              onNavigate={() => navigateToSkinTypePage(determineSkinType(totalPoints).route)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SkinTypeQuiz;