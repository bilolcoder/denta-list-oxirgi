import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoArrowBack, IoCalendarOutline, IoTimeOutline, IoStar, IoLocationOutline } from "react-icons/io5";

function QabulTasdiqlash() {
  const navigate = useNavigate();
  const location = useLocation();

  // PatientForm dan kelgan ma'lumotlar
  const { appointment } = location.state || {};

  // Agar ma'lumotlar yo'q bo'lsa
  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ma'lumot topilmadi</h2>
          <p className="text-gray-600 mb-8">Qabul jarayoni to'liq yakunlanmagan ko'rinadi.</p>
          <button
            onClick={() => navigate("/boshsaxifa")}
            className="bg-[#00CEEE] hover:bg-[#00b8d9] text-white font-bold py-4 px-8 rounded-full transition"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  const { doctor, date, time, patient, service, comment } = appointment;

  // Sana va vaqtni formatlash
  const formatDate = (isoString) => {
    if (!isoString) return "Sana ko'rsatilmagan";
    try {
      const dateObj = new Date(isoString);
      return dateObj.toLocaleDateString('uz-UZ', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return "Sana noto'g'ri";
    }
  };

  // Qaysi vaqtga yozilgani
  const formatTime = (timeStr) => {
    if (!timeStr) return "Vaqt ko'rsatilmagan";
    return timeStr;
  };

  // Doktorning klinika ma'lumotlarini olish
  const getClinicInfo = () => {
    if (!doctor?.clinic) return "Klinika ko'rsatilmagan";

    // Agar clinic string bo'lsa
    if (typeof doctor.clinic === 'string') {
      return doctor.clinic;
    }

    // Agar clinic object bo'lsa
    if (typeof doctor.clinic === 'object') {
      return doctor.clinic.name || doctor.clinic.address || "Klinika";
    }

    return "Klinika ko'rsatilmagan";
  };

  // Klinika manzilini olish
  const getClinicAddress = () => {
    if (!doctor?.clinic) return null;

    if (typeof doctor.clinic === 'object') {
      return doctor.clinic.address || doctor.clinic.location || null;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative bg-gradient-to-b from-[#00CEEE] to-[#00b8d9] text-white py-10 px-6 rounded-b-3xl shadow-lg">
        <button
          onClick={() => navigate("/boshsaxifa")}
          className="absolute top-6 left-6 bg-white/20 hover:bg-white/30 p-3 rounded-full transition"
        >
          <IoArrowBack size={28} />
        </button>

        <div className="mt-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-14 h-14 bg-[#00CEEE] rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold mt-4">
            Qabulingiz qabul qilindi!
          </h1>

          <p className="text-lg mt-4 max-w-2xl mx-auto">
            Qabulingiz tasdiqlandi. Tez orada SMS xabarnoma olasiz.
          </p>
        </div>
      </div>

      {/* Asosiy kontent */}
      <div className="max-w-4xl mx-auto px-5 py-8">
        {/* Shifokor ma'lumotlari */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Shifokor ma'lumotlari</h2>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Shifokor rasmi va asosiy ma'lumotlar */}
            <div className="md:w-1/3">
              <div className="bg-gradient-to-br from-[#00CEEE] to-[#00b8d9] rounded-2xl p-6 text-center text-white">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  {doctor?.avatar ? (
                    <img
                      src={doctor.avatar}
                      alt={doctor.fullName || "Shifokor"}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = "";
                        e.target.parentElement.innerHTML = `
                          <span class="text-[#00CEEE] text-4xl font-bold">
                            ${(doctor?.fullName || "D").charAt(0)}
                          </span>
                        `;
                      }}
                    />
                  ) : (
                    <span className="text-[#00CEEE] text-5xl font-bold">
                      {(doctor?.fullName || "D").charAt(0)}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold mb-2">{doctor?.fullName || "Shifokor"}</h3>
                <p className="text-lg opacity-90 mb-4">{doctor?.specialty || "Mutaxassislik"}</p>

                {/* {doctor?.rating && (
                  <div className="flex items-center justify-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
                    <IoStar className="text-yellow-300" />
                    <span className="font-bold">{doctor.rating}</span>
                    <span className="text-sm">reyting</span>
                  </div>
                )} */}

                <div className="flex items-center justify-center gap-2 text-sm">
                  <IoLocationOutline />
                  <span>{getClinicInfo()}</span>
                </div>
              </div>
            </div>

            {/* Qo'shimcha ma'lumotlar */}
            <div className="md:w-2/3">
              {/* Klinika manzili */}
              {getClinicAddress() && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <IoLocationOutline className="text-[#00CEEE] mt-1" />
                    <div>
                      <p className="font-medium text-gray-700 mb-1">Klinika manzili:</p>
                      <p className="text-gray-600 text-sm">{getClinicAddress()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Qo'shimcha stats */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                {doctor?.experienceYears && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-[#00CEEE] mb-1">{doctor.experienceYears}</div>
                    <div className="text-sm text-gray-600">yillik tajriba</div>
                  </div>
                )}

                {/* {doctor?.patientsCount && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-[#00CEEE] mb-1">{doctor.patientsCount}</div>
                    <div className="text-sm text-gray-600">bemor</div>
                  </div>
                )} */}
              </div>

              {/* Narx */}
              {doctor?.price && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-2xl font-bold text-[#00CEEE]">
                    {parseInt(doctor.price).toLocaleString('ru-RU')} so'm
                  </p>
                  <p className="text-sm text-gray-600">Konsultatsiya narxi</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Qabul tafsilotlari - QAYSI SANAGA VA QAYSI vaqtga yozilgan */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Qabul tafsilotlari</h2>

          {/* Qaysi sanaga va qaysi vaqtga yozilgani */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Qabul vaqti:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 bg-[#00CEEE] text-white rounded-xl p-4">
                <div className="bg-white/30 p-3 rounded-full">
                  <IoCalendarOutline size={24} />
                </div>
                <div>
                  <p className="text-sm opacity-90">Yozilgan sana</p>
                  <p className="text-xl font-bold">{formatDate(date)}</p>
                  <p className="text-sm opacity-80 mt-1">Qaysi sanaga yozilgani</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white border-2 border-[#00CEEE] text-gray-800 rounded-xl p-4">
                <div className="bg-[#00CEEE] p-3 rounded-full">
                  <IoTimeOutline size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Yozilgan vaqt</p>
                  <p className="text-xl font-bold text-gray-900">{formatTime(time)}</p>
                  <p className="text-sm text-gray-500 mt-1">Qaysi vaqtga yozilgani</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bemor ma'lumotlari */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Bemor ma'lumotlari:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-sm text-gray-600">Ism Familiya</p>
                <p className="text-lg font-bold text-gray-900">{patient?.fullName || "Ko'rsatilmagan"}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-sm text-gray-600">Telefon raqami</p>
                <p className="text-lg font-bold text-gray-900">{patient?.phone || "Ko'rsatilmagan"}</p>
              </div>
            </div>
          </div>

          {/* Xizmat turi */}
          {service && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Xizmat turi:</h3>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-sm text-gray-600">Tanlangan xizmat</p>
                <p className="text-lg font-bold text-gray-900">{service}</p>
              </div>
            </div>
          )}

          {/* Izoh */}
          {comment && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Qo'shimcha izoh:</h3>
              <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-[#00CEEE] whitespace-pre-wrap break-words">
                <p className="text-gray-800">{comment}</p>
              </div>
            </div>
          )}
        </div>

        {/* Bosh sahifaga qaytish tugmasi */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/boshsaxifa")}
            className="bg-[#00CEEE] hover:bg-[#00b8d9] text-white font-bold py-4 px-10 rounded-full text-lg transition shadow-lg"
          >
            Bosh sahifaga qaytish
          </button>
          <p className="text-gray-600 mt-6 text-sm">
            Qabulingiz haqida SMS tasdiqlash yuborildi.<br />
            Vaqtida kelishingizni eslatamiz!
          </p>
        </div>
      </div>
    </div>
  );
}

export default QabulTasdiqlash;
