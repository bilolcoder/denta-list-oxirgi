import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Sms() {
    const [smsCode, setSmsCode] = useState('');
    const [isError, setIsError] = useState(false); // Xatolik uchun state
    
    const navigate = useNavigate();
    const location = useLocation();
    
    const phone = location.state?.phone || "+998 XX XXX-XX-XX"; 
    const buttonColor = '#00BCE4';

    const formatCode = (value) => {
        const cleaned = ('' + value).replace(/\D/g, ''); 
        const limited = cleaned.substring(0, 6); 
        const match = limited.match(/^(\d{3})(\d{3})$/);
        
        if (match) {
            return `${match[1]} - ${match[2]}`;
        }
        return limited;
    };

    const handleCodeChange = (event) => {
        const input = event.target.value;
        const formatted = formatCode(input);
        const rawDigits = ('' + formatted).replace(/\D/g, '').substring(0, 6);

        if (rawDigits.length <= 6) {
            setSmsCode(formatted);
            // Foydalanuvchi yozyaptimi, xatolikni vaqtincha olib tashlaymiz
            if (isError) setIsError(false);
        }
    };

    const handleNext = () => {
        const rawDigits = smsCode.replace(/\D/g, '');
        if (rawDigits.length === 6) {
            setIsError(false);
            console.log("SMS kod: " + rawDigits);
            navigate('/profile'); 
        } else {
            // Alert o'rniga borderni qizil qilamiz
            setIsError(true);
        }
    };
    
    const handleCancel = () => {
        navigate(-1); 
    };

    return (
        <div className='flex flex-col items-center pt-[150px] min-h-screen bg-white'>
            
            <h1 className='text-center text-[24px] font-bold text-[#272937] w-[300px] leading-[30px] mb-[15px]'>
                SMS orqali yuborilgan kodni kiriting
            </h1>
            
            <p className='text-[#A3AED0] text-[16px] mb-[30px]'>
                Raqam: <span className='text-[#6155F5] font-semibold'>{phone}</span>
            </p>

            <div className='w-[300px]'>
                <input
                    id="sms-inp"
                    type="tel" 
                    value={smsCode}
                    onChange={handleCodeChange}
                    maxLength={9} 
                    placeholder="985 - 567"
                    className={`w-full h-[65px] border-[2px] rounded-[13px] text-center 
                                text-[28px] font-semibold tracking-widest transition-all
                                focus:outline-none
                                ${isError 
                                    ? 'border-red-500 text-red-500 bg-red-50' 
                                    : 'border-[#3353FF] text-[#6155F5] focus:border-[#3353FF]'}`}
                    style={{ letterSpacing: smsCode.length > 0 ? '5px' : 'normal' }} 
                />
            </div>
            
            <button 
                className={`w-[300px] h-[55px] text-white text-[18px] font-semibold 
                            rounded-[13px] mt-[35px] shadow-lg hover:bg-opacity-90 transition active:scale-95`}
                style={{ backgroundColor: buttonColor }}
                onClick={handleNext} 
            >
                Keyingi
            </button>
            
            <button 
                className={`w-[300px] h-[55px] border-[2px] text-[18px] font-semibold 
                            rounded-[13px] mt-[15px] bg-white hover:bg-gray-50 transition active:scale-95`}
                style={{ borderColor: buttonColor, color: buttonColor }}
                onClick={handleCancel}
            >
                Bekor qilish
            </button>
            
        </div>
    );
}

export default Sms;