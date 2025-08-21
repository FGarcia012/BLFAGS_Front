import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { UserProfile } from '../../components/user/UserProfile';
import './UserProfilePage.css';

const shootingStarColors = ["#1e40af", "#3b82f6", "#60a5fa"];
const particleColors = ["#1e40af", "#3b82f6", "#60a5fa", "#93c5fd"];

const shootingStarVariants = {
  hidden: { opacity: 0, x: 0, y: 0 },
  visible: (custom) => ({
    opacity: [0, 1, 0],
    x: [0, 120 + custom * 60],
    y: [0, 40 * (custom % 2 === 0 ? 1 : -1), 0],
    transition: {
      duration: 1.5,
      delay: custom * 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }),
};

const particleVariants = {
  animate: {
    opacity: [0.3, 0.8, 0.3],
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const UserProfilePage = () => {
    const { userId } = useParams();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const particlesArray = Array(50).fill(0);

    const targetUserId = userId || currentUser._id || currentUser.uid;

    if (!targetUserId) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="user-profile-page">
            {/* Partículas animadas */}
            {particlesArray.map((_, i) => {
                const size = Math.random() * 3 + 1;
                const color = particleColors[i % particleColors.length];
                const top = Math.random() * 100;
                const left = Math.random() * 100;
                return (
                    <motion.div
                        key={`particle-${i}`}
                        className="absolute rounded-full"
                        style={{
                            top: `${top}%`,
                            left: `${left}%`,
                            width: size,
                            height: size,
                            backgroundColor: color,
                            filter: `drop-shadow(0 0 6px ${color})`,
                        }}
                        variants={particleVariants}
                        animate="animate"
                        initial={{ opacity: 0.3, y: 0 }}
                        transition={{
                            duration: 4 + Math.random() * 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.1,
                        }}
                    />
                );
            })}

            {/* Estrellas fugaces */}
            {[...Array(15)].map((_, i) => {
                const color = shootingStarColors[i % shootingStarColors.length];
                return (
                    <motion.div
                        key={`shooting-star-${i}`}
                        custom={i}
                        className="absolute rounded-lg blur-sm"
                        style={{
                            top: `${Math.random() * 80 + 10}%`,
                            left: `${Math.random() * 50}%`,
                            width: 6 + Math.random() * 10,
                            height: 1.5 + Math.random() * 2,
                            rotate: 45,
                            backgroundColor: color,
                            opacity: 0,
                            filter: `drop-shadow(0 0 12px ${color})`,
                        }}
                        variants={shootingStarVariants}
                        initial="hidden"
                        animate="visible"
                    />
                );
            })}

            <div className="user-profile-container">
                <UserProfile userId={targetUserId} />
            </div>
        </div>
    );
};
