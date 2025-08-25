import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Eye, PenTool } from "lucide-react";
import { Footer } from "../../components/footer/Footer";

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

export const HomePage = () => {
  const particlesArray = Array(50).fill(0);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <div className="relative flex-1 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white flex flex-col items-center justify-center px-2 sm:px-4 overflow-hidden">

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

      {/* Título principal */}
      <motion.h1
        className="text-5xl md:text-7xl font-extrabold text-center mb-2"
        style={{ 
          background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #1e40af 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        BLFAGS
      </motion.h1>

      {/* Subtítulo */}
      <motion.p
        className="mt-6 text-xl md:text-2xl text-center max-w-4xl text-blue-100 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        🌟 Descubre una nueva forma de <span className="text-blue-300 font-semibold">conectar y expresarte</span>. 
        BLFAGS es tu espacio personal donde cada historia importa y cada voz tiene valor. 
        <br className="hidden md:block" />
        <span className="text-blue-200">
          Únete a mi blog para compartir tus ideas y explora un universo de contenido diverso y auténtico.
        </span>
      </motion.p>

      {/* Información adicional */}
      <motion.div
        className="mt-8 flex flex-col md:flex-row items-center justify-center gap-8 text-blue-200/80 text-sm max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>✨ Explora como invitado sin limitaciones de lectura</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span>🚀 Regístrate para crear y personalizar tu experiencia</span>
        </div>
      </motion.div>

      {/* Botones principales */}
      <motion.div
        className="mt-8 flex flex-col md:flex-row gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          onClick={() => navigate("/auth")}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl transition-all duration-300 transform"
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
          whileTap={{ scale: 0.95 }}
        >
          Iniciar Sesión
        </motion.button>
        
        {/* Botón para ver publicaciones sin autenticación */}
        <motion.button
          onClick={() => navigate("/publications")}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl transition-all duration-300 transform flex items-center justify-center"
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)" }}
          whileTap={{ scale: 0.95 }}
        >
          👁️ Mirar Publicaciones
        </motion.button>
        
        <motion.button
          onClick={() => navigate("/register")}
          className="flex items-center justify-center bg-white/10 backdrop-blur-sm border border-blue-400/30 text-blue-100 hover:text-white hover:bg-blue-500/20 px-8 py-4 rounded-2xl shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Registrarte <ArrowRight className="ml-2" size={20} />
        </motion.button>
      </motion.div>

      {/* Sección de características */}
      <motion.div
        className="mt-16 max-w-6xl w-full grid md:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.3,
            },
          },
        }}
      >
        {[
          {
            icon: Shield,
            title: "Seguridad Avanzada",
            description: "Tu privacidad es nuestra prioridad. Sistema de autenticación robusto con tokens seguros y cifrado de datos de última generación.",
            color: "from-blue-500 to-blue-600"
          },
          {
            icon: Eye,
            title: "Anonimato Inteligente",
            description: "Explora, publica y comenta con total libertad. Tu identidad está protegida - solo tu seudónimo será visible para la comunidad.",
            color: "from-indigo-500 to-indigo-600"
          },
          {
            icon: PenTool,
            title: "Contenido Exclusivo",
            description: "Crea publicaciones públicas para compartir con todos, o mantén tus pensamientos privados solo para ti. Tú decides quién lee tu contenido.",
            color: "from-cyan-500 to-cyan-600"
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-6 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 25px 50px rgba(59, 130, 246, 0.2)",
              border: "1px solid rgba(59, 130, 246, 0.3)"
            }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
            animate={{
              y: [0, -8, 0],
              transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5,
              },
            }}
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-blue-100 mb-3">{item.title}</h3>
            <p className="text-blue-200/80 leading-relaxed text-sm">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>
      </div>
      <Footer/>
    </div>
  );
};
