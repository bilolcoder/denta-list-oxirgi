import React, { useState } from 'react';
import { MapPin, Star, MessageCircle, Calendar, Search, Mic, X, Clock, Baby } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import Map from "../assets/map.png";

const doctors = [
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
    region: "Farg'ona",
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

function DoctorAppointment() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [regionFilter, setRegionFilter] = useState('all');
  const [secondaryFilter, setSecondaryFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [listeningText, setListeningText] = useState('');
  const navigate = useNavigate();

  const filteredDoctors = doctors.filter(doctor => {
    const regionMatch = regionFilter === 'all' || doctor.region === regionFilter;
    let secondaryMatch = true;

    if (secondaryFilter) {
      switch (secondaryFilter.type) {
        case 'gender':
          secondaryMatch = doctor.gender === secondaryFilter.value;
          break;
        case 'specialty':
          if (secondaryFilter.value === 'pediatric') {
            secondaryMatch = doctor.specialty === "Bolalar Stomatolgi";
          }
          break;
        case '247':
          secondaryMatch = doctor.is247 === true;
          break;
        case 'search':
          secondaryMatch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doctor.clinic.toLowerCase().includes(searchQuery.toLowerCase());
          break;
        default:
          secondaryMatch = true;
      }
    }
    return regionMatch && secondaryMatch;
  });

  const regions = ['Toshkent', 'Samarqand', 'Buxoro', 'Farg\'ona', 'Andijon', 'Namangan', 'Xorazm', 'Navoiy', 'Qashqadaryo', 'Surxondaryo', 'Jizzax', 'Sirdaryo', 'Qoraqalpog\'iston'];

  const handleRegionChange = (e) => {
    setRegionFilter(e.target.value);
    if (secondaryFilter?.type === 'search') {
      setSearchQuery('');
      setSecondaryFilter(null);
    }
  };

  const handleGenderChange = (genderType) => {
    if (secondaryFilter?.type === 'gender' && secondaryFilter.value === genderType) {
      setSecondaryFilter(null);
    } else {
      setSecondaryFilter({ type: 'gender', value: genderType });
    }
    setSearchQuery('');
  };

  const handleSpecialtyChange = (specialtyType) => {
    if (secondaryFilter?.type === 'specialty' && secondaryFilter.value === specialtyType) {
      setSecondaryFilter(null);
    } else {
      setSecondaryFilter({ type: 'specialty', value: specialtyType });
    }
    setSearchQuery('');
  };

  const handle247FilterToggle = () => {
    if (secondaryFilter?.type === '247') {
      setSecondaryFilter(null);
    } else {
      setSecondaryFilter({ type: '247', value: true });
    }
    setSearchQuery('');
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      setSecondaryFilter({ type: 'search', value: value });
    } else {
      setSecondaryFilter(null);
    }
  };

  const clearAllFilters = () => {
    setRegionFilter('all');
    setSecondaryFilter(null);
    setSearchQuery('');
  };

  const clearSecondaryFilter = () => {
    setSecondaryFilter(null);
    setSearchQuery('');
  };

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Kechirasiz, brauzeringiz ovozli qidiruvni qo\'llab-quvvatlamaydi.');
      return;
    }

    setSecondaryFilter(null);
    setSearchQuery('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'uz-UZ';
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setListeningText('Gapiring...');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
      }
      if (finalTranscript) {
        setSearchQuery(finalTranscript);
        setSecondaryFilter({ type: 'search', value: finalTranscript });
      }
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="w-full h-screen relative overflow-hidden bg-gray-100 font-sans">
      {/* 1. BACK BUTTON - Eng ustki qatlam */}
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-4 left-4 z-[110] w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition-transform active:scale-90"
      >
        <IoMdArrowBack className='text-2xl text-gray-600' />
      </button>

      {/* Xarita Fon */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${Map})`, filter: 'brightness(0.95)' }}
      />
      <div className="absolute inset-0 bg-white/10 z-0" />

      {/* 2. SEARCH VA FILTERS - z-40 qildik (Sitebar 100 da) */}
      <div className="absolute top-4 left-20 right-4 md:left-1/2 md:-translate-x-1/2 md:w-2/3 lg:w-1/2 z-40">
        <div className={`bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 transition-all duration-300 ${isListening ? 'ring-4 ring-[#00C1F3]/20 border-[#00C1F3]' : ''}`}>
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Shifokor nomini qidiring..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1 outline-none text-sm bg-transparent"
          />
          {(searchQuery || secondaryFilter) && (
            <button onClick={clearSecondaryFilter} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={startVoiceSearch}
            className={`transition-all p-2 rounded-full ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-gray-400 hover:text-[#00C1F3]'}`}
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3 pb-2">
          <button
            onClick={clearAllFilters}
            className={`px-4 py-2 rounded-full text-xs shadow-md transition font-medium ${regionFilter === 'all' && !secondaryFilter ? 'bg-[#00C1F3] text-white' : 'bg-white text-gray-700'}`}
          >
            Hammasi
          </button>

          <select
            value={regionFilter}
            onChange={handleRegionChange}
            className="px-4 py-2 bg-white rounded-full text-xs shadow-md outline-none cursor-pointer text-gray-700 font-medium min-w-[140px]"
          >
            <option value="all">Barcha Viloyatlar</option>
            {regions.map((region) => <option key={region} value={region}>{region}</option>)}
          </select>

          <button
            onClick={() => handleGenderChange('female')}
            className={`px-4 py-2 rounded-full text-xs shadow-md transition font-medium ${secondaryFilter?.type === 'gender' && secondaryFilter.value === 'female' ? 'bg-[#00C1F3] text-white' : 'bg-white text-gray-700'}`}
          >
            Ayol Doktor
          </button>

          <button
            onClick={handle247FilterToggle}
            className={`px-4 py-2 rounded-full text-xs shadow-md transition font-medium flex items-center gap-1 ${secondaryFilter?.type === '247' ? 'bg-[#00C1F3] text-white' : 'bg-white text-gray-700'}`}
          >
            <Clock className="w-3 h-3" /> 24/7
          </button>
        </div>
      </div>

      {/* SHIFOKOR NUQTALARI - z-20 */}
      <div className="absolute m-auto w-[70%] mt-[120px] h-[40%] inset-0 z-20">
        {filteredDoctors.map((doctor) => {
          const isSelected = selectedDoctor?.id === doctor.id;
          return (
            <div
              key={doctor.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-125 ${isSelected ? 'z-50 scale-125' : 'z-10'}`}
              style={{ top: doctor.position.top, left: doctor.position.left }}
              onClick={() => setSelectedDoctor(doctor)}
            >
              <div className="relative group">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg border-2 overflow-hidden transition-all ${isSelected ? 'border-[#00C1F3] ring-4 ring-[#00C1F3]/20' : 'border-white bg-white'}`}>
                  <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white border border-white">
                  {doctor.rating}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DOCTOR CARD - Mobil va Desktop - z-40 */}
      <div className="absolute bottom-[90px] left-0 right-0 md:hidden z-40 px-4">
        <div className="flex justify-center">
          <DoctorCard doctor={selectedDoctor || filteredDoctors[0]} compact />
        </div>
      </div>

      <div className="hidden md:block absolute bottom-24 left-1/2 transform -translate-x-1/2 z-40">
        <DoctorCard doctor={selectedDoctor || filteredDoctors[0]} />
      </div>
    </div>
  );
}

function DoctorCard({ doctor, compact = false }) {
  if (!doctor) return null;
  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl py-4 px-5 ${compact ? 'w-full max-w-[340px]' : 'w-96'} transition-all`}>
      <div className="flex items-start gap-4">
        <div className="relative">
          <img src={doctor.avatar} alt={doctor.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-50" />
          <div className="absolute -bottom-1 -right-1 bg-green-400 w-4 h-4 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg">{doctor.name}</h3>
          <p className="text-xs text-[#00C1F3] font-semibold uppercase tracking-wider">{doctor.specialty}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-gray-700">{doctor.rating}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-xl">
        <MapPin className="w-4 h-4 text-[#00C1F3]" />
        <span className="truncate flex-1">{doctor.clinic}</span>
        <span className="text-[#00C1F3] font-bold">{doctor.distance}</span>
      </div>

      <div className="flex gap-3 mt-5">
        <Link to={`/chat/${doctor.id}`} className="flex-1">
          <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition">
            <MessageCircle className="w-4 h-4" /> Xabar
          </button>
        </Link>
        <Link to={`/qabulga-yozilish/${doctor.id}`} className="flex-1">
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#00C1F3] rounded-xl text-sm font-bold text-white shadow-lg shadow-[#00C1F3]/30 active:scale-95 transition">
            <Calendar className="w-4 h-4" /> Band qilish
          </button>
        </Link>
      </div>
    </div>
  );
}

export default DoctorAppointment;