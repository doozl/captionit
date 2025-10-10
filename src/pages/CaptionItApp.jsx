import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UploadBox from "../components/UploadBox";
import CaptionResults from "../components/CaptionResults";
import LoadingOverlay from "../components/LoadingOverlay";
import { ENDPOINTS } from "../service/contant";

export default function CaptionItApp() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const handleImageUpload = (file) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      // Prefer sending image as base64 if available in preview
      // imagePreview is a data URL (data:mime;base64,XXXX)
      let imageUrl = null;
      let imageBase64 = null;
      if (imagePreview && imagePreview.startsWith("data:")) {
        const base64 = imagePreview.split(",")[1];
        imageBase64 = base64;
      }

      const resp = await fetch(ENDPOINTS.GENERATE_CAPTION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, imageBase64 }),
      });
      const json = await resp.json();
      if (!resp.ok || !json?.success) {
        throw new Error(json?.message || "Failed to generate captions");
      }
      setResults(json.data);
      setShowResults(true);
    } catch (e) {
      console.error(e);
      alert(e.message || "Something went wrong generating captions.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setShowResults(false);
    setImageFile(null);
    setImagePreview(null);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence>
          {!showResults && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mb-12"
            >
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-6xl md:text-7xl font-black bg-gradient-to-r from-indigo-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4"
              >
                CaptionIt
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-xl md:text-2xl text-gray-600 font-medium"
              >
                Turn your photo into the perfect caption ✨
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-sm text-gray-500 mt-2"
              >
                Powered by Doozl AI
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {!showResults ? (
          <UploadBox
            onImageUpload={handleImageUpload}
            preview={imagePreview}
            onGenerate={handleGenerate}
          />
        ) : (
          <CaptionResults onBack={handleBack} results={results} />
        )}
      </div>

      <AnimatePresence>{isLoading && <LoadingOverlay />}</AnimatePresence>
    </div>
  );
}
