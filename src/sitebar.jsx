import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiHome, FiUser } from "react-icons/fi";
import { FaUserDoctor, FaTooth ,FaRegHeart  } from "react-icons/fa6";
import { HiOutlineChat } from "react-icons/hi";

function Sitebar() {
    const location = useLocation();
    const currentPath = location.pathname;

    // Dinamik yo'llarni tekshirish funksiyalari
    const isDoctorPage = currentPath.startsWith('/shifokorlar/');
    const isChatPage = currentPath.startsWith('/chat/');

    // Sitebar ko'rsatilishi kerak bo'lgan yo'llar ro'yxati
    const staticPaths = [
        '/boshsaxifa',
        '/profil',
        '/Notification',
        '/sharhlar',
        '/B24_7',
        '/EngYaqin',
        '/AyolDoktor',
        '/BolalarDoktori',
        '/yoqtirishlar',
        '/mening-shifokorlarim',
        '/chats',
        '/qabulgayozilish',
        '/qabulgayozilish2',
        '/qabultasdiqlash',
    ];

    // Joriy yo'l ruxsat berilgan yo'llar ichida bo'lmasa, Sitebarni yashiramiz.
    if (!staticPaths.includes(currentPath) && !isDoctorPage && !isChatPage) {
        return null;
    }

    // Navigatsiya bandlari
    const navItems = [
        {
            path: '/boshsaxifa',
            Icon: FiHome,
            label: 'Bosh saxifa',
            isActive: currentPath === '/boshsaxifa' || isDoctorPage
        },
        {
            path: '/yoqtirishlar',
            Icon: FaUserDoctor,
            label: 'Shifokorlarim',
            isActive: currentPath === '/yoqtirishlar' || isChatPage
        },
        {
            path: '/mening-shifokorlarim',
            Icon: (props) => (  // ⚡ shu yerda SVG-ni bevosita beramiz
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={17} fill="none" {...props}>
                    <path
                        stroke="currentColor"
                        d="M9 13.5c1.5 0 2.5 3 3.5 3 2 0 5-8.5 5-12.5C17.5 2.081 16 .5 14 .5s-3.5 2-5 2-3-2-5-2S.5 2 .5 4c0 4 3 12.5 5 12.5 1 0 2-3 3.5-3Z"
                    />
                </svg>
            ),
            label: 'Mening qabullarim',
            isActive: currentPath === '/mening-shifokorlarim'
        },
        {
            path: '/profil',
            Icon: FiUser,
            label: 'Profil',
            isActive: currentPath === '/profil'
        },
    ];


    return (
        <header className='w-full h-[71px] border border-gray-400 fixed bg-white bottom-0 left-0 z-50'>
            <nav className='h-full flex items-center'>
                <ul className="m-auto w-[90%] flex justify-between">
                    {navItems.map((item) => {
                        const iconColor = item.isActive ? '#00BCE4' : 'text-gray-500';
                        const textColor = item.isActive ? '#00BCE4' : 'text-gray-500';

                        return (
                            <li key={item.path} className="w-[23%] text-center">
                                <Link to={item.path} className="block">
                                    <item.Icon className={`m-auto text-[20px] ${iconColor}`} />
                                    <p className={`text-[12px] ${textColor} mt-1`}>{item.label}</p>

                                    {/* Faol chiziqni ko'rsatish */}
                                    {item.isActive && (
                                        <hr className='w-5 m-auto border-[1.5px] rounded-3xl border-[#00BCE4] mt-1' />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </header>
    );
}

export default Sitebar;
