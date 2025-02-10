import React, { useState, useEffect } from "react";
import Navbar from "./NavigationBar";
import Footer from "./Footer";
import "../assets/css/MarketPage.css";
import axios from "axios";

const MarketPage: React.FC = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [images, setImages] = useState<{ [key: string]: string[] }>({});
  const [imageIndex, setImageIndex] = useState<{ [key: string]: number }>({}); // Per-listing image index

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/get-listings")
      .then((response) => {
        setListings(response.data);
        response.data.forEach((listing: any) => {
          fetchImages(listing.id);
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const fetchImages = async (listingId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/get-listing-images/${listingId}`
      );
      setImages((prevImages) => ({
        ...prevImages,
        [listingId]: response.data.images || [],
      }));
      setImageIndex((prevIndexes) => ({
        ...prevIndexes,
        [listingId]: 0, // Initialize index for each listing
      }));
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const nextImage = (listingId: string) => {
    setImageIndex((prevIndexes) => {
      const currentIndex = prevIndexes[listingId] || 0;
      const totalImages = images[listingId]?.length || 1;
      return { ...prevIndexes, [listingId]: (currentIndex + 1) % totalImages };
    });
  };

  const prevImage = (listingId: string) => {
    setImageIndex((prevIndexes) => {
      const currentIndex = prevIndexes[listingId] || 0;
      const totalImages = images[listingId]?.length || 1;
      const newIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
      return { ...prevIndexes, [listingId]: newIndex };
    });
  };

  const renderListings = () => {
    if (listings.length === 0) {
      return <p>Loading listings...</p>;
    }

    return listings.map((listing) => {
      const imageList = images[listing.id] || [];
      const hasMultipleImages = imageList.length > 1;
      const currentIndex = imageIndex[listing.id] || 0;

      return (
        <div className="listing-item" key={listing.id}>
          <div className="listing-img relative w-full max-w-lg mx-auto overflow-hidden rounded-lg">
            {imageList.length > 0 ? (
              <>
                <img
                  src={imageList[currentIndex]}
                  alt={`Listing ${listing.id} image`}
                  className="w-full transition-transform duration-500 ease-in-out"
                />
                {hasMultipleImages && (
                  <>
                    <button
                      className="absolute top-1/2 left-2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                      onClick={() => prevImage(listing.id)}
                    >
                      ◀
                    </button>
                    <button
                      className="absolute top-1/2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                      onClick={() => nextImage(listing.id)}
                    >
                      ▶
                    </button>
                  </>
                )}
              </>
            ) : (
              <p>No images available</p>
            )}
          </div>
          <div className="listing-description">
            <h1>{listing.listing_name}</h1>
            <p>₱{listing.price}</p>
            <p>{listing.location}</p>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <Navbar />
      <div className="market-page">
        <h1 className="market-page-title">Explore Listings</h1>
        <div className="market-page-listings">{renderListings()}</div>
      </div>
      <Footer />
    </>
  );
};

export default MarketPage;
