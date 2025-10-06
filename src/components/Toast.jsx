import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const Toast = ({ message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 z-50"
  >
    <Check className="w-5 h-5 text-green-400" />
    <span className="font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 hover:text-gray-300">
      <X className="w-4 h-4" />
    </button>
  </motion.div>
);

export default Toast;
