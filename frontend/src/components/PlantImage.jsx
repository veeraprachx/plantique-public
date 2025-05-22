import React, { useState, useEffect } from "react";
import axios from "axios";

const PlantImageCRUD = () => {
  const [plantImages, setPlantImages] = useState([]);

  // YYYY-MM-DD strings for the date inputs
  const todayStr = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);

  // For modal lightbox
  const [lightboxImage, setLightboxImage] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/plant-images`;

  // Fetch images between startDate and endDate (inclusive)
  const fetchPlantImages = async () => {
    try {
      const params = {
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(
          new Date(endDate).setHours(23, 59, 59, 999),
        ).toISOString(),
      };
      const { data } = await axios.get(API_URL, { params });
      setPlantImages(data);
    } catch (error) {
      console.error("Error fetching plant images:", error);
    }
  };

  useEffect(() => {
    fetchPlantImages();
  }, [startDate, endDate]);

  const showToday = () => {
    setStartDate(todayStr);
    setEndDate(todayStr);
  };

  // Open lightbox
  const openLightbox = (img) => {
    setLightboxImage(img);
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxImage(null);
  };

  // Sort descending by timestamp
  const sorted = [...plantImages].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  );

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      {/* Date controls */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={showToday}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Today
          </button>
        </div>
      </div>

      {/* Image gallery */}
      {sorted.length === 0 ? (
        <p className="text-center text-gray-500">
          No images found between {startDate} and {endDate}.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1">
          {sorted.map((img) => (
            <div key={img._id} className="flex flex-col items-center">
              <div
                onClick={() => openLightbox(img)}
                className="cursor-pointer bg-white rounded-lg overflow-hidden shadow transition transform duration-300 ease-out hover:shadow-lg hover:scale-105 hover:-translate-y-1"
              >
                <img
                  src={img.image}
                  alt={img.name}
                  className="w-full h-40 object-cover"
                />
              </div>
              <p className="mt-2 text-xs text-gray-800 text-center pointer-events-none">
                {new Date(img.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-3xl max-h-full overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* <button
              onClick={closeLightbox}
              className="absolute top-2 right-2 text-white text-2xl font-bold"
            >
              &times;
            </button> */}
            <img
              src={lightboxImage.image}
              alt={lightboxImage.name}
              className="w-full h-auto rounded"
            />
            <p className="mt-2 text-white text-center">
              {new Date(lightboxImage.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantImageCRUD;
