import React, { useState } from "react";
import axios from "axios";
import Navbar from "./NavigationBar";
import Footer from "./Footer";

const CreateListingPage: React.FC = () => {
  const [formData, setFormData] = useState({
    listing_name: "",
    listing_email: "",
    price: "",
    location: "",
    description: "",
  });

  const [message, setMessage] = useState<string | null>(null);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form data to the backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/add-listing", formData);
      setMessage(response.data.message);
      setFormData({ listing_name: "", listing_email: "", price: "", location: "", description: "" });
    } catch (error) {
      console.error("Error adding listing:", error);
      setMessage("Failed to add listing. Please try again.");
    }
  };

  return (
    <div>
      <div>
        <h2 className="text-xl font-bold mb-4 text-center">Add a New Listing</h2>
        
        {message && <p className="text-center text-green-600">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="listing_name"
            placeholder="Listing Name"
            value={formData.listing_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            name="listing_email"
            placeholder="Email"
            value={formData.listing_email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          ></textarea>
          
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Submit Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;