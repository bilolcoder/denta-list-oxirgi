import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ... (boshqa importlar o'zgarishsiz)
import { 
    FaChevronLeft, 
    FaSearch, 
    FaRegBell, 
    FaStar, 
    FaHeart, 
    FaTrashAlt 
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { LuMessageSquareText } from "react-icons/lu";
import { FiPhone } from "react-icons/fi";
import { BsChatText } from "react-icons/bs";

// Rasm importlari
import doctor1Img from "../assets/denta1.jpg";
import userImg from "../assets/denta2.jpg";
import doctor2Img from "../assets/denta3.jpg"; // Misol rasm


function Sharhlar() {
    const navigate = useNavigate();

    // === STATE LAR ===
    const [reviewedDoctors, setReviewedDoctors] = useState([
        // ... (Sharhlar ma'lumotlari o'zgarishsiz)
        {
            id: 1,
            name: "Dr. Jamshid Rahmonov",
            specialty: "Ortoped",
            rating: 4.9,
            distance: 5, 
            patients: 254,
            experience: 12, 
            price: "250 000",
            image: doctor1Img,
            // ... review
            review: {
                reviewerName: "Tohirov Azamat",
                timeAgo: "2 kun avval",
                text: "Tishlarni oqartirish uchun qabulga yozilgan edim. Menga xizmat juda yoqdi. Ajoyib natija! Tavsiya qilaman.",
                stars: 5,
                reviewerImage: userImg,
            }
        },
        {
            id: 2,
            name: "Dr. O'tkir Rustamov",
            specialty: "Terapevt",
            rating: 4.9,
            distance: 4, 
            patients: 124,
            experience: 10, 
            price: "255 000",
            image: doctor2Img, 
            // ... review
            review: {
                reviewerName: "Tohirov Azamat",
                timeAgo: "1 hafta avval",
                text: "Rostini aytsam, kutganimdan ham a'lo bo'ldi. Bemalol murojaat qilishingiz mumkin.",
                stars: 4,
                reviewerImage: userImg,
            }
        },
    ]);

    // ... (Tahrirlash state lari o'zgarishsiz)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingDoctorId, setEditingDoctorId] = useState(null);
    const [currentReviewText, setCurrentReviewText] = useState('');
    const [currentReviewStars, setCurrentReviewStars] = useState(0);

    // Rang konstantalari
    const primaryTeal = '#00BCE4';
    const darkText = '#272937';
    const accentRed = '#FF6B6B';

    // === YANGI FUNKSIYA: Doktor profiliga o'tish ===
    const handleGoToDoctorProfile = (doctor) => {
        // Shifokor ma'lumotlarini state orqali uzatish
        // Misol uchun, /shifokorlar/123 kabi yo'nalishga o'tish
        navigate(`/shifokorlar/${doctor.id}`, { state: { doctor } });
    };
    
    // ... (boshqa funksiyalar o'zgarishsiz)
    const handleCancelEdit = () => {
        setIsEditModalOpen(false);
        setEditingDoctorId(null);
        setCurrentReviewText('');
        setCurrentReviewStars(0);
    };

    const handleGoBack = () => {
        // Agar modal ochiq bo'lsa, uni yopamiz
        if (isEditModalOpen) {
            handleCancelEdit();
        } else {
            navigate(-1);
        }
    };
    
    const handleGoToNotifications = () => {
        navigate('/Notification'); 
    };

    const handleDeleteReview = (doctorId) => {
        const doctorName = reviewedDoctors.find(d => d.id === doctorId)?.name;
        if (window.confirm(`${doctorName} shifokori haqidagi sharhni rostdan ham o'chirmoqchimisiz?`)) {
            setReviewedDoctors(currentDoctors => 
                currentDoctors.filter(doctor => doctor.id !== doctorId)
            );
            if (editingDoctorId === doctorId) {
                handleCancelEdit();
            }
            console.log(`Sharh ${doctorId} o'chirildi`);
        }
    };

    const handleEditReview = (doctorId) => {
        const doctor = reviewedDoctors.find(d => d.id === doctorId);
        if (doctor) {
            setEditingDoctorId(doctorId);
            setCurrentReviewText(doctor.review.text);
            setCurrentReviewStars(doctor.review.stars);
            setIsEditModalOpen(true);
        }
    };
    
    const handleSaveReview = () => {
        if (editingDoctorId !== null) {
            setReviewedDoctors(currentDoctors => 
                currentDoctors.map(doctor => 
                    doctor.id === editingDoctorId
                        ? {
                            ...doctor,
                            review: {
                                ...doctor.review,
                                text: currentReviewText,
                                stars: currentReviewStars,
                            }
                        }
                        : doctor
                )
            );
        }
        handleCancelEdit();
    };

    const renderStars = (count, clickable = false, setter = () => {}) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <FaStar 
                    key={i} 
                    className={`text-sm ${i < count ? 'text-yellow-400' : 'text-gray-300'} ${clickable ? 'cursor-pointer' : ''}`} 
                    onClick={clickable ? () => setter(i + 1) : undefined}
                />
            );
        }
        return <div className='flex space-x-0.5'>{stars}</div>;
    };


    const currentDoctor = editingDoctorId 
        ? reviewedDoctors.find(d => d.id === editingDoctorId)
        : null;

    return (
        <div className='min-h-screen bg-gray-50 pb-[80px]'> 
            
            {/* Yuqori Sarlavha (Header) */}
            <header className={`bg-[${primaryTeal}] p-4 pb-16 pt-8 rounded-b-[40px] shadow-lg relative`}>
                <div className="flex justify-between items-center mb-6">
                    <FaChevronLeft 
                        className={`text-white text-2xl cursor-pointer`} 
                        onClick={handleGoBack}
                    />
                    <BsChatText className={`text-white text-2xl cursor-pointer`} /> 
                </div>

                <h1 className={`text-white text-2xl font-bold mb-4`}>
                    {isEditModalOpen ? "Sharhni tahrirlash" : "Men qoldirgan sharhlar"}
                </h1>

                {/* Qidiruv maydoni faqat asosiy sahifada ko'rinadi */}
                {!isEditModalOpen && (
                    <div className='relative'>
                        <input 
                            type="text"
                            placeholder="Shifokor yoki klinika qidirish..."
                            className="w-full h-12 bg-white rounded-xl shadow-md pl-12 pr-12 text-sm focus:outline-none"
                        />
                        <FaSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400' />
                        <FaRegBell 
                            className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg cursor-pointer'
                            onClick={handleGoToNotifications}
                        />
                    </div>
                )}
            </header>

            {/* Asosiy Kontent - Sharhlar Ro'yxati */}
            {!isEditModalOpen ? (
                <div className='p-4 space-y-6'>
                    {/* Sharhlar ro'yxati */}
                    {reviewedDoctors.map((doctor) => (
                        <div 
                            key={doctor.id} 
                            className='bg-white rounded-2xl shadow-md p-4 flex flex-col'
                        >
                            {/* Shifokor kartochkasi kontenti... */}
                            <div className='flex items-center space-x-4 mb-4'>
                                <div className='relative flex-shrink-0'>
                                    <img src={doctor.image} alt={doctor.name} className="w-24 h-24 rounded-2xl object-cover" />
                                    <div className='absolute top-2 right-2 p-1 rounded-full bg-white opacity-90'>
                                         <FaHeart className={`text-[${accentRed}] text-base`} /> 
                                    </div>
                                    <div className='absolute bottom-1 right-1 px-2 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full'>
                                        24/7
                                    </div>
                                </div>

                                <div className='flex-grow'>
                                    <h3 className={`text-lg font-bold text-[${darkText}]`}>{doctor.name}</h3>
                                    <p className='text-gray-500 text-sm mb-2'>{doctor.specialty}</p>

                                    <div className='flex items-center space-x-3 text-sm text-gray-600 mb-2'>
                                        <div className='flex items-center'>
                                            <FaStar className='text-yellow-500 text-xs mr-1' />
                                            <span>{doctor.rating}</span>
                                        </div>
                                        <span className='mr-1'>📍 {doctor.distance} km</span>
                                    </div>
                                    <div className='text-xs text-gray-500'>
                                        <span className='mr-3'>{doctor.patients} ta bemor</span>
                                        <span>| {doctor.experience}+ tajriba</span>
                                    </div>
                                    <p className='font-semibold text-sm mt-1'>
                                        {doctor.price} so'm o'rtacha narx
                                    </p>
                                </div>
                            </div>
                            {/* Shifokor tugmalari... */}
                            <div className='flex items-center space-x-3 mb-4'>
                                <button
                                    onClick={() => handleGoToDoctorProfile(doctor)} // YANGI FUNKSIYANI BOG'LASH
                                    className={`flex-1 h-12 border border-[${primaryTeal}] text-[${primaryTeal}] text-base font-semibold rounded-full hover:bg-cyan-50 transition`}
                                >
                                    Profilni ko'rish
                                </button>
                                <button
                                    className='w-12 h-12 bg-[#7B7BFF] rounded-full flex justify-center items-center hover:bg-purple-200 transition'
                                >
                                    <LuMessageSquareText className='text-white text-lg' />  
                                </button>
                                <button
                                    className={`w-12 h-12 bg-[#00E42A] rounded-full flex justify-center items-center hover:bg-green-200 transition`}
                                >
                                    <FiPhone className={`text-white text-lg`} /> 
                                </button>
                            </div>
                            {/* Sharh Kartochkasi (Pastki qism) */}
                            {/* ... (Sharh kontenti qismi o'zgarishsiz) ... */}
                            <div className='pt-4 border-t border-gray-100'>
                                <div className='flex justify-between items-start mb-2'>
                                    <div className='flex items-center space-x-3'>
                                        <img 
                                            src={doctor.review.reviewerImage}
                                            alt={doctor.review.reviewerName}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className='font-bold text-sm text-[${darkText}]'>{doctor.review.reviewerName}</p>
                                            <p className='text-xs text-gray-500'>{doctor.review.timeAgo}</p>
                                        </div>
                                    </div>
                                    {/* Tahrirlash va O'chirish ikonkalari */}
                                    <div className='flex space-x-3 text-gray-400'>
                                        <MdEdit 
                                            className='text-lg cursor-pointer hover:text-blue-500 transition' 
                                            onClick={() => handleEditReview(doctor.id)} 
                                        />
                                        <FaTrashAlt 
                                            className='text-base cursor-pointer hover:text-red-500 transition' 
                                            onClick={() => handleDeleteReview(doctor.id)}
                                        />
                                    </div>
                                </div>
                                
                                {/* Sharh matni */}
                                <p className='text-sm text-gray-700 mt-2 leading-relaxed'>
                                    {doctor.review.text}
                                </p>

                                {/* Sharh yulduzlari */}
                                <div className='mt-2'>
                                    {renderStars(doctor.review.stars)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // >>> SHARHNI TAHRIRLASH OYNASI/MODALI <<<
                // ... (Tahrirlash modali qismi o'zgarishsiz) ...
                <div className='p-4'>
                    <div className='bg-white rounded-2xl shadow-md p-4 flex flex-col'>
                        
                        {/* Shifokorning rasmi va ma'lumotlari */}
                        <div className='flex items-center space-x-4 mb-6 pb-4 border-b border-gray-100'>
                             <img src={currentDoctor?.image} alt={currentDoctor?.name} className="w-12 h-12 rounded-full object-cover" />
                             <h4 className={`text-base font-semibold text-[${darkText}]`}>{currentDoctor?.name}</h4>
                        </div>
                        
                        {/* Sharh yulduzlarini tahrirlash */}
                        <h3 className={`text-lg font-bold text-[${darkText}] mb-3`}>Sharhni o'zgartirish</h3>
                        <div className='flex justify-start mb-4'>
                            {renderStars(currentReviewStars, true, setCurrentReviewStars)}
                        </div>

                        {/* Sharh matnini tahrirlash */}
                        <textarea
                            value={currentReviewText}
                            onChange={(e) => setCurrentReviewText(e.target.value)}
                            rows="5"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[${primaryTeal}] focus:border-[${primaryTeal}] text-sm text-gray-700 resize-none"
                            placeholder="Sharhingizni kiriting..."
                        />

                        {/* Saqlash tugmasi */}
                        <button
                            onClick={handleSaveReview}
                            className={`w-full h-12 bg-[${primaryTeal}] text-white text-base font-semibold rounded-full mt-4 hover:bg-cyan-600 transition`}
                        >
                            Saqlash
                        </button>
                    </div>
                </div>
            )}
            
        </div>
    );
}

export default Sharhlar;