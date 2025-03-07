import OptionItem from './OptionItem';

const Question = ({ 
  question, 
  currentQuestion, 
  totalQuestions, 
  answers,
  onAnswer,
  onPrevious
}) => {
  if (!question) return null;
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {question.text || `Câu hỏi ${currentQuestion + 1}`}
        </h2>
        <p className="text-gray-600 mb-4">{question.description || ''}</p>
      </div>

      <div className="space-y-3">
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
      
      <div className="mt-6 flex justify-between items-center">
        <button 
          onClick={onPrevious}
          disabled={currentQuestion === 0}
          className={`px-4 py-2 rounded-lg ${
            currentQuestion === 0 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          Quay lại
        </button>
        
        <div className="text-center text-sm text-gray-500">
          Câu hỏi {currentQuestion + 1} / {totalQuestions}
        </div>
        
        {/* Spacer to keep the navigation balanced */}
        <div className="w-20"></div>
      </div>
    </div>
  );
};

export default Question;