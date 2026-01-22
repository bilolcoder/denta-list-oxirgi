import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useForm } from "react-hook-form";

function PatientForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm();

  // Oldingi sahifalardan kelgan ma'lumotlar
  const {
    doctorId: rawDoctorId,
    doctor,
    appointmentDate,
    appointmentTime,
    note: serviceNote = ""
  } = location.state || {};

  // doctorId ni string sifatida olish
  const doctorId = rawDoctorId
    ? String(rawDoctorId)
    : doctor?.id
      ? String(doctor.id)
      : doctor?._id
        ? String(doctor._id)
        : null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Service note ni comment maydoniga avtomatik joylashtirish
  React.useEffect(() => {
    if (serviceNote) {
      setValue("comment", serviceNote);
    }
  }, [serviceNote, setValue]);

  // Telefonni +998 bilan formatlash
  const formatPhoneNumber = (phone) => {
    let cleaned = phone.trim().replace(/\D/g, "");

    if (cleaned.startsWith("998")) {
      return "+" + cleaned;
    }
    if (cleaned.length === 9 && /^(90|91|93|94|95|97|98|99)/.test(cleaned)) {
      return "+998" + cleaned;
    }
    if (cleaned.length === 12 && cleaned.startsWith("998")) {
      return "+" + cleaned;
    }
    return cleaned.startsWith("+") ? cleaned : "+998" + cleaned;
  };

  const onSubmit = async (data) => {

    const token = localStorage.getItem("accessToken");

    // Validatsiya
    if (!doctorId) {
      return setError("Shifokor tanlanmagan. Jarayonni boshidan boshlang.");
    }

    if (!appointmentDate || !appointmentTime) {
      return setError("Sana yoki vaqt tanlanmagan.");
    }

    setLoading(true);
    setError("");

    try {
      const formattedPhone = formatPhoneNumber(data.phone);
      if (!formattedPhone.match(/^\+998[0-9]{9}$/)) {
        throw new Error("Telefon raqami noto'g'ri (masalan: 901234567)");
      }

      const appointmentData = {
        doctorId: doctorId,
        patient: {
          fullName: data.fullName.trim(),
          phone: formattedPhone,
          email: data.email?.trim() || "bemor@example.com"
        },
        appointmentDate: appointmentDate,
        appointmentTime: appointmentTime,
        service: data.service,
        comment: data.comment?.trim() || ""
      };

      console.log("API ga yuborilayotgan ma'lumotlar:", appointmentData);

      // API SO'ROVNI QAYTA YOQISH (Backend xatosi sababli vaqtincha o'chirildi)
      const response = await fetch("https://app.dentago.uz/api/public/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token} `,
        },
        body: JSON.stringify(appointmentData)
      });

      const result = await response.json();
      console.log("API javobi:", result);

      if (!response.ok) {
        throw new Error(result.message || `Server xatosi: ${response.status}`);
      }

      if (result.success) {
        navigate("/qabultasdiqlash", {
          state: {
            success: true,
            appointment: {
              doctor: doctor,
              date: appointmentDate,
              time: appointmentTime,
              patient: {
                fullName: data.fullName.trim(),
                phone: formattedPhone,
                email: data.email?.trim() || "bemor@example.com"
              },
              service: data.service,
              comment: data.comment?.trim()
            },
            apiResponse: result
          }
        });
      } else {
        throw new Error(result.message || "Qabul yozishda xatolik");
      }
    } catch (err) {
      console.error("API xatosi:", err);
      setError(`Xato: ${err.message}. Qayta urinib ko'ring yoki admin bilan bog'laning.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-cyan-500 text-white px-5 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-white/20 rounded-lg transition"
          >
            <IoArrowBack size={28} />
          </button>
          <h1 className="text-2xl font-bold">Bemor ma'lumotlari</h1>
        </div>
        <div className="flex gap-2">
          <div className="h-2 flex-1 bg-white/40 rounded-full"></div>
          <div className="h-2 flex-1 bg-white/40 rounded-full"></div>
          <div className="h-2 flex-1 bg-white rounded-full"></div>
        </div>
        <p className="text-sm mt-3 opacity-90">3-qadam: Ma'lumotlarni kiriting</p>
      </div>

      {/* Form */}
      <div className="p-5 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Ma'lumotlaringizni kiriting</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex w-full gap-4 max-sm:flex-col">
              {/* Ism Familiya */}
              <div className="w-[49%] max-sm:w-full">
                <label className="block text-gray-700 font-semibold mb-2">
                  Ism va Familiya <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("fullName", { required: "Ism va familiyani kiriting" })}
                  placeholder="Ismingiz Familiyangiz"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* Telefon */}
              <div className="w-[49%] max-sm:w-full">
                <label className="block text-gray-700 font-semibold mb-2">
                  Telefon raqami <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl text-gray-600">
                    +998
                  </span>
                  <input
                    type="tel"
                    {...register("phone", {
                      required: "Telefon raqamini kiriting",
                      pattern: {
                        value: /^[0-9]{9}$/,
                        message: "9 ta raqam kiriting (masalan: 901234567)"
                      }
                    })}
                    placeholder="901234567"
                    maxLength="9"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">998 qo'shmasdan kiriting</p>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Xizmat turi - Endi to'liq qatorda */}
            <div className="w-full">
              <label className="block text-gray-700 font-semibold mb-2">
                Kerakli xizmat <span className="text-red-500">*</span>
              </label>
              <select
                {...register("service", { required: "Xizmat turini tanlang" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              >
                <option value="">— Tanlang —</option>
                <option value="Консультация">Konsultatsiya</option>
                <option value="Терапевтическое лечение">Terapevtik davolash</option>
                <option value="Лечение зубов">Tish davolash</option>
                <option value="Отбеливание зубов">Tish oqartirish</option>
                <option value="Удаление зубов">Tishni olib tashlash</option>
                <option value="Имплантация зубов">Tish implantatsiyasi</option>
                <option value="Протезирование зубов">Tish protezlash</option>
                <option value="Чистка зубов">Tishlarni tozalash</option>
                <option value="Пломбирование зубов">Plomba qo'yish</option>
                <option value="Диагностика">Diagnostika</option>
              </select>
              {errors.service && (
                <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>
              )}
            </div>

            {/* Izoh */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Qo'shimcha izoh (ixtiyoriy)</label>
              <textarea
                {...register("comment")}
                rows="4"
                placeholder="Shikoyatingiz, allergiya yoki boshqa muhim ma'lumotlar..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all
                ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white active:scale-95"}
              `}
            >
              {loading ? "Yuborilmoqda..." : "Tasdiqlash va yuborish"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PatientForm;
