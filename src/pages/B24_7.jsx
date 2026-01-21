import React, { useState } from "react";
import { TbMessage } from "react-icons/tb";
import { HiLocationMarker, HiOutlineChatAlt2 } from "react-icons/hi"; // HiOutlineChatAlt2 import qilindi
import { FiSearch } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { SlCursor } from "react-icons/sl";
import { CiStar } from "react-icons/ci";

import Denta1 from "../assets/denta1.jpg";
import Denta2 from "../assets/denta2.jpg";
import Denta3 from "../assets/denta3.jpg";
import Denta4 from "../assets/denta4.jpg";
import Denta5 from "../assets/denta5.png";
import DoctorCard from "./DoctorCard";
import { useNavigate } from 'react-router-dom';

function Boshsaxifa() {
  const navigate = useNavigate();

  // --- QIDIRUV STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  // ---------------------

  // Faol filter (boshida "Barchasi" faol)
  const [activeFilter, setActiveFilter] = useState("barchasi");

  const handleFilterClick = (filterKey, route) => {
    setActiveFilter(filterKey);
    if (route) {
      navigate(route);
    }
  };

  const notification = () => {
    navigate("/Notification")
  }

  const goToChats = () => {
    navigate("/chats");
  }

  // Doctorlar ma'lumotlari
  const doctors = [
    { id: 2, img: Denta1, name: "Dr. Jamshid Rahmonov", job: "Ortoped", rating: "4.9", distance: "5 km", price: "250 000", patients: "254", exp: "12", service: true },
    { id: 4, img: Denta3, name: "Dr. Asadbek Luqmonov", job: "Jarroh", rating: "3.9", distance: "2.5 km", price: "250 000", patients: "254", exp: "12", service: false },
    { id: 5, img: Denta4, name: "Dr. Lobar Azizova", job: "Implantolog", rating: "3.7", distance: "3 km", price: "255 000", patients: "120", exp: "10", service: true },
    { id: 1, img: Denta5, name: "Dr. Omontayev Xayotillo", job: "Terapet", rating: "5", distance: "2 km", price: "350 000", patients: "200", exp: "3", service: true },
    { id: 3, img: Denta2, name: "Dr. O‘tkir Rustamov", job: "Terapevt", rating: "4.9", distance: "4 km", price: "255 000", patients: "124", exp: "10", service: false },
  ];

  // --- QIDIRUV LOGIKASI ---
  const filteredDoctors = doctors.filter(doctor =>
    // Ismning qidiruv matnini o'z ichiga olganligini tekshiradi (katta-kichik harflarni hisobga olmagan holda)
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // -------------------------


  return (
    <div className="w-full mx-auto bg-white mb-[60px] overflow-hidden">
      {/* Header qismi */}
      <div className="bg-[#00C1F3] md:px-10 xl:px-[100px] lg:px-[70px] p-5 rounded-b-[30px] relative">
        <div className="flex justify-between items-center">
          <button
            onClick={goToChats}
            className="relative text-white hover:opacity-80 transition"
          >
            {/* Chat ikonka o'rniga HiOutlineChatAlt2 ishlatildi */}
            <HiOutlineChatAlt2 className="text-3xl" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </button>
        </div>

        <div className="text-white mt-8">
          <h1 className="text-lg md:text-2xl font-semibold flex items-center gap-1">
            Salom Azamat
          </h1>
          <p className="flex items-center gap-1 text-white/80 text-sm mt-1">
            <HiLocationMarker /> Namangan, O’zbekiston
          </p>
        </div>
        <div className="mt-4 relative flex items-center justify-center">
          {/* QIDIRUV INPUT MAYDONI - O'ZGARTIRILDI */}
          <input
            type="text"
            placeholder="Shifokor yoki klinika qidirish..."
            value={searchTerm} // State bilan bog'lash
            onChange={(e) => setSearchTerm(e.target.value)} // Matn kiritilishini boshqarish
            className="w-full py-3 pl-10 pr-12 outline-0 rounded-4xl bg-white text-sm md:text-base shadow-[0px_0px_4px_0px_rgba(0,0,0,0.2)]"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />

          <IoNotificationsOutline
            className="text-white ml-5 text-3xl"
            onClick={notification}
          />
        </div>
      </div>

      {/* Filterlar */}
      <div className="mb-3 md:px-10 lg:px-[70px] xl:px-[100px]">
        <div className="flex flex-wrap gap-2.5 mt-4 px-1 py-1 overflow-x-auto sm:overflow-visible whitespace-nowrap sm:whitespace-normal">

          {/* Barchasi filtri (Active rang o'zgartirildi) */}
          <div
            onClick={() => handleFilterClick("barchasi", "/boshsaxifa")}
            className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-[12px] sm:text-[14px] font-medium cursor-pointer transition-all ${
              activeFilter === "barchasi"
                ? "bg-gray-200 text-black"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Barchasi
          </div>

          {/* Ayol doktori */}
          <div
            onClick={() => handleFilterClick("ayol", "/AyolDoktor")}
            className={`px-4 py-2 rounded-2xl text-[12px] sm:text-[14px] font-medium cursor-pointer transition-all ${
              activeFilter === "ayol"
                ? "bg-[#0dc3ec] text-white"
                : "bg-[#ea11b0a1] text-white hover:bg-gray-300"
            }`}
          >
            Ayol doktori
          </div>

          {/* 24/7 */}
          <div
            onClick={() => handleFilterClick("24_7", "/B24_7")}
            className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-[12px] sm:text-[14px] font-medium cursor-pointer transition-all ${
              activeFilter === "24_7"
                ? "bg-[#BDF3FF] text-black"
                : "bg-[#BDF3FF] text-black hover:bg-gray-300"
            }`}
          >
            <FaRegClock className="text-lg" /> 24/7 ishlaydigan
          </div>

          {/* Eng yaqin */}
          <div
            onClick={() => handleFilterClick("yaqin", "/EngYaqin")}
            className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-[12px] sm:text-[14px] font-medium cursor-pointer transition-all ${
              activeFilter === "yaqin"
                ? "bg-[#BDF3FF] text-black"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <SlCursor className="text-lg" /> Eng yaqin
          </div>

          {/* Eng yaxshi */}
          <div
            onClick={() => handleFilterClick("yaxshi", "/EngYaxshi")}
            className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-[12px] sm:text-[14px] font-medium cursor-pointer transition-all ${
              activeFilter === "yaxshi"
                ? "bg-[#BDF3FF] text-black"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <CiStar className="text-lg" /> Eng yaxshi
          </div>

          {/* Bolalar doktori */}
          <div
            onClick={() => handleFilterClick("bola", "/BolalarDoktori")}
            className={`px-4 py-2 rounded-2xl text-[12px] sm:text-[14px] font-medium cursor-pointer transition-all ${
              activeFilter === "bola"
                ? "bg-[#BDF3FF] text-black"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Bolalar doktori
          </div>

        </div>
      </div>

      {/* Doktorlar ro'yxati */}
      <div className="md:px-10 lg:px-[70px] px-2 mb-5 xl:px-[100px]">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4">
          Hozirda mavjud mutaxassislar
        </h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">

          {/* filteredDoctors ro'yxatini map qilish */}
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              id={doctor.id}
              img={doctor.img}
              name={doctor.name}
              job={doctor.job}
              rating={doctor.rating}
              distance={doctor.distance}
              price={doctor.price}
              patients={doctor.patients}
              exp={doctor.exp}
              service={doctor.service}
            />
          ))}

          {/* Agar hech qanday shifokor topilmasa xabar */}
          {filteredDoctors.length === 0 && (
              <p className="text-center text-lg text-gray-500 mt-10 col-span-full">
                  "{searchTerm}" ismida shifokor topilmadi.
              </p>
          )}

        </div>
      </div>
    </div>
  );
}

export default Boshsaxifa;
