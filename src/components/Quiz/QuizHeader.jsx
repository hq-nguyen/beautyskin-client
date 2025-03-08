import { assets } from "../../assets/frontend_assets/assets";

const QuizHeader = ({ questionsCount }) => (
    <header className="text-center mb-8">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">BÀI KIỂM TRA LOẠI DA & CÁCH CHĂM SÓC</h1>
      
      <div className="bg-white rounded-lg overflow-hidden shadow-md mb-6">
        <img 
          src={assets.skintest_banner} 
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
            Hãy trả lời {questionsCount} câu hỏi trong bài trắc nghiệm dưới đây để hiểu hơn về làn da của mình, từ đó biết được cách thức chăm da 
            nào sẽ phù hợp với bạn.
          </p>
          
          <p className="text-right text-gray-500 text-sm mt-2">
            Tác giả: <span className="text-blue-500">Bác sĩ Da liễu Huỳnh Kim Thảo</span>
          </p>
        </div>
      </div>
    </header>
  );
  
  export default QuizHeader;