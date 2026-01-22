import React, { useState, useEffect, useCallback } from "react";
import { HiLocationMarker, HiOutlineChatAlt2 } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { SlCursor } from "react-icons/sl";
import { CiStar } from "react-icons/ci";
import DoctorCard from "./DoctorCard";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Boshsaxifa() {
  const navigate = useNavigate();

  const [allDoctors, setAllDoctors] = useState([]);
  const [displayedDoctors, setDisplayedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("barchasi");
  const [userName, setUserName] = useState("mehmon");

  // Foydalanuvchi nomini olish uchun localStorage'dan
  useEffect(() => {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        if (userData?.name && userData.name.trim() !== '') {
          setUserName(userData.name.trim());
        }
      } catch (e) {
        console.error("userData parse xatosi:", e);
      }
    }
  }, []);

  const formatDoctor = useCallback((doctor) => {
    let gender = "male";
    const fullName = doctor.fullName || "";
    if (
      fullName.toLowerCase().includes("ova") ||
      fullName.toLowerCase().includes("eva") ||
      fullName.toLowerCase().includes("aya") ||
      fullName.toLowerCase().includes("iya") ||
      fullName.toLowerCase().includes("oy") ||
      fullName.toLowerCase().includes("qiz") ||
      fullName.toLowerCase().includes("xon")
    ) {
      gender = "female";
    }

    if (doctor.gender) {
      gender = doctor.gender.toLowerCase();
    }

    return {
      id: doctor._id || doctor.id,
      img: doctor.avatar || doctor.img || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop",
      name: doctor.fullName || doctor.name,
      job: doctor.specialty || doctor.job,
      rating: doctor.rating || 0,
      distance: doctor.clinic?.distanceKm || doctor.distance || 0,
      price: doctor.price || 0,
      patients: doctor.patientsCount || doctor.patients || 0,
      exp: doctor.experienceYears || doctor.exp || 0,
      service: doctor.isAvailable24x7 || doctor.service || false,
      clinic: doctor.clinic?.name,
      address: doctor.clinic?.address,
      workTime: doctor.workTime,
      gender,
      specialty: doctor.specialty || doctor.job || ""
    };
  }, []);

  // Endi faqat bitta sahifa yuklaymiz (limit=100 yoki serverdan qancha qaytsa) shuning uchun pagination kerak emas
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Limitni kattaroq qilish mumkin, masalan 100 yoki serverda cheklov bo'lmasa
      const { data } = await axios.get(`https://app.dentago.uz/api/public/doctors?page=1&limit=100&sort=-rating`);
      if (!data.data) {
        throw new Error("API javobi to'g'ri formatda emas");
      }
      const formattedDoctors = data.data.map(formatDoctor);
      setAllDoctors(formattedDoctors);
      setDisplayedDoctors(formattedDoctors);
    } catch (err) {
      console.error("API xatosi:", err);
      setError(`Ma'lumotlarni yuklashda xato: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [formatDoctor]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Filtrlash
  useEffect(() => {
    if (allDoctors.length === 0) return;

    let filtered = [...allDoctors];

    switch (activeFilter) {
      case "ayol":
        filtered = filtered.filter(doctor => doctor.gender === "female");
        break;
      case "24_7":
        filtered = filtered.filter(doctor => doctor.service === true);
        break;
      case "yaxshi":
        filtered = filtered.filter(doctor => Number(doctor.rating) >= 4.0);
        break;
      case "bola":
        filtered = filtered.filter(doctor => {
          const text = (doctor.specialty + " " + (doctor.job || "")).toLowerCase();
          return (
            text.includes("bolalar stomatologi") ||
            text.includes("pediatr") ||
            text.includes("bola")
          );
        });
        break;
      default:
        break;
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchLower) ||
        (doctor.job || "").toLowerCase().includes(searchLower) ||
        (doctor.specialty || "").toLowerCase().includes(searchLower) ||
        (doctor.clinic || "").toLowerCase().includes(searchLower)
      );
    }

    setDisplayedDoctors(filtered);
  }, [activeFilter, searchTerm, allDoctors]);

  const handleFilterClick = (filterKey) => {
    if (filterKey === "yaqin") {
      navigate("/EngYaqin");
      return;
    }
    setActiveFilter(filterKey);
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const goToChats = () => navigate("/chats");
  const notification = () => navigate("/Notification");

  return (
    <div className="w-full mx-auto bg-white mb-[60px] overflow-hidden">
      {/* Header qismi */}
      <div className="bg-[#00C1F3] md:px-10 xl:px-[100px] lg:px-[70px] p-5 rounded-b-[30px] relative">
        {/* <div className="flex justify-between items-center">
          <button onClick={goToChats} className="relative text-white hover:opacity-80 transition">
            <HiOutlineChatAlt2 className="text-3xl" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </button>
        </div> */}

        <div className="text-white mt-8">
          <h1 className="text-lg md:text-2xl font-semibold flex items-center gap-1">
            Salom, {userName}!
          </h1>
          <p className="flex items-center gap-1 text-white/80 text-sm mt-1">
            <HiLocationMarker /> Namangan, O'zbekiston
          </p>
        </div>

        <div className="mt-4 relative flex items-center justify-center">
          <input
            type="text"
            placeholder="Shifokor, klinika yoki mutaxassislik qidirish..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full py-3 pl-10 pr-12 outline-0 rounded-4xl bg-white text-sm md:text-base shadow-[0px_0px_4px_0px_rgba(0,0,0,0.2)]"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
          <IoNotificationsOutline
            className="text-white ml-5 text-3xl cursor-pointer hover:opacity-80"
            onClick={notification}
          />
        </div>
      </div>

      {/* Filterlar */}
      <div className="mb-3 md:px-10 lg:px-[70px] xl:px-[100px]">
        <div className="flex flex-wrap gap-2.5 mt-4 px-1 py-1 overflow-x-auto">
          <button
            onClick={() => handleFilterClick("barchasi")}
            className={`px-4 py-2 rounded-2xl text-[12px] sm:text-[14px] font-medium cursor-pointer transition-all ${activeFilter === "barchasi" ? "bg-[#BDF3FF] text-black" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            Barchasi
          </button>

          <button
            onClick={() => handleFilterClick("ayol")}
            className={`px-4 py-2 rounded-2xl text-[12px] sm:text-[14px] font-medium cursor-pointer transition-all ${activeFilter === "ayol" ? "bg-[#0dc3ec] text-white" : "bg-[#ea11b0a1] text-white hover:bg-pink-400"}`}
          >
            Ayol doktori
          </button>

          <button
            onClick={() => handleFilterClick("24_7")}
            className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-[12px] sm:text-[14px] font-medium cursor-pointer transition-all ${activeFilter === "24_7" ? "bg-[#BDF3FF] text-black" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            <FaRegClock className="text-lg" /> 24/7 ishlaydigan
          </button>

          <button
            onClick={() => handleFilterClick("yaqin")}
            className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-[12px] sm:text-[14px] font-medium cursor-pointer transition-all ${activeFilter === "yaqin" ? "bg-[#BDF3FF] text-black" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            <SlCursor className="text-lg" /> Eng yaqin
          </button>

          <button
            onClick={() => handleFilterClick("yaxshi")}
            className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-[12px] sm:text-[14px] font-medium cursor-pointer transition-all ${activeFilter === "yaxshi" ? "bg-[#BDF3FF] text-black" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            <CiStar className="text-lg" /> Eng yaxshi
          </button>

          <button
            onClick={() => handleFilterClick("bola")}
            className={`px-4 py-2 rounded-2xl text-[12px] sm:text-[14px] font-medium cursor-pointer transition-all ${activeFilter === "bola" ? "bg-[#BDF3FF] text-black" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            Bolalar doktori
          </button>
        </div>
      </div>

      {/* Doktorlar ro'yxati */}
      <div className="md:px-10 lg:px-[70px] px-2 mb-5 xl:px-[100px]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-semibold">
            {activeFilter === "barchasi" ? "Hozirda mavjud mutaxassislar" :
              activeFilter === "ayol" ? "Ayol doktorlar" :
                activeFilter === "24_7" ? "24/7 ishlaydigan doktorlar" :
                  activeFilter === "yaxshi" ? "Eng yaxshi reytingdagi doktorlar" :
                    activeFilter === "bola" ? "Bolalar doktorlari" : "Mutaxassislar"}
          </h1>
          {allDoctors.length > 0 && (
            <div className="text-gray-600 text-sm">
              Jami: {allDoctors.length} ta doktor
            </div>
          )}
        </div>

        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex items-center">
              <div className="text-yellow-400 mr-3">⚠️</div>
              <div>
                <p className="text-yellow-700">{error}</p>
                <p className="text-yellow-600 text-sm mt-1">Xatolik yuz berdi</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-1 max-sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-gray-100 rounded-2xl overflow-hidden animate-pulse">
                <div className="w-full h-[120px] bg-gray-300"></div>
                <div className="p-2">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : displayedDoctors.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 max-sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedDoctors.map(doctor => (
              <DoctorCard
                key={doctor.id}
                id={doctor.id}
                img={doctor.img}
                name={doctor.name}
                job={doctor.job}
                rating={doctor.rating.toString()}
                distance={doctor.distance + " km"}
                price={doctor.price.toLocaleString("ru-RU") + " so'm"}
                patients={doctor.patients.toString()}
                exp={doctor.exp.toString()}
                service={doctor.service}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="text-gray-400 text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700">
              Hech narsa topilmadi
            </h3>
            <p className="text-gray-500 mt-2">
              {searchTerm
                ? `"${searchTerm}" bo'yicha natija topilmadi`
                : "Bu filter bo'yicha doktorlar mavjud emas"}
            </p>
            <button
              onClick={() => {
                setActiveFilter("barchasi");
                setSearchTerm("");
              }}
              className="mt-4 px-4 py-2 bg-[#00C1F3] text-white rounded-lg hover:bg-[#00a8d9] transition"
            >
              Barcha doktorlarni ko'rish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Boshsaxifa;
