import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { assets } from "../../assets/frontend_assets/assets";

const FAQSection = () => {
    const [activeIndexes, setActiveIndexes] = useState([]);

    const faqData = [
        {
            question: "Bao lâu thì tôi có thể thấy hiệu quả của sản phẩm?",
            answer:
                "Hiệu quả của sản phẩm có thể khác nhau tùy thuộc vào loại da và tần suất sử dụng. Tuy nhiên, bạn sẽ thường thấy sự cải thiện rõ rệt sau khoảng 2-4 tuần sử dụng liên tục. Hãy kiên nhẫn và nhớ sử dụng đúng cách để đạt hiệu quả tốt nhất."
        },
        {
            question: "Có cần tẩy tế bào chết hằng ngày không?",
            answer:
                "Không cần tẩy tế bào chết hằng ngày, vì việc tẩy tế bào chết quá thường xuyên có thể gây kích ứng cho da. Nên thực hiện tẩy tế bào chết từ 1-2 lần mỗi tuần để da luôn mịn màng và tươi sáng."
        },
        {
            question: "Có cần dùng kem dưỡng ẩm khi da dầu không?",
            answer:
                "Có, dù da bạn có dầu, việc dưỡng ẩm là rất quan trọng. Lựa chọn kem dưỡng ẩm dạng gel hoặc không chứa dầu sẽ giúp cân bằng độ ẩm mà không làm tắc nghẽn lỗ chân lông."
        },
        {
            question: "Làm thế nào để kiểm tra sản phẩm có phù hợp với da của mình?",
            answer:
                "Trước khi sử dụng sản phẩm mới, bạn nên thử một lượng nhỏ lên vùng da dưới cằm hoặc cổ tay để kiểm tra phản ứng của da. Nếu không có hiện tượng kích ứng trong 24 giờ, bạn có thể yên tâm sử dụng sản phẩm."
        },
        {
            question: "Làm thế nào để theo dõi đơn hàng của tôi?",
            answer:
                "Sau khi đặt hàng, bạn sẽ nhận được mã số theo dõi qua email. Bạn có thể sử dụng mã này để theo dõi quá trình giao hàng trên website của chúng tôi hoặc trên trang của dịch vụ vận chuyển."
        },
        {
            question: "Làm thế nào để nhận được giảm giá hay khuyến mãi?",
            answer:
                "Đăng ký nhận bản tin từ chúng tôi để không bỏ lỡ các chương trình khuyến mãi và mã giảm giá đặc biệt. Ngoài ra, bạn có thể theo dõi các sự kiện khuyến mãi trên trang web hoặc trên các mạng xã hội của chúng tôi."
        },
        {
            question: "Sử dụng mặt nạ dưỡng da bao nhiêu lần một tuần là tốt nhất?",
            answer:
                "Tùy thuộc vào loại da và mặt nạ bạn sử dụng, thông thường, bạn nên sử dụng mặt nạ dưỡng da từ 1-3 lần mỗi tuần. Đối với da khô, bạn có thể sử dụng thường xuyên hơn, còn da nhờn hoặc dễ bị mụn thì chỉ nên dùng 1-2 lần mỗi tuần."
        },
        {
            question: "Làm sao để liên hệ hỗ trợ nếu tôi cần tư vấn thêm?",
            answer:
                "Bạn có thể liên hệ với chúng tôi qua email, số điện thoại hỗ trợ khách hàng, hoặc trò chuyện trực tiếp trên website. Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7."
        }
    ];


    const toggleQuestion = (index) => {
        setActiveIndexes((prevIndexes) => {
            if (prevIndexes.includes(index)) {
                return prevIndexes.filter((i) => i !== index);
            } else {
                return [...prevIndexes, index];
            }
        });
    };

    return (
        <div className="container mx-auto mt-24 px-8 py-12 bg-gray-100 rounded-lg shadow-lg">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                    <div className="relative w-full overflow-hidden rounded-lg">
                        <img
                            src={assets.brand}
                            alt="FAQ Support"
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3";
                            }}
                        />
                    </div>
                </div>
                <div className="lg:w-2/3">
                    <h2 className="text-3xl font-bold mb-8">
                        Câu hỏi <span className="text-primary">Thường gặp</span>
                    </h2>
                    <div className="space-y-4">
                        {faqData.map((faq, index) => (
                            <div
                                key={index}
                                className="border-b border-gray-200 overflow-hidden"
                            >
                                <button
                                    className={`w-full text-left p-2 flex justify-between items-center transition-all duration-200 border-b-2 ${activeIndexes.includes(index) ? "border-pink-500" : "border-transparent"
                                        }`}
                                    onClick={() => toggleQuestion(index)}
                                    aria-expanded={activeIndexes.includes(index)}
                                    aria-controls={`faq-answer-${index}`}
                                >
                                    <span
                                        className={`font-medium text-foreground ${activeIndexes.includes(index) ? "text-primary" : ""
                                            }`}
                                    >
                                        {faq.question}
                                    </span>
                                    <FiChevronRight
                                        className={`transform transition-transform duration-200 text-primary ${activeIndexes.includes(index) ? "rotate-90" : ""
                                            }`}
                                        size={20}
                                    />
                                </button>
                                <div
                                    id={`faq-answer-${index}`}
                                    className={`overflow-hidden transition-all duration-200 ${activeIndexes.includes(index) ? "max-h-48" : "max-h-0"
                                        }`}
                                >
                                    <p className="p-4 bg-secondary/20 text-foreground/80">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQSection;
