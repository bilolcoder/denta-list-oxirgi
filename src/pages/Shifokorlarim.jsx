import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { PiUsersThreeLight } from "react-icons/pi";
import { MdWorkOutline, MdLocationOn, MdOutlineAttachMoney } from "react-icons/md";
import { BsClockHistory } from "react-icons/bs";
import { TbMessageDots } from "react-icons/tb";
import { LuPhone } from "react-icons/lu";
import { IoStarSharp } from "react-icons/io5";

function Shifokorlarim() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State'lar
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('work');
  const [reviews, setReviews] = useState([]);
  const [loadingLike, setLoadingLike] = useState(false);

  // Token va ma'lumotlarni olish
  const token = localStorage.getItem("accessToken");
  const isAuthenticated = !!token;

  // Shifokorni like bosilganligini tekshirish funksiyasi
  const checkIfLiked = async () => {
    try {
      console.log("Checking if doctor is liked...");
      const response = await axios.get(`https://app.dentago.uz/api/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Favorites API response:", response.data);

      // Response strukturasi: { success: true, data: [...] }
      const favorites = response.data.data || [];

      console.log("Current favorites:", favorites);
      console.log("Current doctor id:", id);

      // Har bir favorite object'ni tekshirish
      const isDoctorInFavorites = favorites.some(fav => {
        console.log("Checking favorite item:", fav);
        // Har xil strukturalar uchun tekshirish
        return (
          fav.doctor?._id === id ||
          fav.doctorId === id ||
          fav._id === id ||
          (fav.doctor && fav.doctor.id === id)
        );
      });

      console.log("Is doctor in favorites?", isDoctorInFavorites);
      setIsLiked(isDoctorInFavorites);

    } catch (error) {
      console.error("Favoritelarni tekshirishda xato:", error);
      // Agar 401 xatolik bo'lsa, token noto'g'ri yoki muddati o'tgan
      if (error.response?.status === 401) {
        console.log("Token expired or invalid");
        setIsLiked(false);
      }
    }
  };

  // API dan shifokor ma'lumotlarini olish
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`https://app.dentago.uz/api/public/doctors/${id}`);
        const result = response.data;

        if (result.success === false) {
          throw new Error("API dan ma'lumot olishda xato");
        }

        setDoctor(result.data);
      } catch (err) {
        console.error("API xatosi:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  // Foydalanuvchi tizimga kirgan bo'lsa, shifokorni like bosilganligini tekshirish
  useEffect(() => {
    if (isAuthenticated) {
      checkIfLiked();
    } else {
      // Agar foydalanuvchi tizimga kirmagan bo'lsa, like holatini false qilish
      setIsLiked(false);
    }
  }, [isAuthenticated, id, token]); // id va token dependency'larini qo'shdim

  // Like tugmasini bosganda
  const handleToggleLike = async () => {
    // Agar foydalanuvchi tizimga kirmagan bo'lsa
    if (!isAuthenticated) {
      const confirmLogin = window.confirm("Shifokorni sevimlilarga qo'shish uchun tizimga kiring. Hozir kirishni xohlaysizmi?");
      if (confirmLogin) {
        navigate("/login", { state: { returnUrl: `/doctor/${id}` } });
      }
      return;
    }

    try {
      setLoadingLike(true);

      if (isLiked) {
        // Like ni o'chirish - DELETE request
        await axios.delete(`https://app.dentago.uz/api/favorites/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setIsLiked(false);
        console.log("Shifokor sevimlilardan olib tashlandi");
      } else {
        // Like qo'shish - POST request
        await axios.post(`https://app.dentago.uz/api/favorites/${id}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setIsLiked(true);
        console.log("Shifokor sevimlilarga qo'shildi");
      }
    } catch (error) {
      console.error("Like operatsiyasida xato:", error);

      // Xato xabarini chiqarish
      if (error.response) {
        const errorMessage = error.response.data?.message || "Xatolik yuz berdi";

        if (error.response.status === 401) {
          // Token noto'g'ri yoki muddati o'tgan
          localStorage.removeItem("accessToken");
          alert("Sessiya muddati tugagan. Iltimos, qaytadan tizimga kiring.");
          navigate("/login");
        } else {
          alert(errorMessage);
        }
      } else {
        alert("Server bilan bog'lanishda xatolik. Iltimos, internet aloqangizni tekshiring.");
      }

      // Xato bo'lsa, holatni o'zgartirmaymiz
      setIsLiked(!isLiked);
    } finally {
      setLoadingLike(false);
    }
  };

  // Yulduzchalarni chiqarish
  const renderStars = (count) => {
    const rating = typeof count === "number" ? count : parseFloat(count) || 4.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      stars.push(
        <IoStarSharp
          key={i}
          className={`text-base ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
        />
      );
    }
    return <div className="flex space-x-0.5">{stars}</div>;
  };

  const handleBack = () => navigate(-1);

  const handleQabul = () => {
    if (!isAuthenticated) {
      const confirmLogin = window.confirm("Qabulga yozilish uchun tizimga kiring. Hozir kirishni xohlaysizmi?");
      if (confirmLogin) {
        navigate("/login", { state: { returnUrl: `/doctor/${id}` } });
      }
      return;
    }

    navigate("/qabulgayozilish", {
      state: { doctorId: id, doctor },
    });
  };

  const handleChat = () => {
    if (!isAuthenticated) {
      const confirmLogin = window.confirm("Chat uchun tizimga kiring. Hozir kirishni xohlaysizmi?");
      if (confirmLogin) {
        navigate("/login", { state: { returnUrl: `/doctor/${id}` } });
      }
      return;
    }

    navigate(`/chat/${id}`, { state: { doctorName: doctor?.fullName } });
  };

  // Telefon qilish funksiyasi
  const handleCall = () => {
    const phoneNumber = doctor?.phone || doctor?.phoneNumber;

    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      alert("Shifokorning telefon raqami topilmadi");
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600 text-lg">Shifokor ma'lumotlari yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Xatolik yuz berdi</h1>
        <p className="text-gray-600 mb-6 text-center">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
        >
          Qayta urinish
        </button>
        <button
          onClick={handleBack}
          className="mt-3 bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition"
        >
          Orqaga qaytish
        </button>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Shifokor topilmadi</h1>
        <button
          onClick={handleBack}
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
        >
          Orqaga qaytish
        </button>
      </div>
    );
  }

  const formatPrice = (price) => {
    if (!price) return "Narx mavjud emas";
    return `${parseInt(price).toLocaleString("ru-RU")} so'm`;
  };

  const getWorkTime = () => {
    if (doctor.isAvailable24x7) return "24/7 ochiq";
    if (doctor.workTime) return `${doctor.workTime.start} dan ${doctor.workTime.end} gacha`;
    return "9:00 dan 18:00 gacha";
  };

  return (
    <div className="w-full mx-auto mb-[40px] bg-white min-h-screen pb-32">
      {/* Sarlavha qismi */}
      <div className="relative bg-[#00C1F3] text-white py-5 pb-10 md:p-10 sm:p-7 max-sm:p-5 md:pb-14 rounded-b-[35px] shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <button onClick={handleBack} className="text-2xl md:text-3xl hover:opacity-80 transition">
            <HiOutlineArrowLeft />
          </button>

          <button
            onClick={handleToggleLike}
            disabled={loadingLike}
            className="text-2xl md:text-3xl hover:opacity-80 transition disabled:opacity-50"
          >
            {loadingLike ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isLiked ? (
              <AiFillHeart className="text-red-500" />
            ) : (
              <AiOutlineHeart className="text-white" />
            )}
          </button>
        </div>

        <div className="flex md:flex-row md:items-center gap-6">
          <div className="flex-shrink-0">
            <img
              src={doctor.avatar || " "}
              alt={doctor.fullName}
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white object-cover shadow-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl max-sm:text-sm font-bold mb-2">{doctor.fullName}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-lg md:text-xl max-sm:text-sm opacity-90">{doctor.specialty}</span>
            </div>

            {doctor.clinic?.name && <p className="text-lg max-sm:text-sm opacity-80">{doctor.clinic.name}</p>}
          </div>
        </div>
      </div>

      {/* Statistikalar */}
      <div className="bg-white grid lg:grid-cols-[2fr_1fr] md:grid-cols-[2fr_1fr] sm:grid-cols-[2fr_1fr] max-sm:grid-cols-1 mx-5 md:mx-10 -mt-4 rounded-2xl shadow-lg px-5 pt-7 pb-5 border border-gray-100">
        <div className="grid sm:grid-cols-2 max-sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <MdWorkOutline className="text-2xl text-blue-500" />
              <span className="text-lg font-semibold text-gray-800">{doctor.experienceYears || "0"}</span>
            </div>
            <p className="text-sm text-gray-600">Yil tajriba</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <BsClockHistory className="text-2xl text-blue-500" />
              <span className="text-lg font-semibold text-gray-800">
                {doctor.isAvailable24x7 ? "24/7" : "9-18"}
              </span>
            </div>
            <p className="text-sm text-gray-600">Ish vaqti</p>
          </div>

        </div>
          <div className="text-center max-sm:mt-5">
            <div className="flex items-center justify-center gap-2 mb-1">
              <MdOutlineAttachMoney className="text-2xl text-blue-500" />
              <span className="text-lg font-semibold text-gray-800">{formatPrice(doctor.price)}</span>
            </div>
            <p className="text-sm text-gray-600">O'rtacha narx</p>
          </div>
      </div>

      {/* Batafsil ma'lumotlar */}
      <div className="px-5 md:px-10 mt-8 space-y-6">
        {doctor.clinic?.address && (
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
            <MdLocationOn className="text-2xl text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Manzil</h3>
              <p className="text-gray-600">{doctor.clinic.address}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
          <BsClockHistory className="text-2xl text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Ish vaqti</h3>
            <p className="text-gray-600">{getWorkTime()}</p>
          </div>
        </div>
      </div>

      {/* Tablar */}
      {activeTab === "work" ? (
  <div className="px-5 md:px-10 py-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4">
    {doctor?.gallery?.length > 0 ? (
      doctor.gallery.map((url, index) => (
        <div
          key={index}
          className="aspect-square rounded-xl overflow-hidden bg-gray-100"
        >
          <img
            src={url}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300?text=";
              e.target.alt = "Rasm yuklanmadi";
            }}
          />
        </div>
      ))
    ) : (
      <div className="col-span-full text-center py-16 text-gray-500">
        Hozircha yuklangan rasmlar yo‘q
      </div>
    )}
  </div>
) : (
  <div className="text-center py-16 text-gray-500">
    Hozircha sharhlar mavjud emas
  </div>
)}

      {/* Pastki fixed menyusi */}
      <div className="px-5 md:px-8 lg:px-10 py-3 w-full mt-5 bg-white fixed bottom-[70px] left-0 flex items-center justify-between shadow-2xl border-t border-gray-100 z-50">
        <button
          onClick={handleQabul}
          className="flex-1 w-full bg-[#00C1F3] text-white py-3 rounded-2xl font-medium text-[15px] md:text-base transition hover:opacity-90 shadow-md"
        >
          {isAuthenticated ? "Qabulga yozilish" : "Qabulga yozilish uchun tizimga kiring"}
        </button>

        {/* Telefon tugmasi */}
        <button
          onClick={handleCall}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#00cf56] flex items-center justify-center ml-3 cursor-pointer hover:bg-[#00b34a] transition shadow-lg"
        >
          <LuPhone className="text-2xl md:text-3xl text-white" />
        </button>
      </div>
    </div>
  );
}

export default Shifokorlarim;
