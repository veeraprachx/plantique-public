import React, { useState, useEffect } from "react";
import axios from "axios";

const ImageAnalysis = () => {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({ image: "" });
  const [loading, setLoading] = useState(false);

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/melon-images`;

  // fetch all analyses
  const fetchRecords = async () => {
    try {
      const res = await axios.get(API_URL);
      setRecords(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // resize & compress, but keep full color
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const MAX_DIMENSION = 200;
        let { width, height } = img;
        if (width > height && width > MAX_DIMENSION) {
          height = (height * MAX_DIMENSION) / width;
          width = MAX_DIMENSION;
        } else if (height >= width && height > MAX_DIMENSION) {
          width = (width * MAX_DIMENSION) / height;
          height = MAX_DIMENSION;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const base64FullColor = canvas
          .toDataURL("image/jpeg", 0.7)
          .split(",")[1];
        setFormData({ image: base64FullColor });
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return;
    setLoading(true);
    try {
      await axios.post(API_URL, formData);
      setFormData({ image: "" });
      fetchRecords();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // DELETE handler
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchRecords();
    } catch (e) {
      console.error("Failed to delete:", e);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mx-auto w-full ">
      <form onSubmit={handleSubmit} className="border p-4 rounded mb-6">
        <label className="block mb-2 font-medium text-base sm:text-lg">
          Analyze the melon plant based on its leaves
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block mb-4 w-full text-sm text-gray-600
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
        >
          {loading ? "Analyzing…" : "Analyze & Save"}
        </button>
      </form>

      <div className="space-y-6">
        {records.map((r) => (
          <div
            key={r._id}
            className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 border-b pb-4"
          >
            <img
              src={`data:image/jpeg;base64,${r.image}`}
              alt="melon"
              className="w-full sm:w-40 h-auto object-cover rounded"
            />
            <div className="flex-1 space-y-2">
              <p className="text-xs sm:text-sm text-gray-500">
                {new Date(r.timestamp).toLocaleString()}
              </p>
              <pre className="text-sm sm:text-base bg-gray-100 p-3 rounded break-words whitespace-pre-wrap">
                {r.description}
              </pre>
            </div>
            <button
              onClick={() => handleDelete(r._id)}
              className="self-start bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageAnalysis;
