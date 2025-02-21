import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const BlogCard = ({ id, image, title, publish, slug, content }) => {
    return (
        <div key={id} className="group h-full">
            <div
                className="block h-full bg-white duration-300"
            >
                <article className="flex h-full items-center px-8 gap-4">
                    {/* Image Container */}
                    <Link to={`/blog/${slug}`} className="relative overflow-hidden w-1/3 aspect-video">
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 duration-500"
                            loading="lazy"
                        />
                    </Link>

                    {/* Content Container */}
                    <div className="flex flex-col flex-grow w-2/3">
                        <Link to={`/blog/${slug}`} className="text-base text-lg font-semibold leading-snug text-gray-900 hover:text-rose-600 mb-2 line-clamp-2">
                            {title}
                        </Link>
                        {/* Publish date badge */}
                        <div className="mt-auto flex flex-col items-start">
                            <time className="text-xs font-medium mb-2 text-gray-700">{publish}</time>
                            <hr className='bg-black w-[4%] h-[3px]'/>
                            <div className='text-base text-sm leading-snug text-gray-900 mt-2 line-clamp-1' dangerouslySetInnerHTML={{ __html: content }} />
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

BlogCard.propTypes = {
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    publish: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
};

export default BlogCard;
