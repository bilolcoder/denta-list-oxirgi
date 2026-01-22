import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaChevronLeft,
  FaSearch,
  FaRegBell,
} from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { LuMessageSquareText } from "react-icons/lu";
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://app.dentago.uz/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function Yoqtirishlar() {
  const navigate = useNavigate();
  const [favoriteDoctors, setFavoriteDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Tokenni tekshirish
        const token = localStorage.getItem('accessToken');
        console.log('Token mavjudmi?', !!token);
        if (token) {
          console.log('Token uzunligi:', token.length);
        }

        setDebugInfo(`Token tekshirildi: ${token ? 'Mavjud' : 'Yoq'}`);

        // 2. API so'rovini yuborish
        console.log('API so\'rovi boshlanyapti...');

        // Turli API endpointlarni sinab ko'rish
        let response;

        try {
          // Birinchi variant
          response = await apiClient.get('/favorites');
          console.log('Success with /favorites');
        } catch (firstErr) {
          console.log('/favorites bilan xato:', firstErr.response?.status);

          try {
            // Ikkinchi variant
            response = await apiClient.get('/user/favorites');
            console.log('Success with /user/favorites');
          } catch (secondErr) {
            console.log('/user/favorites bilan xato:', secondErr.response?.status);

            try {
              // Uchinchi variant
              response = await apiClient.get('/favorites/list');
              console.log('Success with /favorites/list');
            } catch (thirdErr) {
              console.log('/favorites/list bilan xato:', thirdErr.response?.status);
              throw firstErr; // Birinchi xatoni chiqaramiz
            }
          }
        }

        // 3. Javobni tekshirish
        console.log('API Response:', response);
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        console.log('Response data:', response.data);

        // 4. Ma'lumotlarni qayta ishlash
        let favorites = [];

        if (response.data) {
          // Turli strukturalar uchun
          if (Array.isArray(response.data)) {
            favorites = response.data;
            setDebugInfo(`Array qabul qilindi: ${favorites.length} ta`);
          } else if (response.data.data && Array.isArray(response.data.data)) {
            favorites = response.data.data;
            setDebugInfo(`data.data qabul qilindi: ${favorites.length} ta`);
          } else if (response.data.favorites && Array.isArray(response.data.favorites)) {
            favorites = response.data.favorites;
            setDebugInfo(`data.favorites qabul qilindi: ${favorites.length} ta`);
          } else if (response.data.doctors && Array.isArray(response.data.doctors)) {
            favorites = response.data.doctors;
            setDebugInfo(`data.doctors qabul qilindi: ${favorites.length} ta`);
          } else {
            console.log('Noma\'lum struktura:', response.data);
            setDebugInfo(`Noma\'lum struktura: ${JSON.stringify(response.data).slice(0, 100)}...`);
          }
        }

        console.log('Favorites array:', favorites);

        // 5. Formatlash
        const formattedDoctors = favorites.map((item, index) => {
          // item doktor ma'lumotlarini o'zida saqlaydi yoki alohida
          const doc = item.doctor || item;

          return {
            id: doc._id || doc.id || `temp-${index}`,
            name: doc.fullName || doc.name || doc.fullname || "Noma'lum shifokor",
            specialty: doc.specialty || doc.specializatsiya || doc.speciality || "== Malumot yo'q ==",
            experience: doc.experienceYears || doc.experience || 0,
            experienceText: doc.experienceYears ? `${doc.experienceYears} yil` : "Ma'lumot yo'q",
            price: doc.price ? `${doc.price.toLocaleString('uz-UZ')} so'm` : "bepul",
            image: doc.avatar || doc.photo || doc.image ||
              `https://via.placeholder.com/320x320/00BCE4/FFFFFF?text=${encodeURIComponent(doc.name?.charAt(0) || 'D')}`,
            rating: doc.rating || 0,
            reviewsCount: doc.reviewsCount || 0,
            raw: doc
          };
        });

        console.log('Formatted doctors:', formattedDoctors);
        setFavoriteDoctors(formattedDoctors);
        setDebugInfo(prev => `${prev} | ${formattedDoctors.length} ta shifokor formatlandi`);

      } catch (err) {
        console.error('To\'liq xato ma\'lumoti:', err);
        console.error('Xato response:', err.response);
        console.error('Xato request:', err.request);

        let errorMessage = 'Ma\'lumotlarni yuklab bo\'lmadi';
        let errorDetails = '';

        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
          console.error('Response headers:', err.response.headers);

          errorDetails = `Status: ${err.response.status}`;

          if (err.response.status === 401) {
            errorMessage = 'Tizimga kirish kerak. Iltimos qayta login qiling.';
            // Token o'chirish va login sahifasiga yo'naltirish
            localStorage.removeItem('accessToken');
            setTimeout(() => navigate('/login'), 2000);
          } else if (err.response.status === 403) {
            errorMessage = 'Ruxsat yo\'q. Profilingizni tekshiring.';
          } else if (err.response.status === 404) {
            errorMessage = 'API endpoint topilmadi';
          } else if (err.response.status === 500) {
            errorMessage = 'Server xatosi';
          }

          if (err.response.data) {
            errorDetails += ` | ${JSON.stringify(err.response.data)}`;
          }
        } else if (err.request) {
          errorMessage = 'Serverga ulanib bo\'lmadi';
          errorDetails = 'Network error';
        } else {
          errorMessage = err.message;
        }

        setError(`${errorMessage} ${errorDetails ? `(${errorDetails})` : ''}`);
        setDebugInfo(`Xato: ${errorMessage}`);
        setFavoriteDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  // Qolgan kod o'zgarishsiz...

  // Qidiruv filtri
  const filteredDoctors = favoriteDoctors.filter(doc =>
    (doc.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.specialty || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Navigatsiya funksiyalari
  const handleGoBack = () => navigate(-1);
  const handleGoToChat = () => navigate('/chats');
  const handleGoToNotifications = () => navigate('/Notification');
  const handleViewProfile = (id) => navigate(`/shifokorlar/${id}`);

  // Har bir shifokor kartasi
  const DoctorCard = ({ doctor }) => {
    const [liked, setLiked] = useState(true);

    const handleUnlike = async () => {
      if (!window.confirm(`${doctor.name} ni yoqtirganlardan olib tashlaysizmi?`)) return;

      try {
        // DELETE so'rovi — endpointni o'zingiznikiga moslashtiring
        await apiClient.delete(`/favorites/${doctor.id}`);

        setLiked(false);
        setFavoriteDoctors(prev => prev.filter(d => d.id !== doctor.id));
      } catch (err) {
        console.error('Unlike qilishda xato:', err);
        alert('O\'chirib bo\'lmadi. Qayta urinib ko\'ring.');
      }
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 relative">
        <div className="w-full h-56 mb-4 overflow-hidden rounded-xl">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://via.placeholder.com/320?text=Doctor"; }}
          />
        </div>

        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{doctor.name}</h3>
            <p className="text-sm text-gray-500">{doctor.specialty}</p>
          </div>

          <button
            onClick={handleUnlike}
            className="text-3xl transition hover:scale-110 active:scale-95"
            disabled={!liked}
          >
            {liked ? (
              <AiFillHeart className="text-red-500" />
            ) : (
              <AiOutlineHeart className="text-gray-300" />
            )}
          </button>
        </div>

        <div className="flex justify-between items-center mb-5 text-sm">
          <div>
            <span className="text-gray-500">Tajriba: </span>
            <span className="font-medium">{doctor.experienceText}</span>
          </div>
          <div className="font-semibold text-gray-800">
            {doctor.price}
          </div>
        </div>

        <button
          onClick={() => handleViewProfile(doctor.id)}
          className="w-full py-3.5 border border-[#00BCE4] text-[#00BCE4] font-medium rounded-xl hover:bg-cyan-50 transition"
        >
          Profilni ko'rish
        </button>
      </div>
    );
  };

  // Asosiy render
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header qismi */}
      <header className="bg-[#00BCE4] p-5 pb-20 rounded-b-3xl shadow-md relative">
        <div className="flex justify-between items-center mb-6">
          <FaChevronLeft className="text-white text-2xl cursor-pointer" onClick={handleGoBack} />
          <LuMessageSquareText className="text-white text-2xl cursor-pointer" onClick={handleGoToChat} />
        </div>

        <h1 className="text-white text-2xl font-bold mb-5">Menga yoqqan shifokorlar</h1>

        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Shifokor yoki mutaxassislik bo'yicha qidirish..."
            className="w-full pl-11 pr-12 py-3.5 bg-white rounded-xl text-sm focus:outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaRegBell
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl cursor-pointer"
            onClick={handleGoToNotifications}
          />
        </div>
      </header>

      {/* Xato xabari */}
      {error && (
        <div className="mx-4 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Yuklanmoqda holati */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#00BCE4] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        /* Hech narsa topilmaganda yoki yoqtirilganlar bo'lmaganda */
        <div className="mx-4 mt-8 bg-white rounded-2xl p-10 text-center shadow-sm">
          <AiOutlineHeart className="mx-auto text-6xl text-gray-300 mb-6" />
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            {searchTerm ? "Hech narsa topilmadi" : "Hozircha yoqtirilgan shifokor yo'q"}
          </h3>
          <button
            onClick={() => navigate('/boshsaxifa')}
            className="mt-4 px-8 py-3 bg-[#00BCE4] text-white rounded-full font-medium hover:bg-cyan-600 transition"
          >
            Shifokorlarni ko'rish
          </button>
        </div>
      ) : (
        /* Shifokorlar ro'yxati */
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDoctors.map(doctor => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Yoqtirishlar;
