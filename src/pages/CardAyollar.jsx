import React from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const FEMALE_ACCENT = '#F269CD';
const DARK_TEXT = '#272937';
const GREEN_BADGE = '#4cd964';

function CardAyollar({ id, img, name, job, rating, distance, price, patients, exp, service }) {
  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transform hover:shadow-xl transition duration-300">
      {/* Image */}
      <div className="relative w-full h-[140px] rounded-t-2xl overflow-hidden">
        <img src={img} className="w-full h-full object-cover" alt={name} />

        <div className={`absolute bottom-0 left-0 w-full h-[60px] bg-gradient-to-t from-[${FEMALE_ACCENT}] to-transparent opacity-90`}></div>

        <div className="absolute bottom-2 left-2 flex items-center gap-3 text-white text-sm font-semibold">
          <span className="flex items-center gap-1">
            <FaStar className="text-yellow-300 text-base" /> {rating}
          </span>
          <span className="flex items-center gap-1">
            <HiOutlineLocationMarker className="text-white text-base" /> {distance}
          </span>
        </div>

        {service && (
          <div className={`absolute top-2 right-2 bg-white text-[${GREEN_BADGE}] text-xs px-2 py-1 rounded-full font-bold shadow-md`}>
            24/7
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-3 py-3">
        <p className={`font-bold text-base leading-5 text-[${DARK_TEXT}]`}>{name}</p>
        <p className={`text-[${FEMALE_ACCENT}] text-sm font-medium`}>{job}</p>

        <div className={`flex items-center gap-4 mt-2 text-xs font-semibold text-[${FEMALE_ACCENT}]/80`}>
          <span>{patients} ta bemor</span>
          <span>{exp}+ tajriba</span>
        </div>

        <p className={`font-bold text-sm mt-2 text-[${DARK_TEXT}]`}>
          {price} so’m o‘rtacha narx
        </p>

        {/* DINAMIK LINK + state bilan ma'lumot uzatish */}
        <Link
          to={`/shifokorlar/${id}`}
          state={{
            doctor: { id, img, name, job, rating, distance, price, patients, exp, service }
          }}
        >
          <button className={`w-full bg-[${FEMALE_ACCENT}] text-white py-2.5 rounded-full mt-3 text-base font-semibold transition hover:bg-pink-600 shadow-md shadow-pink-300`}>
            Profilni ko‘rish
          </button>
        </Link>
      </div>
    </div>
  );
}

export default CardAyollar;