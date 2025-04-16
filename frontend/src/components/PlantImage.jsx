import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const PlantImageCRUD = () => {
  const [plantImages, setPlantImages] = useState([]);
  const [formData, setFormData] = useState({ name: "", image: "" });
  const [editId, setEditId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAllDates, setShowAllDates] = useState(false);

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/plant-images`;

  // Fetch all plant images
  const fetchPlantImages = async () => {
    try {
      const response = await axios.get(API_URL);
      setPlantImages(response.data);
    } catch (error) {
      console.error("Error fetching plant images:", error);
    }
  };

  useEffect(() => {
    fetchPlantImages();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        // Set maximum dimensions for resizing
        const MAX_WIDTH = 200;
        const MAX_HEIGHT = 200;
        let width = img.width;
        let height = img.height;

        // Resize while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = (width * MAX_HEIGHT) / height;
            height = MAX_HEIGHT;
          }
        }

        // Create a canvas and set its size
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert the image to grayscale
        const imageData = ctx.getImageData(0, 0, width, height);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const avg =
            (imageData.data[i] +
              imageData.data[i + 1] +
              imageData.data[i + 2]) /
            3;
          imageData.data[i] = avg;
          imageData.data[i + 1] = avg;
          imageData.data[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);

        // Convert the canvas to a compressed Base64 image
        const base64String = canvas.toDataURL("image/jpeg", 0.7);
        setFormData({ ...formData, image: base64String });
      };
    };

    reader.readAsDataURL(file);
  };

  // Add or update plant image
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData);
        setEditId(null);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchPlantImages();
      setFormData({ name: "", image: "" });
    } catch (error) {
      console.error("Error saving plant image:", error);
    }
  };

  // Edit plant image
  // const handleEdit = (id) => {
  //   const selectedImage = plantImages.find((img) => img._id === id);
  //   setFormData({ name: selectedImage.name, image: selectedImage.image });
  //   setEditId(id);
  // };

  // Delete plant image
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchPlantImages();
    } catch (error) {
      console.error("Error deleting plant image:", error);
    }
  };

  // Handle calendar date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowAllDates(false);
  };

  // Toggle the showAllDates state
  const toggleShowAllDates = () => {
    setShowAllDates(!showAllDates);
  };

  // Filter plant images based on toggle
  const filteredPlantImages = showAllDates
    ? plantImages
    : plantImages.filter((img) => {
        const imgDate = new Date(img.timestamp);
        return (
          imgDate.getFullYear() === selectedDate.getFullYear() &&
          imgDate.getMonth() === selectedDate.getMonth() &&
          imgDate.getDate() === selectedDate.getDate()
        );
      });

  // Sort filtered images by timestamp (latest first)
  const sortedFilteredPlantImages = [...filteredPlantImages].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  );

  return (
    <div className="p-4 max-w-full mx-auto">
      {/* Top row: Form, Calendar, and Toggle Button in a responsive layout */}
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-6">
        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 border p-4 rounded"
        >
          <div>
            <label className="block mb-1 font-medium text-sm sm:text-base">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-sm sm:text-base">
              Image:
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              required
              className="block w-full text-xs sm:text-sm text-slate-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-xs sm:file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm sm:text-base"
          >
            {editId ? "Update Plant Image" : "Add Plant Image"}
          </button>
        </form>

        {/* Calendar and Toggle Button Section */}
        <div className="flex flex-col justify-start space-y-4">
          <div className="bg-white shadow p-4 rounded">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              className="w-full"
            />
          </div>
          <button
            onClick={toggleShowAllDates}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm sm:text-base"
          >
            {showAllDates ? "Show Selected Date" : "Show All Dates"}
          </button>
        </div>
      </div>

      {/* Table to display sorted and filtered plant images */}
      <div className="overflow-x-auto">
        {sortedFilteredPlantImages.length === 0 ? (
          <p className="text-xs sm:text-sm">
            No records found for {selectedDate.toDateString()}.
          </p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100">
                <th className="py-2 px-4 text-xs sm:text-sm">Name</th>
                <th className="py-2 px-4 text-xs sm:text-sm">Image</th>
                <th className="py-2 px-4 text-xs sm:text-sm">Timestamp</th>
                <th className="py-2 px-4 text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedFilteredPlantImages.map((img) => (
                <tr key={img._id} className="border-b border-gray-200">
                  <td className="py-2 px-4 text-xs sm:text-sm">{img.name}</td>
                  <td className="py-2 px-4">
                    <img
                      src={img.image}
                      alt={img.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover"
                    />
                  </td>
                  <td className="py-2 px-4 text-xs sm:text-sm">
                    {new Date(img.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() => handleDelete(img._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PlantImageCRUD;
