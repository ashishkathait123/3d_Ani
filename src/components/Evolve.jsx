import React from 'react';
import { motion } from 'framer-motion';

const Evolve = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
  };

  return (
    <section className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/model/hero.png')" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(200,0,40,0.4) 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.9) 100%)',
          }}
        ></div>
      </div>

      {/* Text Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }} // triggers when 30% of section is visible
      >
        <h1 className="text-5xl sm:text-7xl font-bold text-white max-w-4xl leading-tight mb-6">
          Evolve Your Stories Into Cinematic Universes
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl font-light">
          At Mugafi, guidance and studio expertise sculpt stories into films, microdramas, and multi-format universes, bringing visionary ideas to life at global scale.
        </p>
      </motion.div>
    </section>
  );
};

export default Evolve;
