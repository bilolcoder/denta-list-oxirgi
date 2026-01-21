import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaChevronLeft, FaSearch, FaRegCommentDots } from "react-icons/fa";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa"; 

function Notification() {
    const navigate = useNavigate();

    const primaryTeal = '#00BCE4';
    const darkText = '#272937';
    const white = '#FFFFFF';
    const lightGray = '#F4F7FE';
    const linkBlue = '#3353FF';

    const handleGoBack = () => {
        navigate(-1);
    };

    // Rasmdagi xabarlar ma'lumotlari
    const notifications = [
        { 
            title: "Shifokor qabuliga yozildingiz", 
            date: "12-noyabr, 2025", 
            status: "yangi", 
            type: "appointment", 
            details: {
                date: "12-noyabr, 2025",
                time: "14:00"
            }
        },
        { 
            title: "Dastur yangilanishi", 
            date: "2-noyabr, 2025", 
            status: "ko'rilgan", 
            type: "update", 
            description: "Sizning mobil ilovangizda Android 14 tizimiga mos xavfsizlik yangilanishlari amalga oshirildi. Iltimos, ilovani Play Market orqali yangilang." 
        },
        { 
            title: "Profil ma'lumotlari yangilandi", 
            date: "25-sentabr, 2025", 
            status: "ko'rilgan", 
            type: "info", 
            description: "Profilingizdagi kiritgan o'zgartirishlaringiz muvaffaqiyatli yangilandi." 
        },
        { 
            title: "Ilovaga xush kelibsiz", 
            date: "25-sentabr, 2025", 
            status: "ko'rilgan", 
            type: "welcome", 
            description: "Ilovada muvaffaqiyatli ro'yxatdan o'tganingiz bilan tabriklaymiz!" 
        },
    ];

    return (
        <div className='min-h-screen bg-gray-50 pb-20'> 
            
            <header className={`bg-[${primaryTeal}] p-4 pb-16 pt-8 rounded-b-[40px] shadow-lg relative`}>
                <div className="flex justify-between items-center mb-4">
                    <FaChevronLeft 
                        className={`text-white text-2xl cursor-pointer`} 
                        onClick={handleGoBack}
                    />
                    <FaRegCommentDots className={`text-white text-2xl cursor-pointer`} /> 
                </div>

                <h1 className={`text-white text-2xl font-bold mb-4`}>
                    Bildirishnomalar
                </h1>

                
            </header>

            {/* Xabarlar Ro'yxati */}
            <div className='p-4 space-y-4'>
                {notifications.map((notif, index) => (
                    <div key={index} className='bg-white p-4 rounded-xl shadow-md'>
                        
                        {/* Sarlavha va Sana/Status */}
                        <div className='flex justify-between items-center mb-2'>
                            <h3 className={`text-base font-semibold text-[${darkText}]`}>
                                {notif.title}
                            </h3>
                            <div className='flex items-center space-x-2'>
                                <span className='text-xs text-gray-500'>
                                    {notif.date}
                                </span>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                    notif.status === 'yangi' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {notif.status}
                                </span>
                            </div>
                        </div>

                        {/* Xabar Detallari */}
                        {notif.type === 'appointment' && (
                            <div className='space-y-2 text-sm'>
                                <div className='flex items-center'>
                                    <FaRegCalendarAlt className={`text-[${primaryTeal}] mr-3`} />
                                    <span className='text-gray-500'>Qabul sanasi</span>
                                    <span className={`ml-auto font-medium text-[${primaryTeal}]`}>{notif.details.date}</span>
                                </div>
                                <div className='flex items-center'>
                                    <FaRegClock className={`text-[${primaryTeal}] mr-3`} />
                                    <span className='text-gray-500'>Qabul Vaqti</span>
                                    <span className={`ml-auto font-medium text-[${primaryTeal}]`}>{notif.details.time}</span>
                                </div>
                            </div>
                        )}

                        {/* Oddiy Xabar Detallari */}
                        {(notif.type === 'update' || notif.type === 'info' || notif.type === 'welcome') && (
                            <p className='text-sm text-gray-600 leading-snug'>
                                {notif.description}
                            </p>
                        )}

                    </div>
                ))}
            </div>
            
        </div>
    );
}

export default Notification;