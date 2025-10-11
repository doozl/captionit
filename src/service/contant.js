const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const BASE_URL = isLocalhost
  ? "http://localhost:5050"
  : "https://captionit.onrender.com";

export const ENDPOINTS = {
  GENERATE_CAPTION: `${BASE_URL}/api/generate-caption`,
};
