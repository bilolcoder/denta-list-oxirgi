import React from 'react';
import { FaPhoneAlt } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

function Royhatdanotish() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  // 📱 Telefon formatlash
  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 9);
    if (digits.length < 9) return digits;
    const match = digits.match(/(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (!match) return value;
    return `+998 ${match[1]} ${match[2]}-${match[3]}-${match[4]}`;
  };

  const onSubmit = (data) => {
    console.log("Telefon raqam:", data.phone);
    navigate('/Parol_tiklash', { state: { phone: data.phone } });
  };

  return (
    <div className="flex flex-col items-center pt-[150px] min-h-screen bg-white">
      <h1 className="text-center text-[28px] font-bold text-[#272937] mb-[40px]">
        Parolni tiklash
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="w-[300px]">
        <label className="text-[#272937] text-[16px] font-medium">
          Telefon raqamingizni kiriting
        </label>

        <div className="mt-[3px] relative">
          {/* Telefon ikonkasi rangi ham xato bo'lganda o'zgarishi mumkin */}
          <FaPhoneAlt className={`absolute left-3 top-1/2 -translate-y-1/2 text-[18px] transition-colors ${errors.phone ? 'text-gray-400' : 'text-[#8E8E93]'}`} />

          <input
            type="tel"
            placeholder="+998 99 111-44-56"
            {...register("phone", {
              required: true, // Xabar kerak emas, shunchaki true
              validate: (value) => value.replace(/\D/g, '').length === 12
            })}
            onInput={(e) => {
              const formatted = formatPhone(e.target.value);
              setValue("phone", formatted, { shouldValidate: true }); // Yozganda tekshirib boradi
            }}
            // Bu yerda dinamik klass qo'shildi
            className={`w-full h-[50px] border-[2px] rounded-[13px] pl-[40px] text-[20px] font-semibold transition-all focus:outline-none placeholder:text-[#6155F5]/50
              ${errors.phone 
                ? 'border-red-500 text-red-500' 
                : 'border-[#3353FF] text-[#6155F5] focus:border-[#3353FF]'}`}
          />
        </div>

        {/* Xatolik yozuvi olib tashlandi */}

        <button
          type="submit"
          className="w-full h-[55px] bg-[#00BCE4] text-white text-[18px] font-semibold
                     rounded-[13px] mt-[25px] shadow-lg hover:bg-opacity-90 active:scale-95 transition-all"
        >
          Keyingi
        </button>
      </form>

      <div className="mt-[50px] text-center">
        <p className="text-[#A3AED0] text-[16px] mb-1">Akkountingiz yo‘qmi?</p>
        <Link
          to="/royhatdanotish"
          className="text-[#00BCE4] text-[18px] font-semibold hover:underline"
        >
          Ro‘yxatdan o‘ting
        </Link>
      </div>
    </div>
  );
}

export default Royhatdanotish;