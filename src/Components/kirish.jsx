import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/logo.png";
import './kirish.css';

function Kirish() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/kirish2');
    }, 2000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <img src={Logo} alt="Logo" className="logo" />
    </div>
  );
}

export default Kirish;
