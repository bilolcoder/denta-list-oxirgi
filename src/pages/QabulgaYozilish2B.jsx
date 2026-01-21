import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoArrowBack, IoTime } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";

function QabulgaYozilishVaqt() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    doctorId,
    doctor,
    appointmentDate,
    selectedDay,
    selectedMonth: selectedMonthName,
    selectedYear
  } = location.state || {};

  const [selectedTime, setSelectedTime] = useState("");
  const [note, setNote] = useState('');

  // Agar kerak bo'lsa, bu yerni o'zgartirib, real band bo'lmagan vaqtlarni ko'rsatish mumkin
  const availableTimeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00","18:30","19:00", "19:30","20:00", "20:30","21:00", "21:30","22:00", "22:30","23:00", "23:30","00:00"
  ];

  if (!doctor || !doctorId || !appointmentDate) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4 text-red-500">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Ma'lumotlar yetarli emas</h2>
          <p className="text-gray-600 mb-6">Iltimos, qabul jarayonini boshidan boshlang.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-cyan-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-cyan-600 transition"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    );
  }

  const getFullAppointmentDateTime = () => {
    if (!selectedTime) return null;

    const baseDate = new Date(appointmentDate);
    const [hours, minutes] = selectedTime.split(":").map(Number);

    baseDate.setHours(hours, minutes, 0, 0);

    return baseDate.toISOString();
  };

  const handleNext = () => {
    if (!selectedTime) {
      alert("Iltimos, vaqtni tanlang!");
      return;
    }

    const fullDateTime = getFullAppointmentDateTime();

    navigate("/patient-form", {
      state: {
        doctorId,
        doctor,
        appointmentDate: fullDateTime,
        appointmentTime: selectedTime,
        note: note.trim(),
        selectedDay,
        selectedMonthName,
        selectedYear
      }
    });
  };

  return (
    <div className="min-h-screen mb-[60px] bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-400 to-cyan-600 text-white px-5 py-6 rounded-b-3xl shadow-lg">
        <button onClick={() => navigate(-1)} className="text-4xl mb-4">←</button>
        <h1 className="text-2xl font-bold">Qabulga yozilish</h1>
        <div className="flex gap-2 mt-6">
          <div className="h-2 flex-1 bg-white rounded-full"></div>
          <div className="h-2 flex-1 bg-white rounded-full"></div>
          <div className="h-2 flex-1 bg-white/40 rounded-full"></div>
        </div>
        <p className="text-white/80 text-sm mt-2">2-qadam: Vaqtni tanlang</p>
      </div>

      <div className="p-5 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">

            {/* Shifokor kartasi */}
            <div>
              <h2 className="text-2xl font-bold mb-5 text-gray-800">Shifokor</h2>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                <div className="relative md:w-1/3">
                  <img
                    src={doctor.avatar || ""}
                    alt={doctor.fullName}
                    className="w-full h-64 md:h-full object-cover"
                    onError={(e) => (e.target.src = "")}
                  />
                  {doctor.isAvailable24x7 && (
                    <span className="absolute bottom-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      24/7
                    </span>
                  )}
                </div>

                <div className="p-6 md:w-2/3">
                  <h3 className="text-2xl font-bold text-gray-900">{doctor.fullName}</h3>
                  <p className="text-gray-600 text-lg mt-1">{doctor.specialty}</p>

                  <div className="flex items-center gap-3 mt-4">
                    {/* <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                      <FaStar className="text-yellow-500" />
                      <span className="font-semibold">{doctor.rating || "4.5"}</span>
                    </div> */}
                    <span className="text-gray-500">{doctor.clinic?.name || "Klinika"}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mt-5 text-gray-700">
                    {/* <div>
                      <p className="text-sm text-gray-500">Bemorlar soni</p>
                      <p className="font-semibold">{doctor.patientsCount || 0} ta</p>
                    </div> */}
                    <div>
                      <p className="text-sm text-gray-500">Tajriba</p>
                      <p className="font-semibold">{doctor.experienceYears || 0}+ yil</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-gray-200">
                    <p className="text-2xl font-bold text-cyan-600">
                      {doctor.price ? `${parseInt(doctor.price).toLocaleString('ru-RU')} so'm` : "Narx mavjud emas"}
                    </p>
                    <p className="text-sm text-gray-500">O'rtacha qabul narxi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vaqt tanlash — YANGI VERSIYA */}
            <div>
              <h2 className="text-2xl font-bold mb-5 text-gray-800">Qabul vaqti</h2>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <label className="block text-gray-700 font-medium mb-4">
                  Mavjud vaqtlar (tanlang)
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {availableTimeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`
                        py-3 px-4 rounded-xl text-center font-medium transition-all
                        border-2
                        ${selectedTime === time
                          ? "bg-cyan-600 text-white border-cyan-600 shadow-md"
                          : "bg-white text-gray-700 border-gray-300 hover:border-cyan-400 hover:bg-cyan-50"
                        }
                      `}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                <p className="text-sm text-gray-500 mt-5 flex items-center gap-2">
                  <IoTime className="text-cyan-600 text-xl" />
                  Qabulga 15 daqiqa oldin kelishingizni tavsiya qilamiz
                </p>
              </div>
            </div>
          </div>

          {/* O'ng qism */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">Qo'shimcha izoh</h2>
              <textarea
                placeholder="Shikoyatingiz, allergiya, kasallik tarixi haqida yozing..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
                className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">Izoh ixtiyoriy, lekin shifokorga yordam beradi</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
              <h3 className="font-bold text-cyan-800 mb-4">Tanlangan ma'lumotlar</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiCalendar className="text-cyan-600 text-xl" />
                  <div className="flex">
                    <p className="font-bold text-gray-600">Sana:</p>
                    <p className="font-bold text-gray-900 ml-2">
                      {selectedDay} {selectedMonthName} {selectedYear}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <IoTime className="text-green-600 text-xl" />
                  <div className="flex">
                    <p className="font-bold text-gray-700 text-lg">Vaqt:</p>
                    <p className="font-bold text-green-700 text-lg ml-2">
                      {selectedTime || "Tanlanmagan"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-cyan-300">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Shifokor:</span> {doctor.fullName}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Mutaxassislik:</span> {doctor.specialty}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="w-full py-4 bg-white border-2 border-cyan-500 text-cyan-600 font-bold rounded-2xl hover:bg-cyan-50 transition"
              >
                Orqaga
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedTime}
                className={`
                  w-full py-4 rounded-2xl font-bold text-white text-lg shadow-lg transition-all
                  ${selectedTime
                    ? "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
                    : "bg-gray-400 cursor-not-allowed"}
                `}
              >
                Keyingi qadam → Bemor ma'lumotlari
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QabulgaYozilishVaqt;
