import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoInformationCircleOutline, IoCalendarOutline, IoTimeOutline, IoCheckmarkCircle, IoTime } from 'react-icons/io5';
import axios from 'axios';

function MeningShifokorlarim() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Doktorlar ma'lumotlarini saqlash uchun kesh (ID -> Doctor Object)
  const [doctorsMap, setDoctorsMap] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError("Token topilmadi. Iltimos tizimga qayta kiring.");
          setLoading(false);
          return;
        }

        // 1. Qabullarni yuklash
        const response = await axios.get('https://app.dentago.uz/api/user/doctors', {
          headers: {
            Authorization: `Bearer ${token} `,
            'Content-Type': 'application/json',
          },
        });

        console.log('API javobi:', response.data);

        // API tuzilmasiga qarab ma'lumotlarni olish
        const appointmentsData = Array.isArray(response.data)
          ? response.data
          : (response.data.data || response.data.appointments || response.data.results || []);

        setAppointments(appointmentsData);

        // 2. Doktor IDalarini yig'ish
        const uniqueDoctorIds = [...new Set(appointmentsData.map(item => {
          // "doctor" maydoni string (ID) yoki object bo'lishi mumkin
          return typeof item.doctor === 'object' ? item.doctor._id : item.doctor;
        }).filter(id => id))];

        // 3. Har bir doktor uchun ma'lumot yuklash (Parallel)
        const doctorsInfo = {};
        await Promise.all(uniqueDoctorIds.map(async (doctorId) => {
          try {
            // Agar doktor ID string bo'lsa, uning ma'lumotlarini olamiz
            const docResponse = await axios.get(`https://app.dentago.uz/api/public/doctors/${doctorId}`);
            if (docResponse.data.success) {
              doctorsInfo[doctorId] = docResponse.data.data;
            }
          } catch (err) {
            console.error(`Doktor (ID: ${doctorId}) yuklashda xato:`, err);
            // Xatolik bo'lsa ham bo'sh object qo'yib ketamiz, dastur to'xtab qolmasligi uchun
            doctorsInfo[doctorId] = { fullName: 'Ma\'lumot yuklanmadi', specialty: '---' };
          }
        }));

        setDoctorsMap(doctorsInfo);

      } catch (err) {
        console.error('Xato:', err.response?.data || err.message);
        setError(
          err.response?.status === 401 || err.response?.status === 403
            ? "Kirish huquqingiz yo'q yoki sessiya tugagan. Qayta kiring."
            : "Qabullarni yuklab bo'lmadi."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Yordamchi: Sana formatlash
  const formatDateTime = (isoString) => {
    if (!isoString) return '—';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('uz-UZ', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (e) { return isoString; }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '—';
    // Agar "11:00" kabi kelsa o'zi qaytaradi, agar ISO bo'lsa soatni ajratadi
    if (timeString.includes('T')) {
      const date = new Date(timeString);
      return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    }
    return timeString;
  };

  // Statusni chiroyli ko'rsatish
  const renderStatus = (status) => {
    switch (status) {
      case 'pending': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold max-sm:text-[8px]">Kutilmoqda</span>;
      case 'confirmed': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold max-sm:text-[8px]">Tasdiqlangan</span>;
      case 'completed': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold max-sm:text-[8px]">Yakunlangan</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold max-sm:text-[8px]">Bekor qilingan</span>;
      default: return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold max-sm:text-[8px]">{status || 'Noma\'lum'}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4 text-red-500">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Xatolik yuz berdi</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-cyan-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-cyan-600 transition"
          >
            Qayta yuklash
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-5 md:px-10 lg:px-[70px] xl:px-[100px] bg-gray-50 flex flex-col mb-[71px]">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 mt-5 text-gray-800 flex items-center gap-3">
        <IoCalendarOutline className="text-cyan-600" />
        Qabullar ro'yxati
      </h1>

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full mx-auto">
          <IoInformationCircleOutline size={70} className="text-cyan-500 mb-6 animate-pulse-slow" />
          <h3 className="text-2xl font-extrabold text-gray-800 mb-4">
            Qabul Ro'yxati Bo'sh
          </h3>
          <p className="text-gray-500 mb-8">
            Siz hali birorta shifokor qabuliga yozilmagansiz.
          </p>
          <Link
            to="/boshsaxifa"
            className="px-10 py-4 bg-cyan-500 text-white rounded-full font-semibold text-lg shadow-lg hover:bg-cyan-600 transition"
          >
            Qabulga yozilish
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 min-[500px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {appointments.map((appt) => {
            // Doktorni topish
            const doctorId = typeof appt.doctor === 'object' ? appt.doctor._id : appt.doctor;
            const doctorDetails = doctorsMap[doctorId] || (typeof appt.doctor === 'object' ? appt.doctor : {});

            return (
              <div
                key={appt._id || Math.random()}
                className="bg-white rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-100 group"
              >
                {/* HEAD: Katta Rasm qismi (Reference ga o'xshab) */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  {doctorDetails.avatar ? (
                    <img
                      src={doctorDetails.avatar}
                      alt="doc"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-6xl font-bold text-gray-300">
                        {doctorDetails.fullName?.[0] || "?"}
                      </span>
                    </div>
                  )}

                  {/* Status Badge - rasm ustida */}
                  <div className="absolute top-4 right-4 shadow-lg">
                    {renderStatus(appt.status)}
                  </div>

                  {/* Overlay gradient text - rasm pastida o'qish oson bo'lishi uchun */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-5">
                    <h3 className="text-xl font-bold text-white break-words max-sm:text-[15px] leading-tight">
                      {doctorDetails.fullName || "Shifokor"}
                    </h3>
                    <p className="text-white/90 text-sm max-sm:text-[10px] font-medium">
                      {doctorDetails.specialty || "Mutaxassis"}
                    </p>
                  </div>
                </div>

                {/* BODY: Qabul ma'lumotlari */}
                <div className="p-5 max-sm:p-2 flex-1 flex flex-col gap-4">
                  {/* Sana va Vaqt */}
                  <div className="flex items-center gap-4 text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 max-sm:gap-1">
                      <div className="p-2 rounded-lg max-sm:p-2 bg-cyan-100 flex items-center justify-center text-cyan-600">
                        <IoCalendarOutline className='max-sm:text-[10px]' />
                      </div>
                      <span className="font-semibold max-sm:text-[10px] text-sm">
                        {formatDateTime(appt.appointmentDate)}
                      </span>
                    </div>
                    <div className="w-[1px] h-8 bg-gray-200"></div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg max-sm:p-2 bg-orange-100 flex items-center justify-center text-orange-600">
                        <IoTimeOutline className='max-sm:text-[10px]' />
                      </div>
                      <span className="font-semibold max-sm:text-[10px] text-sm">
                        {formatTime(appt.appointmentTime || appt.appointmentDate)}
                      </span>
                    </div>
                  </div>

                  {/* Xizmat */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Xizmat turi:</span>
                    <span className="font-bold text-gray-800 text-right line-clamp-1 max-w-[60%]">
                      {appt.service || "Umumiy ko'rik"}
                    </span>
                  </div>

                  {/* Izoh (agar bor bo'lsa) */}
                  {appt.comment && (
                    <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg italic line-clamp-2">
                      "{appt.comment}"
                    </div>
                  )}
                </div>

                {/* FOOTER: Katta tugma */}
                <div className="p-5 pt-0 mt-auto">
                  <button
                    onClick={() => {
                      if (doctorId) navigate(`/shifokorlar/${doctorId}`);
                    }}
                    className="w-full py-3.5 bg-cyan-500 text-white font-bold rounded-2xl hover:bg-cyan-600 active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/20"
                  >
                    Profilni ko'rish
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MeningShifokorlarim;
