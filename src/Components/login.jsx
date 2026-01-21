import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (data) => {
    const { login, password } = data;
    if (login === '111' && password === '111') {
      setError('');
      navigate('/boshsaxifa');
    } else {
      setError("Bunday akkaunt mavjud emas");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-16">
      <div className="w-full max-w-[450px] bg-white p-8 rounded-[30px] shadow-2xl mx-4">
        <h1 className="text-2xl font-bold text-center mb-10 text-[#272937]">
          Tizimga kirish
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Login Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#A3AED0] mb-2">
              Login
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Kiriting"
                {...register("login", { required: true })} // Message shart emas
                className={`w-full h-[50px] border rounded-[10px] pl-12 pr-4 text-lg focus:outline-none transition-colors 
                  ${errors.login ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#3353FF]'}`}
              />
              <FaUser className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl ${errors.login ? 'text-gray-400' : 'text-gray-400'}`} />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-[#A3AED0] mb-2">
              Parol
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Kiriting"
                {...register("password", { required: true, minLength: 3 })}
                className={`w-full h-[50px] border rounded-[10px] pl-12 pr-12 text-lg bg-gray-50 focus:outline-none transition-colors
                  ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#3353FF]'}`}
              />
              <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl ${errors.password ? 'text-gray-400' : 'text-gray-400'}`} />
              <div
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 text-xl"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>

          {/* Umumiy xatolik (Akkaunt topilmasa) */}
          {error && (
            <p className="text-red-500 text-sm text-center mt-3 mb-5">{error}</p>
          )}

          <div className="text-center mb-8">
            <a href="#" className="text-[#40CCEB] text-base font-medium hover:underline" onClick={(e) => { e.preventDefault(); navigate('/Parol_tiklashNum'); }}>
              Parolni unutingizmi?
            </a>
          </div>

          <button type="submit" className="w-full h-[55px] bg-[#00BCE4] text-white text-[18px] font-semibold rounded-[10px] active:scale-95 transition-transform">
            Kirish
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-500 mb-1">Akkauntingiz yo‘qmi?</p>
          <a href="#" className="text-[#00BCE4] font-bold hover:underline" onClick={(e) => { e.preventDefault(); navigate('/royhatdanotish'); }}>
            Ro‘yxatdan o‘ting
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;