import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { assets } from "../../assets/frontend_assets/assets";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "Top 3 Kem Chống Nắng Bán Chạy Nhất Olive Young Hàn Quốc 2023",
    image: assets.blog_1,
    readMoreLink: "#"
  },
  {
    id: 2,
    title: "Top 10+ Kem Chống Nắng Tốt, Được Ưa Chuộng Nhất Hiện Nay",
    image: assets.blog_2,
    readMoreLink: "#"
  },
  {
    id: 3,
    title: "Review Sữa Chống Nắng Bí Đao Cocoon Nào Mới Là Chân Ái",
    image: assets.blog_3,
    readMoreLink: "#"
  },
  {
    id: 4,
    title: "Làm Đẹp Cùng Bác Sĩ - Kỳ 9: Những Sai Lầm Chăm Sóc Da",
    image: assets.blog_4,
    readMoreLink: "#"
  }
];

const BlogCard = React.memo(({ post }) => {
  return (
    <div className="bg-card rounded-sm overflow-hidden border hover:shadow-md transition-shadow duration-300">
      <div className="relative overflow-hidden aspect-video lg:h-36">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300 cursor-pointer"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <p className="text-sm text-foreground hover:text-rose-600 mb-2 line-clamp-2 cursor-pointer">
          {post.title}
        </p>
        <p className='text-[12px] text-gray-700 mb-4'>20/10/2025</p>
        <button
          aria-label="Read more"
          className="inline-flex items-center border border-black px-2 py-1 rounded-md hover:border-rose-600 hover:bg-rose-600 hover:text-white duration-300"
        >
          Đọc Blog
          <FiArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
});

const Blog = () => {
  return (
    <div className="relative bg-pink-50 -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <section className="container mx-auto mt-20 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1 flex flex-col justify-center">
            <h2 className="text-xl font-heading text-primary mb-4">
              Từ Blog Của Chúng Tôi
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Mọi thứ về chăm sóc da – Mọi thứ bạn cần biết để làn da khỏe đẹp!
            </p>
            <Link to={'/blog'}>
              <button
                className="inline-flex items-center border border-black bg-gray-50 text-black px-6 py-3 rounded-full hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-colors duration-150"
                aria-label="Go to blog"
              >
                Đến trang Blog
                <FiArrowRight className="ml-2" />
              </button>
            </Link>
          </div>

          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};



export default Blog;