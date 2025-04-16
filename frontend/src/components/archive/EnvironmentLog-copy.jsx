import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const EnvironmentInfo = () => {
  const [environmentData, setEnvironmentData] = useState([]);
  const [formData, setFormData] = useState({
    airTemp: "",
    airPercentHumidity: "",
    soilTemp: "",
    soilPercentHumidity: "",
  });
  const [editId, setEditId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/environments`;

  const fetchEnvironmentData = async () => {
    try {
      const response = await axios.get(API_URL);
      setEnvironmentData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchEnvironmentData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData);
        setEditId(null);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchEnvironmentData();
      setFormData({
        airTemp: "",
        airPercentHumidity: "",
        soilTemp: "",
        soilPercentHumidity: "",
      });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleEdit = (id) => {
    const selectedData = environmentData.find((item) => item._id === id);
    setFormData({
      airTemp: selectedData.airTemp,
      airPercentHumidity: selectedData.airPercentHumidity,
      soilTemp: selectedData.soilTemp,
      soilPercentHumidity: selectedData.soilPercentHumidity,
    });
    setEditId(id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchEnvironmentData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  // Handle calendar date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Filter environment data for the selected date
  const filteredEnvironmentData = environmentData.filter((item) => {
    const itemDate = new Date(item.timestamp);
    return (
      itemDate.getFullYear() === selectedDate.getFullYear() &&
      itemDate.getMonth() === selectedDate.getMonth() &&
      itemDate.getDate() === selectedDate.getDate()
    );
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Environment Info
      </h1>
      Form for Create/Update
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4 max-w-3xl mx-auto"
      >
        <div>
          <label className="block font-medium text-gray-700">
            Air Temperature:
          </label>
          <input
            type="number"
            name="airTemp"
            value={formData.airTemp}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">
            Air Humidity (%):
          </label>
          <input
            type="number"
            name="airPercentHumidity"
            value={formData.airPercentHumidity}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">
            Soil Temperature:
          </label>
          <input
            type="number"
            name="soilTemp"
            value={formData.soilTemp}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">
            Soil Humidity (%):
          </label>
          <input
            type="number"
            name="soilPercentHumidity"
            value={formData.soilPercentHumidity}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          {editId ? "Update Environment Info" : "Add Environment Info"}
        </button>
      </form>
      {/* Flex container for Calendar and Logs Table */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Calendar Section */}
        <div className="w-full md:w-1/3 bg-white shadow p-6 rounded">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Select Date</h2>
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </div>

        {/* Environment Logs Table Section */}
        <div className="w-full md:w-2/3 bg-white shadow p-6 rounded overflow-x-auto">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">
            Environment Info for {selectedDate.toDateString()}
          </h2>
          {filteredEnvironmentData.length === 0 ? (
            <p>No records found for {selectedDate.toDateString()}.</p>
          ) : (
            <table className="w-full table-auto text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 font-medium">Air Temp</th>
                  <th className="px-4 py-2 font-medium">Air Humidity (%)</th>
                  <th className="px-4 py-2 font-medium">Soil Temp</th>
                  <th className="px-4 py-2 font-medium">Soil Humidity (%)</th>
                  <th className="px-4 py-2 font-medium">Timestamp</th>
                  <th className="px-4 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnvironmentData.map((data) => (
                  <tr key={data._id} className="border-b">
                    <td className="px-4 py-2">{data.airTemp}</td>
                    <td className="px-4 py-2">{data.airPercentHumidity}</td>
                    <td className="px-4 py-2">{data.soilTemp}</td>
                    <td className="px-4 py-2">{data.soilPercentHumidity}</td>
                    <td className="px-4 py-2">
                      {new Date(data.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(data._id)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(data._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
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
    </div>
  );
};

export default EnvironmentInfo;
