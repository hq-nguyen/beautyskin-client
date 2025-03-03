/* eslint-disable react/prop-types */
// import React from 'react'
import { Link } from 'react-router-dom';
import { assets } from '../../assets/frontend_assets/assets';
import { FaMapLocation } from "react-icons/fa6";

const Footer = () => {
    return (
        <>
            <footer className="relative z-10 border-t-[2px] lg:pt-[40px]">
                <div className="container flex mx-auto px-4 sm:px-[5vw]">
                    <div className="-mx-4 flex flex-wrap">
                        <div className="w-full px-4 sm:w-2/3 lg:w-3/12">
                            <div className="mb-10 w-full">
                                <Link to={'/'} className="inline-block max-w-[260px]">
                                    <img
                                        src={assets.logo}
                                        alt="logo"
                                        className="max-w-full"
                                    />
                                </Link>
                                <p className="mb-7 text-gray-600 text-base text-body-color dark:text-dark-6">
                                    Top 10 cửa hàng mỹ phẩm chất lượng hàng đầu Việt Nam
                                </p>
                                <p className="flex items-center text-sm font-medium text-dark dark:text-white">
                                    <span className="mr-3 text-primary">
                                        <img className='w-4' src={assets.phone} alt="" />
                                    </span>
                                    <span className='text-black'>(+84) 345 678 999</span>
                                </p>
                            </div>
                        </div>

                        <LinkGroup header="DỊCH VỤ">
                            <LinkMove link="/#" label="Theo dõi đơn hàng" />
                            <LinkMove link="/support" label="Điều khoản và điều kiện" />
                            <LinkMove link="/#" label="Chính sách bảo mật" />
                        </LinkGroup>
                        <LinkGroup header="THÔNG TIN">
                            <LinkMove link="/about" label="Về chúng tôi" />
                            <LinkMove link="/shop" label="Sản phẩm" />
                            <LinkMove link="/#" label="Địa chỉ" />
                            <LinkMove link="#" label="Liên hệ" />
                        </LinkGroup>
                        <LinkGroup header="THEO DÕI & LIÊN HỆ">
                            <div className="flex items-center">
                                <a
                                    href={'https://www.facebook.com/'}
                                    className="mr-3 flex h-8 w-8 items-center justify-center rounded-full opacity-50 hover:opacity-100 transition-opacity sm:mr-4 lg:mr-3 xl:mr-4"
                                >
                                    <img src={assets.i_facebook} alt="" />
                                </a>
                                <a
                                    href={'https://www.instagram.com/'}
                                    className="mr-3 flex h-8 w-8 items-center justify-center rounded-full opacity-50 hover:opacity-100 transition-opacity sm:mr-4 lg:mr-3 xl:mr-4"
                                >
                                    <img src={assets.i_instagram} alt="" />
                                </a>
                                <a
                                    href={'https://www.tiktok.com/'}
                                    className="mr-3 flex h-8 w-8 items-center justify-center rounded-full opacity-50 hover:opacity-100 transition-opacity sm:mr-4 lg:mr-3 xl:mr-4"
                                >
                                    <img src={assets.i_tiktok} alt="" />
                                </a>
                                <a
                                    href={'https://www.youtube.com/'}
                                    className="mr-3 flex h-8 w-8 items-center justify-center rounded-full opacity-50 hover:opacity-100 transition-opacity sm:mr-4 lg:mr-3 xl:mr-4"
                                >
                                    <img src={assets.i_youtube} alt="" />
                                </a>
                            </div>
                            <p className='text-primary italic cursor-pointer'>beautyskin@gmail.com</p>

                            <div className='flex items-center mb-4'>
                                <FaMapLocation className='w-4 h-4 mr-4' />
                                <p className='text-gray-600 text-sm'>Quận 9, Đại học FPT</p>
                            </div>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6099415304775!2d106.80730807428841!3d10.841132857998375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2sus!4v1740560712448!5m2!1svi!2sus"
                                width="100%"
                                height="150"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="rounded-md"
                            ></iframe>  

                        </LinkGroup>

                        <div className="w-full px-4 sm:w-2/3 lg:w-3/12">
                            <div className="mb-10 w-full">
                                <p className='text-primary italic flex mb-4 items-center'>
                                    <img className='w-4 h-4 mr-4' src={assets.phone} alt="" />
                                    Đường dây nóng: 1999-0009
                                </p>
                                <p className='text-black flex mb-4 items-center'>
                                    <img className='w-4 h-4 mr-4' src={assets.i_clock} alt="" />
                                    Giờ làm việc: 7 A.M - 8 P.M
                                </p>
                                <p className='text-black flex mb-4 items-center'>
                                    <img className='w-4 h-4 mr-4' src={assets.i_bussiness_open} alt="" />
                                    Ngày mở cửa: Thứ 2 - Thứ 7
                                </p>
                                <p className="flex items-center text-xs text-gray-600 font-medium italic mt-4">
                                    Xin lưu ý, có thể có sự chậm trễ trong việc phản hồi ngoài giờ làm việc bình thường, cuối tuần và ngày lễ.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
                {/* <hr className="my-4 border-blueGray-300" /> */}
                <div className="flex flex-wrap items-center md:justify-between justify-center bg-primary">
                    <div className="w-full md:w-4/12 mx-auto text-center">
                        <div className="w-full text-sm font-semibold py-1 text-white">
                            BeautySkin © <span id="get-current-year">2025. </span>Thiết kế bởi BeautySkin Team.
                        </div>
                    </div>
                </div>

            </footer>
        </>
    );
};

const LinkGroup = ({ children, header }) => {
    return (
        <>
            <div className="w-full px-4 sm:w-1/2 lg:w-2/12">
                <div className="mb-10 w-full">
                    <h4 className="mb-4 text-sm font-bold text-primary">
                        {header}
                    </h4>
                    <ul className="space-y-3">{children}</ul>
                </div>
            </div>
        </>
    )
}

const LinkMove = ({ link, label }) => {
    return (
        <li>
            <Link
                to={link}
                className="inline-block font-semibold text-sm hover:text-rose-600"
            >
                {label}
            </Link>
        </li>
    );
};

export default Footer