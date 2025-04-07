import { useState, useEffect } from 'react';
import StarRating from '../utils/StarRating';
import { assets } from '../../assets/frontend_assets/assets';
import { useSelector } from 'react-redux';

const ProductTabs = ({ product, feedbackData }) => {
    const [selectedTab, setSelectedTab] = useState('description');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState('date'); // Default sort by date
    const feedbacksPerPage = 5;
    
    // Get current user from Redux store
    const currentUser = useSelector(state => state.user);

    const skinTypes = product.skinTypes?.map(type => type.name).join(', ') || '';
    const skinConcerns = product.skinConcerns?.map(concern => concern.name).join(', ') || '';
    const tags = product.tags?.map(tag => tag.name).join(', ') || '';

    // Calculate average rating
    const averageRating = feedbackData && feedbackData.length > 0
        ? (feedbackData.reduce((sum, item) => sum + item.rating, 0) / feedbackData.length)
        : 0;

    // Calculate rating distribution
    const ratingCounts = [0, 0, 0, 0, 0]; // For 1 to 5 stars
    if (feedbackData && feedbackData.length > 0) {
        feedbackData.forEach(feedback => {
            if (feedback.rating >= 1 && feedback.rating <= 5) {
                ratingCounts[feedback.rating - 1]++;
            }
        });
    }

    // Calculate rating percentages
    const totalFeedbacks = feedbackData?.length || 0;
    const ratingPercentages = ratingCounts.map(count =>
        totalFeedbacks > 0 ? Math.round((count / totalFeedbacks) * 100) : 0
    );

    // Sort and prepare feedbacks for display
    const getSortedFeedbacks = () => {
        if (!feedbackData || feedbackData.length === 0) return [];
        
        // Create a copy of the data for sorting
        let sortedData = [...feedbackData];
        
        // Find current user's feedback if user is logged in
        let userFeedback = null;
        if (currentUser) {
            const userFeedbacks = sortedData.filter(
                feedback => feedback.user?.id === currentUser.id
            );
            
            if (userFeedbacks.length > 0) {
                // Get the latest user feedback
                userFeedback = userFeedbacks.sort((a, b) => 
                    new Date(b.feedBackDate) - new Date(a.feedBackDate)
                )[0];
                
                // Remove user feedback from the main list to avoid duplication
                sortedData = sortedData.filter(
                    feedback => !(feedback.user?.id === currentUser.id && 
                                feedback.id === userFeedback.id)
                );
            }
        }
        
        // Sort the remaining feedbacks
        switch (sortOption) {
            case 'date':
                sortedData.sort((a, b) => new Date(b.feedBackDate) - new Date(a.feedBackDate));
                break;
            case 'highest':
                sortedData.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                sortedData.sort((a, b) => a.rating - b.rating);
                break;
            default:
                sortedData.sort((a, b) => new Date(b.feedBackDate) - new Date(a.feedBackDate));
        }
        
        // If user feedback exists, prepend it to the sorted list
        return userFeedback ? [userFeedback, ...sortedData] : sortedData;
    };

    const sortedFeedbacks = getSortedFeedbacks();
    
    // Pagination logic
    const indexOfLastFeedback = currentPage * feedbacksPerPage;
    const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
    const currentFeedbacks = sortedFeedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);
    const totalPages = Math.ceil(sortedFeedbacks.length / feedbacksPerPage);

    // Reset to first page when sort option changes
    useEffect(() => {
        setCurrentPage(1);
    }, [sortOption]);

    // Format date to Vietnamese format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(date);
    };

    // Generate pagination items
    const generatePaginationItems = () => {
        const items = [];
        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === i
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    {i}
                </button>
            );
        }
        return items;
    };

    // Check if a feedback is from the current user
    const isCurrentUserFeedback = (feedback) => {
        return currentUser && feedback.user?.id === currentUser.id;
    };

    return (
        <div className="mt-12 border-t pt-8">
            <div className="flex space-x-8 border-b">
                {["description", "ingredients", "how to use", "feedback"].map(
                    (tab) => (
                        <button
                            key={tab}
                            onClick={() => setSelectedTab(tab)}
                            className={`pb-4 px-2 ${selectedTab === tab
                                ? "border-b-2 border-primary text-primary font-medium"
                                : "text-gray-500"
                                }`}
                        >
                            {tab === "description" ? "Mô tả" :
                                tab === "ingredients" ? "Thành phần" :
                                    tab === "how to use" ? "Hướng dẫn sử dụng" :
                                        "Đánh giá"}
                        </button>
                    )
                )}
            </div>

            <div className="py-6">
                {selectedTab === "description" && (
                    <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                        <div className="grid gap-4 mt-6">
                            {Object.entries({
                                'Phù hợp cho loại da': skinTypes,
                                'Dành cho mối quan tâm về': skinConcerns,
                                'Kết cấu': product.forms?.map(form => form.name).join(', ') || '',
                                'Ngày ra mắt': new Date(product.createDateTime).toLocaleDateString('vi-VN'),
                                'Tags': tags
                            }).map(([key, value]) => (
                                value && (
                                    <div key={key} className="py-2 border-b">
                                        <p><strong>{key}: </strong>{value}</p>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                )}
                {selectedTab === "ingredients" && (
                    <div className="prose max-w-none">
                        <h3 className="text-xl font-semibold mb-4">Thành phần</h3>
                        <p>{product.ingredient || "Không có thông tin thành phần."}</p>
                    </div>
                )}
                {selectedTab === "how to use" && (
                    <div className="prose max-w-none">
                        <h3 className="text-xl font-semibold mb-4">Hướng dẫn sử dụng</h3>
                        <div dangerouslySetInnerHTML={{ __html: product.instruction || "Không có hướng dẫn sử dụng." }} />
                    </div>
                )}
                {selectedTab === "feedback" && (
                    <div className="prose max-w-none">
                        <div className="flex flex-col md:flex-row gap-6 mb-8">
                            {/* Average Rating Section */}
                            <div className="md:w-1/2">
                                <div className="p-6 bg-white border rounded-lg">
                                    <h3 className="text-xl font-medium mb-4">Đánh giá trung bình</h3>
                                    <div className="flex items-start gap-2">
                                        <div className="text-5xl font-bold text-rose-500">{averageRating.toFixed(1)}</div>
                                        <div className="flex flex-col mt-1">
                                            <StarRating rating={(averageRating).toFixed(1)} size="w-6 h-6" />
                                            <div className="text-sm text-gray-500 mt-1">
                                                {totalFeedbacks} nhận xét
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating bars */}
                                    <div className="mt-6 space-y-2">
                                        {[5, 4, 3, 2, 1].map((rating) => (
                                            <div key={rating} className="flex items-center">
                                                <div className="w-12 text-sm text-gray-600">{rating} sao</div>
                                                <div className="flex-grow mx-3 h-4 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-rose-500"
                                                        style={{ width: `${ratingPercentages[rating - 1]}%` }}
                                                    ></div>
                                                </div>
                                                <div className="w-28 ml-2 text-sm text-gray-500">
                                                    {ratingCounts[rating - 1]} {rating === 5 ? 'Rất hài lòng' :
                                                        rating === 4 ? 'Hài lòng' :
                                                            rating === 3 ? 'Bình thường' :
                                                                rating === 2 ? 'Không hài lòng' : 'Rất tệ'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-medium mb-6">{totalFeedbacks} bình luận cho sản phẩm này</h3>

                        {/* Filter options */}
                        <div className="flex justify-end mb-6">
                            <div className="relative">
                                <select 
                                    className="pl-4 pr-8 py-2 border rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <option value="date">Ngày đánh giá</option>
                                    <option value="highest">Đánh giá cao nhất</option>
                                    <option value="lowest">Đánh giá thấp nhất</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Feedback List */}
                        {currentFeedbacks.length > 0 ? (
                            <div className="mt-6 space-y-6">
                                {currentFeedbacks.map((feedback, index) => (
                                    <div 
                                        key={`${feedback.id || index}`} 
                                        className={`border rounded-lg p-4 ${isCurrentUserFeedback(feedback) ? 'border-primary bg-primary/5' : ''}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className={`w-10 h-10 rounded-full ${isCurrentUserFeedback(feedback) ? 'bg-primary/20' : 'bg-primary/10'} flex items-center justify-center`}>
                                                    <span className="text-primary font-semibold">
                                                        {feedback?.userName.charAt(0) || "U"}
                                                    </span>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="flex items-center">
                                                        <p className="font-medium">{feedback?.userName || "Người dùng"}</p>
                                                    </div>
                                                    <div className="flex items-center mt-1">
                                                        <div className="flex">
                                                            <StarRating rating={(feedback.rating).toFixed(1)} size="w-2 h-2" />
                                                        </div>
                                                        <p className="text-xs text-gray-500 ml-2">
                                                            {formatDate(feedback.feedBackDate || Date.now())}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            {feedback.product && (
                                                <div className="hidden md:block text-sm text-gray-500">
                                                    {feedback.product.name}
                                                </div>
                                            )}
                                        </div>
                                        <p className="mt-3 text-gray-700">{feedback.comment || "Không có nhận xét."}</p>

                                        {/* Display all feedback images */}
                                        {feedback.images && feedback.images.length > 0 && (
                                            <div className="mt-4 flex gap-2 flex-wrap">
                                                {feedback.images.map((image, i) => (
                                                    <div key={i} className="relative group">
                                                        <img
                                                            src={image.url}
                                                            alt={`Ảnh đánh giá ${i + 1}`}
                                                            className="h-24 w-24 object-cover rounded-md cursor-pointer hover:opacity-90"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = assets.da_dau; // Fallback image
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Badge for purchased products */}
                                        {isCurrentUserFeedback(feedback)&& (
                                            <div className="mt-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                                                    <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                    Đánh giá của bạn
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này</p>
                                <p className="text-sm text-gray-400 mt-2">Hãy là người đầu tiên đánh giá sản phẩm!</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-8 space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                </button>

                                {generatePaginationItems()}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductTabs;