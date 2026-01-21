// App.jsx
import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { DataProvider } from "./context/DataProvider";
import Login from "./context/Login";           // yangi login bunisi
import Registration from "./context/Registration";
import Boshsaxifa from "./pages/Boshsaxifa";
import ShifokorProfile from "./pages/Shifokorlarim";
import MeningShifokorlarim from "./pages/MeningShifokorlarim";
import Profil_pages from "./pages/profil";
import Notification from "./pages/Notification";
import Yoqtirishlar from "./pages/yoqtirishlar";
import Sharhlar from "./pages/sharhlar";
import B24_7 from "./pages/B24_7";
import EngYaxshi from "./pages/Engyaxshi";
import AyolDoktor from "./pages/AyolDoktor";
import BolalarDoktori from "./pages/BolalarDoktori";
import QabulgaYozilish from "./pages/QabulgayozilishB";
import Engyaqin from "./pages/engyaqin";
import QabulgaYozilish2B from "./pages/QabulgaYozilish2B";
import QabulTasdiqlash from "./pages/QabulTasdiqlash";
import Chat from "./pages/chat";
import OveralChats from "./pages/OveralChats";
import PatientForm from "./pages/PatientForm";
import Sitebar from "./sitebar";

// Eski komponentlar (kerak bo'lmasa o'chirib tashlash mumkin)
import Kirish from "./Components/kirish";
import Kirish2 from "./Components/kirish2";
import Royhatdanotish from "./Components/Royhatdanotish";
import Sms from "./Components/sms";
import Profile from "./Components/profile";
import Saqlandi from "./Components/saqlandi";
import Parol_tiklash from "./Components/parol_tiklash";
import Parol_tiklashNUm from "./Components/parolnitiklashNum";
import ParolniYangilash from "./Components/yangilash";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Sayt ochilganda darhol bosh sahifaga yo'naltirish
    const token = localStorage.getItem("accessToken");

    // Agar token bo'lmasa ham, baribir bosh sahifaga o'tadi
    // (login talab qilinadigan joylarda alohida tekshiriladi)
    if (window.location.pathname === "/" || window.location.pathname === "") {
      navigate("/boshsaxifa", { replace: true });
    }
  }, [navigate]);

  return (
    <DataProvider>
      <div className="">
        <Routes>
          {/* Asosiy sahifa — har doim bosh sahifadan boshlanadi */}
          <Route path="/" element={<Boshsaxifa />} />
          <Route path="/boshsaxifa" element={<Boshsaxifa />} />

          {/* Login va ro'yxatdan o'tish */}
          <Route path="/login" element={<Login />} />
          <Route path="/royhatdanotish" element={<Registration />} />

          {/* Asosiy sahifalar (token talab qilishi shart emas, ichida tekshiriladi) */}
          <Route path="/shifokorlar/:id" element={<ShifokorProfile />} />
          <Route path="/mening-shifokorlarim" element={<MeningShifokorlarim />} />
          <Route path="/profil" element={<Profil_pages />} />
          <Route path="/Notification" element={<Notification />} />
          <Route path="/yoqtirishlar" element={<Yoqtirishlar />} />
          <Route path="/sharhlar" element={<Sharhlar />} />
          <Route path="/B24_7" element={<B24_7 />} />
          <Route path="/EngYaxshi" element={<EngYaxshi />} />
          <Route path="/AyolDoktor" element={<AyolDoktor />} />
          <Route path="/BolalarDoktori" element={<BolalarDoktori />} />
          <Route path="/engyaqin" element={<Engyaqin />} />

          {/* Qabulga yozilish — ichida token tekshiriladi */}
          <Route path="/qabulgayozilish" element={<QabulgaYozilish />} />
          <Route path="/qabulgayozilish2" element={<QabulgaYozilish2B />} />
          <Route path="/qabultasdiqlash" element={<QabulTasdiqlash />} />
          <Route path="/patient-form" element={<PatientForm />} />

          {/* Chatlar */}
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/chats" element={<OveralChats />} />

          {/* Eski route'lar (agar kerak bo'lmasa keyinchalik o'chiriladi) */}
          <Route path="/kirish2" element={<Kirish2 />} />
          <Route path="/sms" element={<Sms />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/saqlandi" element={<Saqlandi />} />
          <Route path="/Parol_tiklash" element={<Parol_tiklash />} />
          <Route path="/Parol_tiklashNum" element={<Parol_tiklashNUm />} />
          <Route path="/yangilash" element={<ParolniYangilash />} />
        </Routes>

        <Sitebar />
      </div>
    </DataProvider>
  );
};

export default App;
