const Result = ({ 
  skinType, 
  totalPoints, 
  recommendations,
  onReset,
  onNavigate
}) => (
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
    
    <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
      <button 
        onClick={onReset}
        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
      >
        Làm lại bài kiểm tra
      </button>
      
      <button 
        onClick={onNavigate}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Xem phương pháp chăm sóc cho da {skinType}
      </button>
    </div>
  </div>
);

export default Result;