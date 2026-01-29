import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaRegCommentDots } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import { BsChatText } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import profileImgDefault from "../assets/denta1.jpg"; // fallback rasm

function Profil_pages() {
  const navigate = useNavigate();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const primaryTeal = '#00BCE4';
  const darkText = '#272937';

  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    const storedImage = localStorage.getItem('userProfileImage'); // yangi qo'shilgan

    let profileData = null;
    let profileImage = profileImgDefault; // default rasm

    // Rasmni olish
    if (storedImage) {
      profileImage = storedImage; // base64 yoki URL
    }

    // User ma'lumotlari
    if (storedProfile) {
      try {
        profileData = JSON.parse(storedProfile);
      } catch (e) {
        console.error("userProfile parse xatosi:", e);
      }
    }

    // Eski formatdan fallback
    if (!profileData) {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const oldData = JSON.parse(storedUserData);
          profileData = {
            username: oldData.name || '',
            phone: oldData.phone || ''
          };
        } catch (e) {
          console.error("userData parse xatosi:", e);
        }
      }
    }

    if (profileData?.username?.trim()) {
      setUser({
        name: profileData.username.trim(),
        phone: profileData.phone || '+998 ...',
        profileImage: profileImage // rasm qo'shildi
      });
    }
  }, []);

  const isAuthenticated = !!user;

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userProfileImage'); // rasm ham tozalanadi
    navigate('/login');
  };

  const handleCancelLogout = () => setIsLogoutModalOpen(false);

  const menuItems = [
    { Icon: BsChatText, label: 'Sharhlar', path: '/sharhlar' },
    { Icon: MdOutlineModeEdit, label: "Ma'lumotlarni o'zgartirish", path: '/profile' },
    { Icon: FiLogOut, label: 'Tizimdan chiqish', action: () => setIsLogoutModalOpen(true) },
  ];

  return (
    <div className='min-h-screen bg-white pb-[80px]'>
      <header className={`bg-[${primaryTeal}] p-4 pb-20 pt-8 rounded-b-[40px] shadow-lg relative`}>
        <div className="flex justify-between items-center mb-6">
          <FaChevronLeft
            className="text-white text-2xl cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </div>

        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src=""           // ← BU YERDA YANGI RASM ISHLATILADI
                alt=""
                className="w-20 h-20 rounded-full border-4 bg-amber-50 border-white object-cover shadow-lg"
              />
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <FaRegCommentDots className="text-white text-xs" />
              </div>
            </div>

            <div>
              <h2 className="text-white text-xl md:text-2xl font-bold">
                {user.name || 'Foydalanuvchi'}
              </h2>
              <p className="text-white text-sm opacity-90 flex items-center gap-1 mt-1">
                <span>📞</span> {user.phone || '+998 ...'}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center text-white py-6">
            <h2 className="text-2xl font-bold mb-3">Siz hali ro'yxatdan o'tmagansiz</h2>
            <p className="text-white/80 mb-6">Profil va barcha imkoniyatlardan foydalanish uchun tizimga kiring</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-[#00BCE4] px-8 py-3.5 rounded-2xl font-semibold text-base shadow-lg hover:bg-gray-100 active:scale-95 transition-all"
            >
              Tizimga kirish
            </button>
          </div>
        )}
      </header>

      {isAuthenticated && (
        <div className='p-4 pt-0'>
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