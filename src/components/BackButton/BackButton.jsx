import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, FileText } from 'lucide-react';
import './BackButton.css';

export const BackButton = ({ to = '/', text = 'Volver', icon = 'home', variant = 'primary' }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(to);
    };

    const getIcon = () => {
        switch (icon) {
            case 'home':
                return <Home size={18} />;
            case 'publications':
                return <FileText size={18} />;
            case 'arrow':
                return <ArrowLeft size={18} />;
            default:
                return <ArrowLeft size={18} />;
        }
    };

    return (
        <button 
            onClick={handleClick}
            className={`back-button back-button--${variant}`}
        >
            {getIcon()}
            <span>{text}</span>
        </button>
    );
};
