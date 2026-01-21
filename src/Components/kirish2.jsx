import React from 'react'
import Teath from '../assets/teath.png'
import { FaCheck } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

function Kirish2() { 
    
    const navigate = useNavigate();

    const handleBemorClick = () => {
        navigate('/login'); 
    };


    return (
        <div className='w-full h-screen bg-[#00BCE4] pt-[250px]'>
            <h1 className=' sarlavhaKirish2 text-white text-center text-[25px] '>Ilovadan kim sifatida foydalanmoqchisiz</h1>
            
            <div 
                id="bemor" 
                className='w-[300px] h-[110px] m-auto mt-[50px] bg-gradient-to-r from-white to-[#b9cfe4] rounded-[10px] flex cursor-pointer transition duration-300 hover:scale-[1.03]'
                onClick={handleBemorClick} 
            >
                <img src={Teath} alt="" className='w-[110px]' />
                <div className='flex items-center gap-2.5 ml-[28px]'>

                    <div className='w-[28px] h-[28px] rounded-[50%] bg-[#00E42A] flex items-center justify-center text-white'><FaCheck /></div> 
                    <p className='text-[23px]'>Bemor</p>
                </div>
            </div>
            
        </div>
    )
}

export default Kirish2