import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Phone, Video, MessageSquare } from 'lucide-react';

// Doctorlar ma'lumotlari (bir xil)
import Denta1 from "../assets/denta1.jpg";
import Denta2 from "../assets/denta2.jpg";
import Denta3 from "../assets/denta3.jpg";
import Denta4 from "../assets/denta4.jpg";
import Denta5 from "../assets/denta5.png";

import DentaA1 from "../assets/dentaA1.png";
import DentaA2 from "../assets/dentaA2.png";
import DentaA3 from "../assets/dentaA3.png";

const OveralChats = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  // Doctorlar ma'lumotlari
  const allDoctors = [
    { id: 1, img: Denta5, name: "Dr. Omontayev Xayotillo", job: "Terapet", rating: "5.0", isOnline: true },
    { id: 2, img: Denta1, name: "Dr. Jamshid Rahmonov", job: "Ortoped", rating: "4.9", isOnline: false },
    { id: 3, img: Denta2, name: "Dr. O'tkir Rustamov", job: "Terapevt", rating: "4.9", isOnline: true },
    { id: 4, img: Denta3, name: "Dr. Asadbek Luqmonov", job: "Jarroh", rating: "3.9", isOnline: false },
    { id: 5, img: Denta4, name: "Dr. Lobar Azizova", job: "Implantolog", rating: "3.7", isOnline: true },

    { id: 6, img: Denta4, name: "Dr. Lobar Azizova", job: "Implantolog", rating: "4.4", distance: "2 km", price: "255 000", location: "Namangan vil., Davlatobod t., 5-kichik nohiya, 34.", clinic: "Markaziy Poliklinika", is247: false,  patients: "120", exp: "10", service: true },
    { id: 7, img: DentaA1, name: "Dr. Marjona Nazarmatova", job: "Implantolog", rating: "4.1", distance: "3 km", price: "125 000", location: "Namangan vil., Davlatobod t., 5-kichik nohiya, 34.", clinic: "Markaziy Poliklinika", is247: false,  patients: "120", exp: "25", service: true },
    { id: 8, img: DentaA2, name: "Dr. Mubina Jalilova", job: "Implantolog", rating: "4.2", distance: "3.1 km", price: "200 000", location: "Namangan vil., Davlatobod t., 5-kichik nohiya, 34.", clinic: "Markaziy Poliklinika", is247: false,  patients: "120", exp: "10", service: true },
    { id: 9, img: DentaA3, name: "Dr. Aziza Xolmatova", job: "Implantolog", rating: "3.7", distance: "3.2 km", price: "255 000", location: "Namangan vil., Davlatobod t., 5-kichik nohiya, 34.", clinic: "Smile Dental clinic", is247: true,  patients: "120", exp: "5", service: true },
    { id: 10, img: Denta4, name: "Dr. Lobar Azizo,va (2)", job: "Implantolog", rating: "3.6", distance: "3.4 km", price: "155 000", location: "Namangan vil., Davlatobod t., 5-kichik nohiya, 34.", clinic: "Smile Dental clinic", is247: true,  patients: "120", exp: "15", service: true },



    {
      id: 11,
      name: "Dr. Nodira Karimova",
      specialty: "Ortodont",
      rating: 5.0,
      clinic: "Tibbiy Klinika",
      distance: "350 m",
      nextAvailable: "Dushanba, 6 Iyul 2023 • 07:00",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
      position: { top: '30%', left: '50%' },
      gender: 'female',
      region: 'Toshkent',
      fullImg: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
      patients: "180 ta bemor",
      exp: "8+ yil",
      price: "300 000 so'm",
      location: "Toshkent sh., Yunusobod t., 15-uy",
      is247: true,
      isOnline: true,
      job: "Ortodont"
    },
    {
      id: 12,
      name: "Dr. Jahongir Ergashev",
      specialty: "Umumiy Stomatolog",
      rating: 4.7,
      clinic: "Tish Davolash Markazi",
      distance: "520 m",
      nextAvailable: "Seshanba, 7 Iyul 2023 • 09:00",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
      position: { top: '55%', left: '25%' },
      gender: 'male',
      region: 'Samarqand',
      fullImg: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
      patients: "220 ta bemor",
      exp: "10+ yil",
      price: "280 000 so'm",
      location: "Samarqand sh., Registon ko'chasi, 25-uy",
      is247: false,
      isOnline: true,
      job: "Umumiy Stomatolog"
    },
    {
      id: 13,
      name: "Dr. Malika Nurmatova",
      specialty: "Ortodont",
      rating: 4.9,
      clinic: "Tabassum Klinikasi",
      distance: "780 m",
      nextAvailable: "Dushanba, 6 Iyul 2023 • 14:00",
      avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop",
      position: { top: '20%', left: '75%' },
      gender: 'female',
      region: 'Buxoro',
      fullImg: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
      patients: "150 ta bemor",
      exp: "6+ yil",
      price: "320 000 so'm",
      location: "Buxoro sh., Labi Hovuz ko'chasi, 10-uy",
      is247: true,
      isOnline: false,
      job: "Ortodont"
    },
    {
      id: 14,
      name: "Dr. Aziz Rakhimov",
      specialty: "Bolalar Stomatolgi",
      rating: 4.8,
      clinic: "Bolalar Tish Klinikasi",
      distance: "420 m",
      nextAvailable: "Chorshanba, 8 Iyul 2023 • 10:00",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop",
      position: { top: '25%', left: '30%' },
      gender: 'male',
      region: 'Toshkent',
      fullImg: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
      patients: "200 ta bemor",
      exp: "9+ yil",
      price: "290 000 so'm",
      location: "Toshkent sh., Chilonzor t., 45-uy",
      is247: false,
      isOnline: true,
      job: "Bolalar Stomatolgi"
    },
    {
      id: 15,
      name: "Dr. Dilnoza Sharipova",
      specialty: "Kosmetik Stomatolog",
      rating: 4.6,
      clinic: "Estetik Tabassum",
      distance: "890 m",
      nextAvailable: "Payshanba, 9 Iyul 2023 • 13:00",
      avatar: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=100&h=100&fit=crop",
      position: { top: '50%', left: '80%' },
      gender: 'female',
      region: 'Farg\'ona',
      fullImg: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop",
      patients: "170 ta bemor",
      exp: "7+ yil",
      price: "350 000 so'm",
      location: "Farg'ona sh., Mustaqillik ko'chasi, 33-uy",
      is247: true,
      isOnline: true,
      job: "Kosmetik Stomatolog"
    },
    {
      id: 16,
      name: "Dr. Jamshid Ismoilov",
      specialty: "Ortodont",
      rating: 4.9,
      clinic: "Zamonaviy Stomatologiya",
      distance: "650 m",
      nextAvailable: "Juma, 10 Iyul 2023 • 11:00",
      avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop",
      position: { top: '65%', left: '55%' },
      gender: 'male',
      region: 'Andijon',
      fullImg: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop",
      patients: "210 ta bemor",
      exp: "11+ yil",
      price: "310 000 so'm",
      location: "Andijon sh., Boburshox ko'chasi, 18-uy",
      is247: false,
      isOnline: false,
      job: "Ortodont"
    },
    {
      id: 17,
      name: "Dr. Sevara Abdullayeva",
      specialty: "Umumiy Stomatolog",
      rating: 4.7,
      clinic: "Sog'lom Tish",
      distance: "480 m",
      nextAvailable: "Shanba, 11 Iyul 2023 • 08:00",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
      position: { top: '45%', left: '15%' },
      gender: 'female',
      region: 'Namangan',
      fullImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      patients: "190 ta bemor",
      exp: "8+ yil",
      price: "270 000 so'm",
      location: "Namangan sh., Navoiy ko'chasi, 22-uy",
      is247: true,
      isOnline: true,
      job: "Umumiy Stomatolog"
    }

  ];

  // Chatlarni localStorage'dan olish - FAQAAT XABAR BORLAR
  useEffect(() => {
    const loadChats = () => {
      const loadedChats = allDoctors.map(doctor => {
        const storageKey = `chatMessages_${doctor.id}`;
        const savedMessages = localStorage.getItem(storageKey);
        const messages = savedMessages ? JSON.parse(savedMessages) : [];

        // Faqat xabari bor doctorlarni olish
        if (messages.length === 0) {
          return null;
        }

        // Oxirgi xabarni topish
        const lastMessage = messages[messages.length - 1];
        let lastMessageText = lastMessage
          ? (lastMessage.type === 'voice' ? '🎤 Ovozli xabar' : lastMessage.text)
          : '';

        // Matn juda uzun bo'lsa qisqartirish
        if (lastMessageText.length > 25) {
          lastMessageText = lastMessageText.substring(0, 25) + '...';
        }

        // Vaqtni formatlash
        const lastMessageTime = lastMessage ? formatMessageTime(lastMessage.time) : '';

        // O'qilmagan xabarlar soni (doctor yuborgan xabarlar)
        const unreadCount = messages.filter(msg =>
          msg.sender === 'doctor' && !msg.read
        ).length;

        // Oxirgi xabar vaqti (sort qilish uchun)
        const lastMessageDateTime = lastMessage ? getMessageDateTime(lastMessage.time) : new Date(0);

        return {
          ...doctor,
          lastMessage: lastMessageText,
          time: lastMessageTime || '',
          unread: unreadCount,
          messageCount: messages.length,
          lastMessageDateTime: lastMessageDateTime
        };
      }).filter(doctor => doctor !== null); // Faqat xabari borlar

      // Oxirgi xabar vaqtiga qarab teskari tartibda sort qilish
      const sortedChats = loadedChats.sort((a, b) => {
        return b.lastMessageDateTime - a.lastMessageDateTime;
      });

      setChats(sortedChats);
    };

    loadChats();
  }, []);

  // Xabarning to'liq vaqtini olish
  const getMessageDateTime = (timeString) => {
    if (!timeString) return new Date(0);

    const now = new Date();
    const [hours, minutes] = timeString.split(':').map(Number);
    const messageDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    return messageDate;
  };

  // Vaqtni formatlash funksiyasi
  const formatMessageTime = (timeString) => {
    if (!timeString) return '';

    const now = new Date();
    const messageDate = getMessageDateTime(timeString);
    const diffMs = now - messageDate;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      return timeString;
    } else if (diffHours < 48) {
      return 'Kecha';
    } else {
      const days = ['Yak', 'Du', 'Se', 'Chor', 'Pay', 'Ju', 'Sha'];
      const dayIndex = messageDate.getDay();
      return days[dayIndex];
    }
  };

  // Search filtrlash
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.job.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xabarni o'qilgan deb belgilash
  const markAsRead = (doctorId) => {
    const storageKey = `chatMessages_${doctorId}`;
    const savedMessages = localStorage.getItem(storageKey);
    if (savedMessages) {
      const messages = JSON.parse(savedMessages);
      const updatedMessages = messages.map(msg =>
        msg.sender === 'doctor' ? { ...msg, read: true } : msg
      );
      localStorage.setItem(storageKey, JSON.stringify(updatedMessages));

      // UI ni yangilash
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === doctorId ? { ...chat, unread: 0 } : chat
        )
      );
    }
  };

  // Chatga qo'ng'iroq qilish
  const makeCall = (doctorId, e) => {
    e.stopPropagation();
    const doctor = allDoctors.find(d => d.id === doctorId);
    if (doctor) {
      alert(`Dr. ${doctor.name} ga qo'ng'iroq qilinmoqda...`);
    }
  };

  // Video qo'ng'iroq
  const makeVideoCall = (doctorId, e) => {
    e.stopPropagation();
    const doctor = allDoctors.find(d => d.id === doctorId);
    if (doctor) {
      alert(`Dr. ${doctor.name} bilan video qo'ng'iroq boshlanmoqda...`);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/boshsaxifa')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Chatlar</h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Doktorlarni qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Chats List */}
      <div className="p-2">
        {chats.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="text-gray-300 text-7xl mb-4">
              <MessageSquare className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Hozircha chatlar yo'q</h3>
            <p className="text-gray-500 mb-6">
              Doktorlar bilan chat qilish uchun avval ular bilan xabar almashing
            </p>
            <button
              onClick={() => navigate('/boshsaxifa')}
              className="bg-[#00C1F3] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
            >
              Doktorlarni ko'rish
            </button>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-600">Qidiruv natijasi yo'q</h3>
            <p className="text-gray-400 mt-1">
              "{searchTerm}" bo'yicha chatlar topilmadi
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="px-2 py-3">
              <p className="text-sm text-gray-500">
                {filteredChats.length} ta faol chat
              </p>
            </div>

            {filteredChats.map((chat) => (
              <Link
                key={chat.id}
                to={`/chat/${chat.id}`}
                onClick={() => markAsRead(chat.id)}
                className="block"
              >
                <div className="flex items-center p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer border-b border-gray-100">
                  {/* Doctor Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={chat.img}
                      alt={chat.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                    />
                    {/* Online status */}
                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${chat.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 ml-3 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-800 truncate">{chat.name}</h3>
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                            {chat.job}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-yellow-600 font-medium">⭐ {chat.rating}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {chat.isOnline ? '🟢 Online' : '⚫ Offline'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-400 mb-1">{chat.time}</span>
                        {chat.unread > 0 && (
                          <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[20px] text-center">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Last Message & Actions */}
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-600 truncate max-w-[180px]">
                        {chat.lastMessage || `${chat.messageCount} ta xabar`}
                      </p>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => makeVideoCall(chat.id, e)}
                          className="text-blue-500 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transition"
                        >
                          <Video size={18} />
                        </button>
                        <button
                          onClick={(e) => makeCall(chat.id, e)}
                          className="text-green-500 hover:text-green-600 p-1.5 rounded-full hover:bg-green-50 transition"
                        >
                          <Phone size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};

export default OveralChats;
