import React, { useRef, useState } from 'react';
import { FaChevronLeft, FaCamera, FaMapMarkerAlt, FaUserAlt, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const DEFAULT_CENTER = [40.9995, 71.6444];

function LocationMarker({ onSelect }) {
  useMapEvents({
    click(e) {
      const pos = [e.latlng.lat, e.latlng.lng];
      onSelect(pos, `Lat ${pos[0].toFixed(4)}, Lng ${pos[1].toFixed(4)}`);
    },
  });
  return null;
}

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false); // Foto modal uchun state
  const [coords, setCoords] = useState(DEFAULT_CENTER);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      address: '',
    },
  });

  const onSubmit = (data) => {
    console.log('SAQLANDI ✅', { ...data, profileImage, coords });
    navigate('/saqlandi');
  };

  // Modalni ochish
  const openPhotoModal = () => setIsPhotoModalOpen(true);

  // "Ha" bosilganda galereyani ochish
  const handleConfirmPhoto = () => {
    setIsPhotoModalOpen(false);
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleLocationSelect = (pos, addressText) => {
    setCoords(pos);
    setValue('address', addressText, { shouldValidate: true });
    setIsMapOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center font-sans">
      <div className="w-full max-w-[450px] bg-white shadow-xl relative">

        {/* Header qismi */}
        <div className="h-[200px] bg-[#00BCE4] rounded-b-[40px] relative p-5">
          <FaChevronLeft
            className="absolute top-5 left-5 text-white text-2xl cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h2 className="text-white text-xl font-semibold text-center mt-[130px]">
            Ma'lumotlarni kiriting
          </h2>

          {/* Profil rasm qismi */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-[65px]
                       w-[110px] h-[110px] bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg border-4 border-white"
            onClick={openPhotoModal}
          >
            {profileImage ? (
              <img src={profileImage} className="w-full h-full rounded-full object-cover" alt="Profile" />
            ) : (
              <FaUserAlt className="text-[60px] text-gray-400" />
            )}
            <div className="absolute right-[-5px] top-0 bg-green-500 w-[35px] h-[35px] rounded-full flex items-center justify-center border-2 border-white">
              <FaCamera className="text-white text-sm" />
            </div>
          </div>
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />

        {/* Form qismi */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 pt-10 space-y-6">
          <Controller
            name="firstName"
            control={control}
            rules={{ required: 'Ism majburiy' }}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Ism"
                className={`w-full h-[55px] rounded-[15px] px-4 border transition-all outline-none
                ${errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-[#00BCE4]'}`}
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            rules={{ required: 'Familiya majburiy' }}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Familiya"
                className={`w-full h-[55px] rounded-[15px] px-4 border transition-all outline-none
                ${errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-[#00BCE4]'}`}
              />
            )}
          />

          <Controller
            name="address"
            control={control}
            rules={{ required: 'Manzil tanlanmagan' }}
            render={({ field }) => (
              <div>
                <p className="mb-2 text-sm text-gray-500 ml-1">
                  {field.value || 'Manzil tanlanmagan'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsMapOpen(true)}
                  className="w-full h-[50px] border-2 border-[#00BCE4] text-[#00BCE4] rounded-[15px] font-medium hover:bg-cyan-50 transition-colors"
                >
                  <FaMapMarkerAlt className="inline mr-2" />
                  Manzilni tanlash
                </button>
              </div>
            )}
          />

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full h-[55px] rounded-[15px] text-white font-bold text-lg shadow-lg transition-all
            ${isValid ? 'bg-green-500 active:scale-95' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            Saqlash
          </button>
        </form>
      </div>

      {/* Rasm yuklash uchun MODAL */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPhotoModalOpen(false)}></div>
          <div className="bg-white w-full max-w-[350px] rounded-[25px] p-6 z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCamera className="text-[#00BCE4] text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Profil rasmi</h3>
              <p className="text-gray-500 mb-8">Rostdan ham profilga rasm joylamoqchimisiz?</p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="flex-1 py-3 bg-red-500 text-white rounded-[12px] font-bold shadow-md active:scale-95 transition-all"
                >
                  Yo'q
                </button>
                <button
                  onClick={handleConfirmPhoto}
                  className="flex-1 py-3 bg-[#00BCE4] text-white rounded-[12px] font-bold shadow-md active:scale-95 transition-all"
                >
                  Ha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Xarita Modali */}
      {isMapOpen && (
        <div className="fixed inset-0 z-[999] bg-black/50 flex justify-center items-end">
          <div className="w-full max-w-[450px] h-[80vh] bg-white rounded-t-[30px] p-4 relative shadow-2xl">
            <button 
              onClick={() => setIsMapOpen(false)}
              className="absolute top-4 right-4 z-[1001] bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md"
            >
              <FaTimes className="text-gray-600" />
            </button>
            <div className="h-full rounded-[20px] overflow-hidden">
                <MapContainer center={coords} zoom={14} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker onSelect={handleLocationSelect} />
                <Marker position={coords} />
                </MapContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;