import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaSearch, FaRegBell, FaRegCommentDots } from "react-icons/fa";
import { FiUser, FiHeart, FiLogOut } from "react-icons/fi";
import { IoIosHeartEmpty } from "react-icons/io";
import { BsChatText } from "react-icons/bs";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import profileImg from "../assets/denta1.jpg";

function Profil_pages() {
  const navigate = useNavigate();

  // State'lar
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [user, setUser] = useState(null); // null → kirmagan, object → kirgan

  // Ranglar
  const primaryTeal = '#00BCE4';
  const darkText = '#272937';
  const white = '#FFFFFF';

  // Foydalanuvchi ma'lumotlarini olish
  useEffect(() => {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const parsed = JSON.parse(userDataStr);
        if (parsed?.name && parsed.name.trim()) {
          setUser({
            name: parsed.name.trim(),
            phone: parsed.phone || '',
            // agar kerak bo'lsa yana qo'shimcha maydonlar
          });
        }
      } catch (e) {
        console.error("userData parse xatosi:", e);
      }
    }
  }, []);

  const isAuthenticated = !!user;

  // Tizimdan chiqish tasdiqlash
  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userPhone');
    navigate('/login');
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  // Menyu elementlari (kirgan foydalanuvchi uchun)
  const menuItems = [
    { Icon: FaUserDoctor, label: 'Qabullar ro\'yxati', path: '/mening-shifokorlarim' },
    { Icon: IoIosHeartEmpty, label: 'Doktorlarim', path: '/yoqtirishlar' },
    { Icon: BsChatText, label: 'Sharhlar', path: '/sharhlar' },
    // { Icon: MdOutlineModeEdit, label: "Ma'lumotlarni o'zgartirish", path: '/profile' },
    { Icon: FiLogOut, label: 'Tizimdan chiqish', action: () => setIsLogoutModalOpen(true) },
  ];

  const handleGoBack = () => navigate(-1);
  const handleGoToNotifications = () => navigate('/Notification');
  const handleGoToChats = () => navigate('/chats');

  return (
    <div className='min-h-screen bg-white pb-[80px]'>
      {/* Header */}
      <header className={`bg-[${primaryTeal}] p-4 pb-20 pt-8 rounded-b-[40px] shadow-lg relative`}>
        <div className="flex justify-between items-center mb-6">
          <FaChevronLeft
            className="text-white text-2xl cursor-pointer"
            onClick={handleGoBack}
          />
          {/* <BsChatText
            className="text-white text-2xl cursor-pointer"
            onClick={handleGoToChats}
          /> */}
        </div>

        {isAuthenticated ? (
          // Kirgan foydalanuvchi uchun
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={profileImg}
                alt="Profil rasmi"
                className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-lg"
              />
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <FaRegCommentDots className="text-white text-xs" />
              </div>
            </div>

            <div>
              <h2 className="text-white text-xl md:text-2xl font-bold">
                {user.name}
              </h2>
              <p className="text-white text-sm opacity-90 flex items-center gap-1 mt-1">
                <span>📍</span> Namangan, O'zbekiston
              </p>
            </div>
          </div>
        ) : (
          // Kirmagan foydalanuvchi uchun
          <div className="text-center text-white py-6">
            <h2 className="text-2xl font-bold mb-3">
              Siz hali ro'yxatdan o'tmagansiz
            </h2>
            <p className="text-white/80 mb-6">
              Profil va barcha imkoniyatlardan foydalanish uchun tizimga kiring
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-[#00BCE4] px-8 py-3.5 rounded-2xl font-semibold text-base shadow-lg hover:bg-gray-100 active:scale-95 transition-all"
            >
              Tizimga kirish
            </button>
          </div>
        )}
      </header>

      {/* Asosiy kontent - faqat kirgan foydalanuvchi uchun ko'rinadi */}
      {isAuthenticated && (
        <div className='p-4 pt-0'>
          {/* <div className='relative -mt-10 mb-8'>
            <input
              type="text"
              placeholder="Shifokor yoki klinika qidirish..."
              className="w-full h-12 bg-white rounded-full shadow-md pl-12 pr-12 text-sm focus:outline-none focus:border-blue-600 focus:ring-opacity-50"
            />
            <FaSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400' />

            <FaRegBell
              className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg cursor-pointer'
              onClick={handleGoToNotifications}
            />
          </div> */}

          <ul className="bg-white rounded-xl mt-5 shadow-sm">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`p-4 flex items-center cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition ${index < menuItems.length - 1 ? 'border-b border-gray-100' : ''}`}
                onClick={item.action ? item.action : () => navigate(item.path)}
              >
                <item.Icon className={`text-xl text-[${darkText}] mr-4`} />
                <span className={`text-base text-[${darkText}] font-medium`}>{item.label}</span>
              </li>
            ))}
          </ul>

          <div className='h-8'></div>
        </div>
      )}

      {/* Logout tasdiqlash modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-center text-xl font-bold text-gray-800 mb-6">
              Rostdan ham chiqmoqchimisiz?
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleCancelLogout}
                className="py-3.5 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition"
              >
                Yo'q
              </button>

              <button
                onClick={handleConfirmLogout}
                className="py-3.5 bg-[#00BCE4] text-white font-semibold rounded-xl hover:bg-cyan-600 transition"
              >
                Ha, chiqish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profil_pages;
