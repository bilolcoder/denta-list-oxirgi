import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaChevronLeft, 
    FaSearch, 
    FaRegBell, 
    FaStar, 
    FaHeart,
} from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuMessageSquareText } from "react-icons/lu";
import { FiPhone } from "react-icons/fi";
import { FaUserGroup } from 'react-icons/fa6';
import axios from 'axios';

// Rasm importlari
import doctor1Img from "../assets/denta1.jpg"; 
import doctor2Img from "../assets/denta2.jpg"; 

// Rang konstantalari
const primaryTeal = '#00BCE4';
const darkText = '#272937';
const accentRed = '#FF6F47';

// API konfiguratsiyasi
const API_CONFIG = {
    baseURL: 'http://app.dentago.uz/api',
    endpoints: {
        publicDoctors: '/public/doctors',
        userFavorites: '/user/favorites', // Bu endpoint mavjud bo'lsa
        appointments: '/appointments' // Agar appointments kerak bo'lsa
    }
};

// Axios instance yaratish
const apiClient = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor - har bir so'rovdan oldin token qo'shish
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - xatolarni boshqarish
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API xatosi:', error);
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userData');
            // Agar kerak bo'lsa, login sahifasiga yo'naltirish
        }
        return Promise.reject(error);
    }
);

function Yoqtirishlar() {
    const navigate = useNavigate();

    // === STATE LAR ===
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [doctorToDeleteId, setDoctorToDeleteId] = useState(null);
    const [favoriteDoctors, setFavoriteDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // === API DAN MA'LUMOT OLISH ===
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setLoading(true);
                
                // 1. Avval public API dan barcha shifokorlarni olish
                const publicDoctorsResponse = await apiClient.get(API_CONFIG.endpoints.publicDoctors);
                const allDoctors = publicDoctorsResponse.data || [];
                
                // 2. Agar user favorites endpoint mavjud bo'lsa, yoqtirilganlarni olish
                // Agar yo'q bo'lsa, local storage dan olish
                let favoriteIds = [];
                try {
                    const favoritesResponse = await apiClient.get(API_CONFIG.endpoints.userFavorites);
                    favoriteIds = favoritesResponse.data?.map(fav => fav.doctorId) || [];
                } catch (favError) {
                    // Agar favorites endpoint mavjud bo'lmasa, localStorage dan olish
                    const storedFavorites = JSON.parse(localStorage.getItem('favoriteDoctors') || '[]');
                    favoriteIds = storedFavorites;
                }
                
                // 3. Yoqtirilgan shifokorlarni filtratsiya qilish
                const favoriteDoctorsList = allDoctors
                    .filter(doctor => favoriteIds.includes(doctor.id))
                    .map((doctor, index) => formatDoctorData(doctor, index));
                
                // 4. Agar yoqtirilganlar bo'sh bo'lsa, demo ma'lumotlar
                if (favoriteDoctorsList.length === 0) {
                    setFavoriteDoctors(getDemoDoctors());
                    setError("Sizda hali yoqtirilgan shifokorlar yo'q. Barcha shifokorlar ro'yxatidan tanlash uchun 'Qabulga yozilish' bo'limiga o'ting.");
                } else {
                    setFavoriteDoctors(favoriteDoctorsList);
                    setError(null);
                }
                
            } catch (err) {
                console.error('Ma\'lumotlarni yuklashda xatolik:', err);
                
                // Xatolik turini aniqlash
                let errorMessage = "Ma'lumotlarni yuklashda xatolik yuz berdi";
                
                if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
                    errorMessage = "Internet aloqasi yo'q. Internetingizni tekshiring.";
                } else if (err.response?.status === 403) {
                    errorMessage = "Kirish rad etildi. Sizda ushbu ma'lumotlarni ko'rish uchun ruxsat yo'q.";
                } else if (err.response?.status === 404) {
                    errorMessage = "API endpoint topilmadi. Iltimos, administrator bilan bog'laning.";
                }
                
                setError(errorMessage);
                setFavoriteDoctors(getDemoDoctors());
                
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    // Shifokor ma'lumotlarini formatlash funksiyasi
    const formatDoctorData = (doctorData, index) => {
        return {
            id: doctorData.id || index + 1,
            name: `Dr. ${doctorData.firstName || ''} ${doctorData.lastName || ''}`.trim() || doctorData.name || `Shifokor ${index + 1}`,
            specialty: doctorData.specialty || doctorData.specialization || "Stomatolog",
            rating: doctorData.rating || (4.5 + Math.random() * 0.5).toFixed(1),
            distance: doctorData.distance || Math.floor(Math.random() * 10) + 1,
            patients: doctorData.patientsCount || doctorData.totalPatients || Math.floor(Math.random() * 300) + 50,
            experience: doctorData.experienceYears || doctorData.experience || Math.floor(Math.random() * 15) + 5,
            price: doctorData.price 
                ? `${doctorData.price.toLocaleString('uz-UZ')} so'm` 
                : `${(200000 + Math.random() * 100000).toLocaleString('uz-UZ')} so'm`,
            image: doctorData.image || doctorData.photo || (index % 2 === 0 ? doctor1Img : doctor2Img),
            phone: doctorData.phone || doctorData.contactNumber || `+9989${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
            clinic: doctorData.clinic || doctorData.clinicName || "Dentago Clinic",
            isFavorite: true
        };
    };

    // Demo ma'lumotlar
    const getDemoDoctors = () => {
        return [
            {
                id: 1,
                name: "Dr. Jamshid Rahmonov",
                specialty: "Ortoped",
                rating: "4.9",
                distance: 5,
                patients: 254,
                experience: 12,
                price: "250 000 so'm",
                image: doctor1Img,
                phone: "+998901234567",
                clinic: "Smile Dental clinic"
            },
            {
                id: 2,
                name: "Dr. O'tkir Rustamov",
                specialty: "Terapevt",
                rating: "4.8",
                distance: 4,
                patients: 124,
                experience: 10,
                price: "255 000 so'm",
                image: doctor2Img,
                phone: "+998901234568",
                clinic: "Shifo Nur Clinic"
            },
        ];
    };

    // === FUNKSIYALAR ===
    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoToNotifications = () => {
        navigate('/Notification'); 
    };
    
    // Qabulga yozilish
    const handleAppointment = (doctorId) => {
        const doctor = favoriteDoctors.find(doc => doc.id === doctorId);
        navigate('/qabulgayozilish', { 
            state: { 
                doctorId: doctorId,
                doctor: doctor
            } 
        }); 
    };
    
    // Chat funksiyasi
    const handleChat = (doctorId) => {
        const doctor = favoriteDoctors.find(doc => doc.id === doctorId);
        navigate(`/chat/${doctorId}`, { 
            state: { doctor: doctor }
        }); 
    };
    
    // Qo'ng'iroq funksiyasi
    const handleCall = (doctorId) => {
        const doctor = favoriteDoctors.find(doc => doc.id === doctorId);
        if (doctor && doctor.phone) {
            const confirmCall = window.confirm(`${doctor.name} ga qo'ng'iroq qilishni xohlaysizmi?\n${doctor.phone}`);
            if (confirmCall) {
                window.location.href = `tel:${doctor.phone}`;
            }
        }
    };

    // Yoqtirishdan olib tashlash
    const handleRemoveFavorite = async (doctorId) => {
        try {
            // 1. API ga so'rov yuborish
            await apiClient.delete(`/user/favorites/${doctorId}`);
            
            // 2. Local storage yangilash
            const storedFavorites = JSON.parse(localStorage.getItem('favoriteDoctors') || '[]');
            const updatedFavorites = storedFavorites.filter(id => id !== doctorId);
            localStorage.setItem('favoriteDoctors', JSON.stringify(updatedFavorites));
            
            // 3. UI ni yangilash
            setFavoriteDoctors(prev => prev.filter(doctor => doctor.id !== doctorId));
            
        } catch (err) {
            console.error('Yoqtirishdan olib tashlashda xatolik:', err);
            
            // Agar API so'rovi muvaffaqiyatsiz bo'lsa, faqat local state o'zgartiramiz
            setFavoriteDoctors(prev => prev.filter(doctor => doctor.id !== doctorId));
        }
    };

    // Yoqtirishdan olib tashlash modalini ochish
    const handleRemoveFavoriteModalOpen = (doctorId) => {
        setDoctorToDeleteId(doctorId);
        setIsDeleteModalOpen(true);
    };

    // Yoqtirishdan olib tashlashni tasdiqlash
    const handleConfirmRemoveFavorite = () => {
        if (doctorToDeleteId !== null) {
            handleRemoveFavorite(doctorToDeleteId);
        }
        setIsDeleteModalOpen(false);
        setDoctorToDeleteId(null);
    };

    // Yoqtirishdan olib tashlashni bekor qilish
    const handleCancelRemoveFavorite = () => {
        setIsDeleteModalOpen(false);
        setDoctorToDeleteId(null);
    };

    // Chat sahifasiga o'tish
    const handleGoToChat = () => {
        navigate('/chats');
    };

    // Qidiruv funksiyasi
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filterlangan shifokorlar
    const filteredDoctors = favoriteDoctors.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.clinic.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // === RENDER ===
    return (
        <div className='min-h-screen bg-gray-50 pb-[80px]'> 
            
            {/* Yuqori Sarlavha */}
            <header 
                className="p-4 pb-16 pt-8 rounded-b-[40px] shadow-lg relative"
                style={{backgroundColor: primaryTeal}}
            >
                <div className="flex justify-between items-center mb-6">
                    <FaChevronLeft 
                        className="text-white text-2xl cursor-pointer" 
                        onClick={handleGoBack}
                    />
                    <LuMessageSquareText 
                        className="text-white text-2xl cursor-pointer" 
                        onClick={handleGoToChat}
                    /> 
                </div>

                <h1 className="text-white text-2xl font-bold mb-4">
                    Menga yoqqan shifokorlar
                </h1>

                <div className='relative'>
                    <input 
                        type="text"
                        placeholder="Shifokor yoki klinika qidirish..."
                        className="w-full h-12 bg-white rounded-xl shadow-md pl-12 pr-12 text-sm focus:outline-none"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <FaSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400' />
                    <FaRegBell 
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg cursor-pointer'
                        onClick={handleGoToNotifications}
                    />
                </div>
            </header>

            {/* Xatolik xabari */}
            {error && !loading && (
                <div className="mx-4 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-yellow-700 text-sm">{error}</p>
                    <p className="text-gray-500 text-xs mt-1">Demo ma'lumotlar bilan ko'rsatilmoqda</p>
                </div>
            )}

            {/* Yuklash ko'rsatkichi */}
            {loading && (
                <div className="p-8 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-t-[#00BCE4] border-gray-200 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600">Ma'lumotlar yuklanmoqda...</p>
                </div>
            )}

            {/* Asosiy Kontent - Shifokorlar Ro'yxati */}
            {!loading && (
                <div className='p-4 space-y-5'>
                    {filteredDoctors.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                            <FaHeart className="text-gray-300 text-5xl mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                {searchTerm ? 'Qidiruv bo\'yicha natija topilmadi' : 'Yoqtirilgan shifokorlar yo\'q'}
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {searchTerm 
                                    ? 'Boshqa kalit so\'zlar bilan qidiring'
                                    : 'Shifokorlarni yoqtirish uchun ♥ tugmasini bosing'}
                            </p>
                            <button 
                                onClick={() => navigate('/doctors')}
                                className="px-6 py-3 bg-[#00BCE4] text-white rounded-full font-semibold hover:bg-cyan-600 transition"
                            >
                                Barcha shifokorlarni ko'rish
                            </button>
                        </div>
                    ) : (
                        filteredDoctors.map((doctor) => (
                            <div 
                                key={doctor.id} 
                                className='bg-white rounded-2xl shadow-md p-4 flex flex-col'
                            >
                                {/* Shifokorning asosiy ma'lumotlari */}
                                <div className='flex items-center space-x-4 mb-4'>
                                    <div className='relative flex-shrink-0'>
                                        <img 
                                            src={doctor.image}
                                            alt={doctor.name}
                                            className="w-24 h-24 rounded-2xl object-cover"
                                            onError={(e) => {
                                                e.target.src = doctor1Img;
                                            }}
                                        />
                                        <div className='absolute top-2 right-2 p-1 rounded-full bg-white opacity-90'>
                                            <FaHeart className="text-red-500 text-base" /> 
                                        </div>
                                        <div className='absolute bottom-1 right-1 px-2 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full'>
                                            24/7
                                        </div>
                                    </div>

                                    <div className='flex-grow'>
                                        <h3 
                                            className="text-lg font-bold" 
                                            style={{color: darkText}}
                                        >
                                            {doctor.name}
                                        </h3>
                                        <p className='text-gray-500 text-sm mb-2'>{doctor.specialty}</p>

                                        <div className='flex items-center space-x-3 text-sm text-gray-600 mb-2'>
                                            <div className='flex items-center'>
                                                <FaStar className='text-yellow-500 text-xs mr-1' />
                                                <span>{doctor.rating}</span>
                                            </div>
                                            <div className='flex items-center'>
                                                <span className='mr-1'>📍</span> 
                                                <span>{doctor.distance} km</span>
                                            </div>
                                        </div>

                                        <div className='text-xs text-gray-500 space-y-1'>
                                            <div className='flex items-center space-x-2'>
                                                <FaUserGroup className='text-gray-400' />
                                                <span>{doctor.patients} ta bemor</span>
                                                <span>|</span>
                                                <span>{doctor.experience}+ yil tajriba</span>
                                            </div>
                                            <p className='font-semibold text-sm'>
                                                {doctor.price}
                                            </p>
                                            <p className='text-gray-400 text-xs'>
                                                {doctor.clinic}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Pastki tugmalar qismi */}
                                <div className='flex items-center space-x-3 pt-3 border-t border-gray-100'>
                                    <button
                                        onClick={() => handleAppointment(doctor.id)}
                                        className="flex-1 h-12 border text-base font-semibold rounded-full hover:bg-cyan-50 transition"
                                        style={{borderColor: primaryTeal, color: primaryTeal}}
                                    >
                                        Qabulga yozilish
                                    </button>
                                    
                                    <button
                                        onClick={() => handleChat(doctor.id)}
                                        className="w-12 h-12 rounded-full flex justify-center items-center hover:bg-purple-200 transition"
                                        style={{backgroundColor: '#7B7BFF'}}
                                    >
                                        <LuMessageSquareText className="text-white text-lg" /> 
                                    </button>
                                    
                                    <button
                                        onClick={() => handleCall(doctor.id)}
                                        className="w-12 h-12 rounded-full flex justify-center items-center hover:bg-green-600 transition"
                                        style={{backgroundColor: '#00E42A'}}
                                    >
                                        <FiPhone className="text-white text-lg" /> 
                                    </button>

                                    <button
                                        onClick={() => handleRemoveFavoriteModalOpen(doctor.id)}
                                        className="w-12 h-12 rounded-full flex justify-center items-center hover:bg-red-500 transition"
                                        style={{backgroundColor: accentRed}}
                                    >
                                        <RiDeleteBin6Line className="text-white text-lg" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
            
            {/* Yoqtirishdan olib tashlash modali */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl mx-6 p-6 w-11/12 max-w-sm">
                        <h3 
                            className="text-center text-lg font-semibold mb-6"
                            style={{color: darkText}}
                        >
                            Rostdan ham o'chirmoqchimisiz?
                        </h3>

                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={handleCancelRemoveFavorite}
                                className="w-full h-12 text-white text-base font-semibold rounded-xl hover:bg-cyan-600 transition"
                                style={{backgroundColor: primaryTeal}}
                            >
                                Yo'q
                            </button>

                            <button
                                onClick={handleConfirmRemoveFavorite}
                                className="w-full h-12 border text-base font-semibold rounded-xl hover:bg-gray-100 transition"
                                style={{borderColor: primaryTeal, color: primaryTeal}}
                            >
                                Ha
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Yoqtirishlar;