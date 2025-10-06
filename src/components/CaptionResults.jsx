import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import Toast from "./Toast";
import { MOCK_CAPTIONS } from "../constants/captions";

const CaptionResults = ({ onBack }) => {
  const [toast, setToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setToast("Caption copied!");
    setTimeout(() => {
      setCopiedId(null);
      setToast(null);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-6xl mx-auto"
    >
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="mb-8 px-6 py-3 bg-white rounded-full shadow-lg font-semibold text-gray-700 hover:shadow-xl transition-shadow"
      >
        ← Upload New Image
      </motion.button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_CAPTIONS.map((category, idx) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{category.emoji}</span>
              <h3 className="text-xl font-bold text-gray-800">
                {category.title}
              </h3>
            </div>
            <div className="space-y-3">
              {category.captions.map((caption) => {
                const uniqueId = `${category.id}-${caption.id}`;
                return (
                  <motion.div
                    key={caption.id}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-pink-50 transition-colors group"
                  >
                    <p className="flex-1 text-gray-700">{caption.text}</p>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyToClipboard(caption.text, uniqueId)}
                      className="p-2 rounded-lg hover:bg-white transition-colors"
                    >
                      {copiedId === uniqueId ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                      )}
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default CaptionResults;
