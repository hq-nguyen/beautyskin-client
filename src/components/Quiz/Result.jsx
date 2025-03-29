const Result = ({ 
  skinType, 
  totalPoints, 
  recommendations, 
  onReset, 
  onNavigate, 
  profileSaved, 
  profileSaveError,
  savingProfile,
  isLoggedIn 
}) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-[#EE1F5B] mb-2">Kết quả kiểm tra da</h2>
      
      <div className="py-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-[#EE1F5B]">Loại da của bạn: {skinType}</h3>
          <p className="text-gray-600 mt-2">Tổng điểm: {totalPoints}</p>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium text-gray-800 mb-2">Đề xuất chăm sóc da:</h4>
          <p className="text-gray-700 text-left">{recommendations}</p>
        </div>
      </div>

      {isLoggedIn && (
        <div className="mt-4">
          {profileSaved ? (
            <div className="p-3 bg-green-100 text-green-700 rounded-md">
              Thông tin loại da của bạn đã được lưu vào hồ sơ thành công!
            </div>
          ) : profileSaveError ? (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {profileSaveError}
            </div>
          ) : savingProfile ? (
            <div className="p-3 bg-blue-100 text-blue-700 rounded-md flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang lưu thông tin loại da vào hồ sơ...
            </div>
          ) : (
            <div className="p-3 bg-blue-50 text-blue-700 rounded-md">
              Hệ thống sẽ tự động lưu kết quả vào hồ sơ của bạn...
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition"
        >
          Làm lại bài kiểm tra
        </button>
        <button
          onClick={onNavigate}
          className="px-4 py-2 bg-[#EE1F5B] text-white rounded-md transition"
        >
          Xem chi tiết về loại da
        </button>
      </div>
    </div>
  );
};

export default Result;