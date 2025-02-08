import React, { useState } from "react";
import axios from "axios";

const CreateListingPage: React.FC = () => {
  const [formData, setFormData] = useState({
    listing_name: "",
    listing_email: "",
    price: "",
    location: "",
    description: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Step 1: Create a new listing
      const response = await axios.post("http://localhost:5000/api/add-listing", formData);

      if (response.data.listingId) {
        const listingId = response.data.listingId;

        // Step 2: Upload images if selected
        if (selectedFiles) {
          const imageFormData = new FormData();
          Array.from(selectedFiles).forEach((file) => imageFormData.append("images", file));

          await axios.post(`http://localhost:5000/api/upload-images/${listingId}`, imageFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        setMessage("Listing and images uploaded successfully!");
        setFormData({ listing_name: "", listing_email: "", price: "", location: "", description: "" });
        setSelectedFiles(null);
      }
    } catch (error) {
      console.error("Error adding listing:", error);
      setMessage("Failed to add listing. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="">Add a New Listing</h2>

      {message && <p className="">{message}</p>}

      <form onSubmit={handleSubmit}>
        <input type="text" name="listing_name" placeholder="Listing Name" value={formData.listing_name} onChange={handleChange} className="" required />
        <input type="email" name="listing_email" placeholder="Email" value={formData.listing_email} onChange={handleChange} className="" required />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="" required />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="" required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="" required></textarea>
        {/* File input for images */}
        <input type="file" multiple onChange={handleFileChange} className="" />

        <button type="submit" className="">Submit Listing</button>
      </form>
    </div>
  );
};

export default CreateListingPage;
