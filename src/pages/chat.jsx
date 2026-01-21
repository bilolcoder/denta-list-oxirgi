import React, { useState, useEffect, useRef } from 'react'; // useNavigate ni olib tashlang
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Send, ArrowLeft, Phone, Mic, StopCircle, Play, Trash2, Edit, MoreVertical, Video } from 'lucide-react';

// Doctorlar ma'lumotlari
import Denta1 from "../assets/denta1.jpg";
import Denta2 from "../assets/denta2.jpg";
import Denta3 from "../assets/denta3.jpg";
import Denta4 from "../assets/denta4.jpg";
import Denta5 from "../assets/denta5.png";

import DentaA1 from "../assets/dentaA1.png";
import DentaA2 from "../assets/dentaA2.png";
import DentaA3 from "../assets/dentaA3.png";

// ... qolgan kod

    const allDoctors = [
      { id: 1, img: Denta5, name: "Dr. Omontayev Xayotillo", job: "Terapet", rating: "5.0", patients: "200 ta bemor", exp: "3+ yil", price: "350 000 so'm", location: "Namangan vil., Davlatobod t., 5-kichik nohiya, 34.", clinic: "Markaziy Poliklinika", is247: false, isOnline: true },
      { id: 2, img: Denta1, name: "Dr. Jamshid Rahmonov", job: "Ortoped", rating: "4.9", patients: "254 ta bemor", exp: "12+ yil", price: "250 000 so'm", location: "Namangan vil., Davlatobod t., 5-kichik nohiya, 34.", clinic: "Smile Dental clinic", is247: true, isOnline: false },
      { id: 3, img: Denta2, name: "Dr. O'tkir Rustamov", job: "Terapevt", rating: "4.9", patients: "124 ta bemor", exp: "10+ yil", price: "255 000 so'm", location: "Toshkent sh., Yunusobod t., Amir Temur ko'chasi 15", clinic: "Shifo Nur Clinic", is247: false, isOnline: true },
      { id: 4, img: Denta3, name: "Dr. Asadbek Luqmonov", job: "Jarroh", rating: "3.9", patients: "254 ta bemor", exp: "12+ yil", price: "250 000 so'm", location: "Farg'ona sh., Sanoat ko'chasi, 1-uy", clinic: "Med Grand", is247: true, isOnline: false },
      { id: 5, img: Denta4, name: "Dr. Lobar Azizova", job: "Implantolog", rating: "3.7", patients: "120 ta bemor", exp: "10+ yil", price: "255 000 so'm", location: "Namangan vil., Davlatobod t., 5-kichik nohiya, 34.", clinic: "Xususiy Klinika", is247: false, isOnline: true },

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

  export default function DoctorChatApp() {
    const { id } = useParams();
    const navigate = useNavigate();

    const currentDoctor = allDoctors.find(doc => doc.id === parseInt(id));

    useEffect(() => {
      if (!currentDoctor) {
        navigate('/chats');
      }
    }, [currentDoctor, navigate]);

    const storageKey = `chatMessages_${id}`;
    const [messages, setMessages] = useState(() => {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    });

    const [newMessage, setNewMessage] = useState("");
    const [contextMenu, setContextMenu] = useState({
      show: false,
      x: 0,
      y: 0,
      messageId: null,
      messageType: null
    });
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const messagesEndRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioRef = useRef(null);
    const timerRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }, [messages, storageKey]);

    useEffect(() => {
      if (messagesContainerRef.current) {
        scrollToBottom();
      }
    }, [messages]);

    useEffect(() => {
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 100);
        textarea.style.height = newHeight + 'px';
      }
    }, [newMessage]);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setRecordedAudio({ blob: audioBlob, url: audioUrl });
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        setRecordingTime(0);

        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);

      } catch (error) {
        console.error('Mikrofonga kirishda xato:', error);
        alert('Mikrofon ruxsatini tekshiring!');
      }
    };

    const stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        clearInterval(timerRef.current);
      }
    };

    const sendVoiceMessage = () => {
      if (!recordedAudio) return;

      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newMsg = {
        id: Date.now(),
        text: "",
        sender: "user",
        time: time,
        type: "voice",
        audioUrl: recordedAudio.url,
        duration: recordingTime,
        read: true
      };

      setMessages([...messages, newMsg]);
      setRecordedAudio(null);
      setRecordingTime(0);
      scrollToBottom();
    };

    const handleSend = () => {
      if (newMessage.trim()) {
        const now = new Date();
        const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const newMsg = {
          id: Date.now(),
          text: newMessage,
          sender: "user",
          time: time,
          type: "text",
          read: true
        };

        setMessages([...messages, newMsg]);
        setNewMessage("");
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
        scrollToBottom();
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    const handleTextareaChange = (e) => {
      setNewMessage(e.target.value);
    };

    const toggleAudioPlay = (audioUrl) => {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
      }

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        audioRef.current.onended = () => setIsPlaying(false);
      }
    };

    const handleMessageClick = (e, messageId, messageType) => {
      if (e.button !== 0) return;

      const messageElement = e.currentTarget;
      const rect = messageElement.getBoundingClientRect();

      setContextMenu({
        show: true,
        x: rect.left,
        y: rect.bottom + 5,
        messageId: messageId,
        messageType: messageType
      });
    };

    useEffect(() => {
      const handleClick = () => {
        setContextMenu({ show: false, x: 0, y: 0, messageId: null, messageType: null });
      };
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }, []);

    const handleDelete = (messageId) => {
      setMessages(messages.filter(msg => msg.id !== messageId));
      setContextMenu({ show: false, x: 0, y: 0, messageId: null, messageType: null });
    };

    const handleEdit = (messageId) => {
      const messageToEdit = messages.find(msg => msg.id === messageId);
      if (messageToEdit) {
        setEditingId(messageId);
        setEditText(messageToEdit.text);
      }
      setContextMenu({ show: false, x: 0, y: 0, messageId: null, messageType: null });
    };

    const saveEdit = () => {
      if (editText.trim()) {
        const now = new Date();
        const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        setMessages(messages.map(msg =>
          msg.id === editingId
            ? { ...msg, text: editText, time: time, edited: true }
            : msg
        ));
        setEditingId(null);
        setEditText("");
      }
    };

    const goBack = () => {
      navigate(-1)
    }
    const cancelEdit = () => {
      setEditingId(null);
      setEditText("");
    };

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const makeCall = () => {
      alert(`Dr. ${currentDoctor?.name} ga qo'ng'iroq qilinmoqda...`);
    };

    const makeVideoCall = () => {
      alert(`Dr. ${currentDoctor?.name} bilan video qo'ng'iroq boshlanmoqda...`);
    };

    if (!currentDoctor) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C1F3] mx-auto"></div>
            <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-[91vh] bg-gradient-to-br from-blue-50 to-cyan-50">
        {/* Header */}
        <div className="flex-shrink-0">
          <div className="bg-[#00C1F3] p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={goBack}
                  className="hover:bg-white/20 rounded-full p-2 transition"
                >
                  <ArrowLeft size={24} />
                </button>
                <div>
                  <p className="text-xs">Chatlar</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={makeVideoCall}
                  className="hover:bg-white/20 rounded-full p-2 transition"
                >
                  <Video size={24} />
                </button>
                <button
                  onClick={makeCall}
                  className="hover:bg-white/20 rounded-full p-2 transition"
                >
                  <Phone size={24} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={currentDoctor.img}
                    alt={currentDoctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${currentDoctor.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
              <div>
                <h1 className="text-lg font-bold">{currentDoctor.name}</h1>
                <div className="flex items-center gap-1 text-sm">
                  <span>{currentDoctor.job}</span>
                  <span className="text-yellow-300">⭐ {currentDoctor.rating}</span>
                </div>
                <p className="text-xs opacity-90">{currentDoctor.clinic}</p>
                <p className="text-xs mt-1">
                  {currentDoctor.isOnline ? '🟢 Online' : `⚫ ${currentDoctor.is247 ? '24/7' : '9:00-18:00'}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-200"
        >
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-400 h-full flex items-center justify-center flex-col">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium">Chat boshlang</h3>
              <p className="text-gray-500 mt-1">Dr. {currentDoctor.name} bilan suhbatni boshlang</p>
              <div className="mt-6 space-y-2 text-sm text-gray-600">
              </div>
            </div>
          ) : (
            <>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} relative`}
                  onClick={(e) => handleMessageClick(e, msg.id, msg.type)}
                >
                  <div className={`max-w-xs ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    {msg.sender === 'doctor' && msg.type === 'text' && (
                      <div className="flex items-center gap-2 mb-1">
                        <img
                          src={currentDoctor.img}
                          alt={currentDoctor.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-xs font-medium">{currentDoctor.name.split(' ')[1]}</span>
                      </div>
                    )}

                    {editingId === msg.id ? (
                      <div className={`rounded-2xl px-4 py-2 ${msg.sender === 'user'
                        ? 'bg-[#00C1F3] text-white rounded-tr-sm'
                        : 'bg-white text-gray-800 rounded-tl-sm shadow'
                        }`}>
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full bg-transparent border-none focus:outline-none"
                          autoFocus
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              saveEdit();
                            }
                          }}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={saveEdit}
                            className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Saqlash
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            Bekor qilish
                          </button>
                        </div>
                      </div>
                    ) : msg.type === 'voice' ? (
                      <div
                        className={`rounded-2xl px-4 py-3 ${msg.sender === 'user'
                          ? 'bg-[#00C1F3] text-white rounded-tr-sm'
                          : 'bg-white text-gray-800 rounded-tl-sm shadow'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleAudioPlay(msg.audioUrl)}
                            className="p-2 bg-white/30 rounded-full hover:bg-white/40 transition"
                          >
                            <Play size={16} />
                          </button>
                          <div className="flex-1">
                            <div className="h-1 bg-white/50 rounded-full mb-1">
                              <div className="h-full bg-white w-1/2 rounded-full"></div>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span>{formatTime(msg.duration || 0)}</span>
                              <span>🎤 Ovozli xabar</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`rounded-2xl px-4 py-2 break-words whitespace-pre-wrap cursor-pointer hover:opacity-90 transition ${msg.sender === 'user'
                          ? 'bg-[#00C1F3] text-white rounded-tr-sm max-w-md'
                          : 'bg-white text-gray-800 rounded-tl-sm shadow max-w-md hover:bg-gray-50'
                          }`}
                        style={{
                          maxWidth: '100%',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        <div className="text-sm" style={{
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}>
                          {msg.text}
                        </div>
                        {msg.edited && (
                          <span className="text-xs opacity-70">(tahrirlandi)</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{msg.time}</span>
                      {msg.edited && (
                        <span className="text-xs text-gray-400">• tahrirlandi</span>
                      )}
                      {msg.type === 'voice' && (
                        <span className="text-xs text-gray-400">• 🎤</span>
                      )}
                      {msg.sender === 'user' && (
                        <span className="text-xs text-blue-400">✓{msg.read ? '✓' : ''}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 p-4 bg-white border-t">
          {recordedAudio ? (
            <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAudioPlay(recordedAudio.url)}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  <Play size={16} />
                </button>
                <span className="text-sm">{formatTime(recordingTime)}</span>
              </div>
              <div className="flex-1 h-1 bg-gray-300 rounded-full">
                <div className="h-full bg-blue-500 w-1/2 rounded-full"></div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setRecordedAudio(null)}
                  className="p-2 text-red-500 hover:bg-gray-200 rounded-full"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={sendVoiceMessage}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          ) : isRecording ? (
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="animate-pulse">
                  <Mic size={20} className="text-red-500" />
                </div>
                <div>
                  <div className="text-sm font-medium">Ovoz yozilmoqda...</div>
                  <div className="text-xs text-gray-500">{formatTime(recordingTime)}</div>
                </div>
              </div>
              <button
                onClick={stopRecording}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <StopCircle size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-end gap-2">
              <button
                onClick={startRecording}
                className="p-3 mb-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition flex-shrink-0"
                title="Ovoz yozish"
              >
                <Mic size={20} />
              </button>

              <div className="flex-1 relative min-h-[56px] flex items-center">
                <textarea
                  ref={textareaRef}
                  value={newMessage}
                  onChange={handleTextareaChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Xabar yozing yoki ovoz yozing..."
                  className="w-full px-4 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-none border-none"
                  rows="1"
                  style={{
                    minHeight: '50px',
                    maxHeight: '100px',
                    overflowY: 'auto'
                  }}
                />
              </div>

              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="p-3 mb-1.5 bg-[#00C1F3] text-white rounded-full hover:shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Context Menu */}
        {contextMenu.show && (
          <div
            className="fixed bg-white shadow-lg rounded-lg py-2 z-50 border min-w-[150px]"
            style={{
              top: contextMenu.y,
              left: contextMenu.x,
              transform: 'translateY(-50%)'
            }}
          >
            {contextMenu.messageType === 'text' ? (
              <>
                <button
                  onClick={() => handleEdit(contextMenu.messageId)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                >
                  <Edit size={16} />
                  Tahrirlash
                </button>
                <button
                  onClick={() => handleDelete(contextMenu.messageId)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  O'chirish
                </button>
              </>
            ) : (
              <button
                onClick={() => handleDelete(contextMenu.messageId)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600 flex items-center gap-2"
              >
                <Trash2 size={16} />
                O'chirish
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
