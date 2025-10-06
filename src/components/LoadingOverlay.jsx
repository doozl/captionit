import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const LoadingOverlay = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-3xl p-12 shadow-2xl text-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="inline-block"
      >
        <Sparkles className="w-16 h-16 text-indigo-600" />
      </motion.div>
      <motion.h3
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-2xl font-bold text-gray-800 mt-6"
      >
        Analyzing your vibe...
      </motion.h3>
      <p className="text-gray-600 mt-2">Generating the perfect captions 💫</p>
    </motion.div>
  </motion.div>
);

export default LoadingOverlay;
