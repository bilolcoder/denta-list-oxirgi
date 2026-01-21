import React from 'react';
import { FaPhoneAlt } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

function Royhatdanotish() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      phone: ''
    },
    mode: 'onChange' // Yozish davomida tekshirib borish uchun
  });

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const digits = cleaned.startsWith('998')
      ? cleaned.substring(3)
      : cleaned;

    if (digits.length >= 9) {
      const match = digits.substring(0, 9).match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);
      if (match) {
        return `+998 ${match[1]} ${match[2]}-${match[3]}-${match[4]}`;
      }
    }

    return digits.length > 0 ? '+998 ' + digits : '';
  };

  const onSubmit = (data) => {
    console.log("Telefon raqam:", data.phone);
    navigate('/sms', {
      state: {
        phone: data.phone
      }
    });
  };

  return (
    <div className="flex flex-col items-center pt-[150px] min-h-screen bg-white">
      <h1 className="text-center text-[28px] font-bold text-[#272937] mb-[40px]">
        Ro'yxatdan o'tish
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="w-[300px]">
        <label className="text-[#272937] text-[16px] font-medium">
          Telefon raqamingizni kiriting
        </label>

        <div className="mt-[3px] relative">
          {/* Ikonka rangi xatolikka qarab o'zgaradi */}
          <FaPhoneAlt className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.phone ? 'text-red-500' : 'text-[#8E8E93]'}`} />

          <Controller
            name="phone"
            control={control}
            rules={{
              required: true,
              validate: value => value.replace(/\D/g, '').length === 12
            }}
            render={({ field }) => (
              <input
                type="tel"
                placeholder="+998 99 111-44-56"
                value={field.value}
                onChange={(e) =>
                  field.onChange(formatPhoneNumber(e.target.value))
                }
                className={`w-full h-[50px] border-[2px] rounded-[13px]
                  pl-[40px] text-[20px] font-semibold transition-all
                  focus:outline-none
                  ${errors.phone 
                    ? 'border-red-500 text-red-500 bg-red-50' 
                    : 'border-[#3353FF] text-[#6155F5]'}`}
              />
            )}
          />
        </div>

        {/* Xatolik xabari (errors.phone.message) olib tashlandi */}

        <button
          type="submit"
          className="w-full h-[55px] bg-[#00BCE4] text-white text-[18px]
                     font-semibold rounded-[13px] mt-[25px] active:scale-95 transition-transform"
        >
          Keyingi
        </button>
      </form>

      <div className="mt-[50px] text-center">
        <p className="text-[#A3AED0]">Ilovadan avval foydalanganmisiz?</p>
        <Link to="/login" className="text-[#00BCE4] font-semibold hover:underline">
          Akkauntga kirish
        </Link>
      </div>
    </div>
  );
}

export default Royhatdanotish;