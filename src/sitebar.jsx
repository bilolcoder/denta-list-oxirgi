import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiHome, FiUser } from "react-icons/fi";
import { FaUserDoctor,   } from "react-icons/fa6";
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
            Icon: (props) => (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="none"
                    {...props}
                >
                    <path
                        stroke="currentColor"          // → rang dinamik bo'ladi (active bo'lganda #00BCE4)
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 17v-5.548c0-.534 0-.801-.065-1.05a1.998 1.998 0 0 0-.28-.617c-.145-.213-.345-.39-.748-.741l-4.8-4.2c-.746-.653-1.12-.98-1.54-1.104-.37-.11-.764-.11-1.135 0-.42.124-.792.45-1.538 1.102L5.093 9.044c-.402.352-.603.528-.747.74a2 2 0 0 0-.281.618C4 10.65 4 10.918 4 11.452V17c0 .932 0 1.398.152 1.765a2 2 0 0 0 1.082 1.083C5.602 20 6.068 20 7 20s1.398 0 1.766-.152a2 2 0 0 0 1.082-1.083C10 18.398 10 17.932 10 17v-1a2 2 0 1 1 4 0v1c0 .932 0 1.398.152 1.765a2 2 0 0 0 1.082 1.083C15.602 20 16.068 20 17 20s1.398 0 1.766-.152a2 2 0 0 0 1.082-1.083C20 18.398 20 17.932 20 17Z"
                    />
                </svg>
            ),
            label: 'Bosh saxifa',
            isActive: currentPath === '/boshsaxifa' || isDoctorPage
        },

        {
            path: '/yoqtirishlar',
            Icon: FaUserDoctor,
            label: 'Doktorlarim',
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
            label: 'Qabullar ro\'yxati',
            isActive: currentPath === '/mening-shifokorlarim'
        },
        {
            path: '/profil',
            Icon: (props) => (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="none"
                    {...props}
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth={2}
                        d="M19.727 20.447c-.455-1.276-1.46-2.403-2.857-3.207C15.473 16.436 13.761 16 12 16c-1.761 0-3.473.436-4.87 1.24-1.397.804-2.402 1.931-2.857 3.207"
                    />
                    <circle
                        cx={12}
                        cy={8}
                        r={4}
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth={2}
                    />
                </svg>
            ),
            label: 'Profil',
            isActive: currentPath === '/profil'
        },
    ];


    return (
        <header className='w-full h-[71px] border-t border-gray-400 fixed bg-white bottom-0 left-0 z-50'>
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
