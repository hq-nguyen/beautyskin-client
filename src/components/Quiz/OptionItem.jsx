const OptionItem = ({ option, isSelected, onClick }) => (
    <div 
      className={`flex justify-between items-center p-4 border ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      } rounded-lg hover:bg-gray-50 cursor-pointer`}
      onClick={onClick}
    >
      <span className="text-gray-700 w-[60%] md:w-[70%] ">{option.text}</span>
      <span className="bg-blue-100 text-blue-800 px-3 py-1 sm:px-4 rounded-full text-sm">
        {option.point} điểm
      </span>
    </div>
  );
  
  export default OptionItem;