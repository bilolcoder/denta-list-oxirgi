import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function QabulgaYozilishDate() {
  const navigate = useNavigate();
  const location = useLocation();

  // Oldingi sahifadan (shifokor profili) kelgan ma'lumotlar
  const { doctorId, doctor } = location.state || {};

  // Tanlangan kun va oylar bilan ishlash
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const months = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
  ];

  const days = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

  // Kalendar kunlarini hisoblash (Dushanbadan boshlab)
  const getDaysArray = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const startingWeekday = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // 0 = Yakshanba → 6 qilib, Dushanba birinchi bo'lsin
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Bo'sh joylar (oldin)
    for (let i = 0; i < startingWeekday; i++) {
      days.push(null);
    }

    // Haqiqiy kunlar
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Keyingi sahifaga o'tish (vaqt tanlash yoki forma)
  const handleNextStep = () => {
    if (!selectedDate || !doctor || !doctorId) {
      return;
    }

    const fullDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      selectedDate
    );

    // Keyingi sahifaga barcha kerakli ma'lumotlarni o'tkazamiz
    navigate("/qabulgayozilish2", {
      state: {
        doctorId: doctorId,                    // MongoDB ObjectId (string)
        doctor: doctor,                        // To'liq shifokor obyekti
        appointmentDate: fullDate.toISOString(), // "2026-01-15T00:00:00.000Z"
        selectedDay: selectedDate,
        selectedMonth: months[currentMonth.getMonth()],
        selectedYear: currentMonth.getFullYear()
      }
    });
  };

  // Xavfsizlik: agar shifokor ma'lumotlari yo'q bo'lsa
  if (!doctor || !doctorId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Ma'lumotlar yuklanmadi</h2>
          <p className="text-gray-600 mb-6">Shifokor tanlanmagan yoki ma'lumotlar yo'qolgan.</p>
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

  return (
    <div className="min-h-screen mb-[60px] bg-gray-100">
      {/* Header */}
      <div className="bg-cyan-500 text-white px-5 py-6 rounded-b-3xl shadow-lg">
        <button onClick={() => navigate(-1)} className="text-4xl mb-4">←</button>
        <h1 className="text-2xl font-bold">Qabulga yozilish</h1>
        <div className="flex gap-2 mt-6">
          <div className="h-2 flex-1 bg-white rounded-full"></div>
          <div className="h-2 flex-1 bg-white/40 rounded-full"></div>
          <div className="h-2 flex-1 bg-white/40 rounded-full"></div>
        </div>
      </div>

      <div className="p-5 max-w-7xl mx-auto">
        {/* Shifokor kartasi */}
          <h2 className="text-xl font-bold mb-4 text-gray-800">Shifokor</h2>
        <div className="bg-white rounded-2xl p-5 shadow mb-8">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={doctor.avatar || ""}
                alt={doctor.fullName}
                className="w-24 h-24 rounded-xl object-cover shadow"
                onError={(e) => {
                  e.target.src = "";
                }}
              />
              {doctor.isAvailable24x7 && (
                <span className="absolute bottom-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-tr-xl rounded-bl-none">
                  24/7
                </span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{doctor.fullName}</h3>
              <p className="text-gray-600 text-base">{doctor.specialty}</p>
              <div className="text-sm text-gray-500 mt-2 space-y-1">
                {/* <p>{doctor.patientsCount || 0} ta bemor</p> */}
                <p>{doctor.experienceYears }+ yil tajriba</p>
              </div>
              {doctor.price && (
                <p className="font-semibold text-cyan-600 mt-2">
                  {parseInt(doctor.price).toLocaleString("ru-RU")} so'm
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Kalendar */}
        <h2 className="text-xl font-bold mb-4 text-gray-800">Sanani tanlang</h2>
        <div className="bg-white rounded-2xl p-6 shadow">
          {/* Oy va yil */}
          <div className="flex justify-between items-center mb-6">
            <button onClick={prevMonth} className="text-3xl text-cyan-600 hover:text-cyan-700">‹</button>
            <h3 className="text-xl font-bold text-gray-800">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button onClick={nextMonth} className="text-3xl text-cyan-600 hover:text-cyan-700">›</button>
          </div>

          {/* Hafta kunlari */}
          <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-600 mb-3">
            {days.map((day) => (
              <div className="flex items-center px-6 py-1" key={day}>{day}</div>
            ))}
          </div>

          {/* Kunlar */}
          <div className="grid grid-cols-7 gap-3">
            {getDaysArray().map((day, index) => {
              if (!day) return <div key={index} />;

              const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const isPast = dateObj < today;
              const isToday = dateObj.toDateString() === today.toDateString();
              const isSelected = selectedDate === day;

              return (
                <button
                  key={index}
                  disabled={isPast}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    h-12 w-12 rounded-full flex items-center justify-center text-base font-medium transition-all
                    ${isSelected ? "bg-cyan-500 text-white shadow-lg scale-110" : ""}
                    ${isToday && !isSelected ? "border-3 border-cyan-500 text-cyan-600 font-bold" : ""}
                    ${isPast ? "text-gray-300 cursor-not-allowed" : "hover:bg-cyan-100 cursor-pointer"}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          {selectedDate ? (
            <p className="text-center text-lg font-semibold text-gray-800 mb-6">
              Tanlangan sana:{" "}
              <span className="text-cyan-600">
                {selectedDate} {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
            </p>
          ) : (
            <p className="text-center text-gray-500 mb-6">Sanani tanlang</p>
          )}

          <button
            onClick={handleNextStep}
            disabled={!selectedDate}
            className={`
              w-full py-4 rounded-full text-white font-bold text-lg shadow-lg transition-all
              ${selectedDate
                ? "bg-cyan-500 hover:bg-cyan-600 active:scale-95"
                : "bg-gray-300 cursor-not-allowed"}
            `}
          >
            Keyingi qadam
          </button>
        </div>
      </div>
    </div>
  );
}

export default QabulgaYozilishDate;