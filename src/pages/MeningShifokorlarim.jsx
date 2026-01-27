import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoInformationCircleOutline, IoCalendarOutline, IoTimeOutline, IoCheckmarkCircle, IoTime, IoStar, IoStarOutline, IoClose } from 'react-icons/io5';
import axios from 'axios';
import { useForm } from 'react-hook-form';

function MeningShifokorlarim() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Doktorlar ma'lumotlarini saqlash uchun kesh (ID -> Doctor Object)
  const [doctorsMap, setDoctorsMap] = useState({});

  // Modal and rating states
  const [showConfirmationCard, setShowConfirmationCard] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [confirmedDoctor, setConfirmedDoctor] = useState(null);
  const [confirmedDoctorsQueue, setConfirmedDoctorsQueue] = useState([]);

  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  // LocalStorage helpers for tracking reviewed/skipped doctors
  const getReviewedDoctors = () => {
    const reviewed = localStorage.getItem('reviewedDoctors');
    return reviewed ? JSON.parse(reviewed) : [];
  };

  const addReviewedDoctor = (doctorId) => {
    const reviewed = getReviewedDoctors();
    if (!reviewed.includes(doctorId)) {
      reviewed.push(doctorId);
      localStorage.setItem('reviewedDoctors', JSON.stringify(reviewed));
    }
  };

  const isDoctorReviewed = (doctorId) => {
    return getReviewedDoctors().includes(doctorId);
  };

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

        // Get confirmed appointments and filter out already reviewed/skipped doctors
        const confirmedAppointments = appointmentsData.filter(appt => {
          const doctorId = typeof appt.doctor === 'object' ? appt.doctor._id : appt.doctor;
          return appt.status === 'confirmed' && !isDoctorReviewed(doctorId);
        });

        if (confirmedAppointments.length > 0) {
          // Sort by date (oldest first) to show in order
          const sortedConfirmed = confirmedAppointments.sort((a, b) => 
            new Date(a.appointmentDate) - new Date(b.appointmentDate)
          );
          
          // Build queue of doctors
          const queue = sortedConfirmed.map(appt => {
            const doctorId = typeof appt.doctor === 'object' ? appt.doctor._id : appt.doctor;
            return doctorsInfo[doctorId] || (typeof appt.doctor === 'object' ? appt.doctor : {});
          });
          
          setConfirmedDoctorsQueue(queue);
          
          // Show the first doctor in queue
          if (queue.length > 0) {
            setConfirmedDoctor(queue[0]);
            setShowConfirmationCard(true);
          }
        }

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

  // Handle review submission
  const onSubmitReview = (data) => {
    console.log({
      rating: rating,
      review: data.review,
      doctor: confirmedDoctor?.fullName,
      doctorId: confirmedDoctor?._id
    });
    
    // Mark doctor as reviewed
    if (confirmedDoctor?._id) {
      addReviewedDoctor(confirmedDoctor._id);
    }
    
    // Reset form and close modal
    reset();
    setRating(0);
    setShowModal(false);
    
    // Show next doctor in queue
    showNextDoctor();
  };

  // Handle skip (don't want to rate)
  const handleSkipRating = () => {
    // Mark doctor as reviewed (skipped)
    if (confirmedDoctor?._id) {
      addReviewedDoctor(confirmedDoctor._id);
    }
    
    // Show next doctor in queue
    showNextDoctor();
  };

  // Show next doctor from queue
  const showNextDoctor = () => {
    // Remove current doctor from queue
    const newQueue = confirmedDoctorsQueue.slice(1);
    setConfirmedDoctorsQueue(newQueue);
    
    if (newQueue.length > 0) {
      // Show next doctor
      setConfirmedDoctor(newQueue[0]);
      setShowConfirmationCard(true);
    } else {
      // No more doctors to review
      setConfirmedDoctor(null);
      setShowConfirmationCard(false);
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

      {/* Confirmation Card - Top to Down Animation */}
{showConfirmationCard && confirmedDoctor && (
  <div className="fixed top-5 right-5 z-50 animate-slide-down max-sm:right-0 max-sm:left-0 max-sm:mx-5">
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-[340px] max-sm:w-auto border border-gray-100">
      {/* Doctor Info */}
      <div className="flex items-center gap-4 mb-4">
        {confirmedDoctor.avatar ? (
          <img
            src={confirmedDoctor.avatar}
            alt={confirmedDoctor.fullName}
            className="w-16 h-16 rounded-full object-cover border-2 border-cyan-500"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {confirmedDoctor.fullName?.[0] || "?"}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 text-lg break-words overflow-hidden line-clamp-2">
            {confirmedDoctor.fullName || "Shifokor"}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {confirmedDoctor.specialty || "Mutaxassis"}
          </p>
        </div>
      </div>

      {/* Message */}
      <p className="text-gray-700 text-sm mb-4 leading-relaxed">
        Siz shifokor bilan qabulni yakunladingiz. Baholash va sharh qoldirmoqchimisiz?
      </p>

      {/* Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => setShowModal(true)}
          className="w-full py-3 bg-cyan-500 text-white font-semibold rounded-xl hover:bg-cyan-600 transition-all shadow-lg"
        >
          Qabul qilish
        </button>
        
        <button
          onClick={handleSkipRating}
          className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all border border-gray-300"
        >
          Baholamoqchi emasman
        </button>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setShowConfirmationCard(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
      >
        <IoClose size={24} />
      </button>
    </div>
  </div>
)}

      {/* Rating Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-5">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-scale-in">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowModal(false);
                setRating(0);
                reset();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <IoClose size={28} />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Baholash
            </h2>

            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  {star <= (hoveredRating || rating) ? (
                    <IoStar size={48} className="text-yellow-400" />
                  ) : (
                    <IoStarOutline size={48} className="text-gray-300" />
                  )}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmitReview)}>
              {/* Review Textarea */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3">
                  Sharhingizni yozing
                </label>
                <textarea
                  {...register('review', { required: true })}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                  placeholder="Shifokor haqida fikringizni yozing..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-cyan-500 text-white font-bold text-lg rounded-xl hover:bg-cyan-600 transition-all shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={rating === 0}
              >
                Yuborish
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MeningShifokorlarim;
