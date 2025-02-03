import React from "react";
import Navbar from "./NavigationBar";
import Footer from "./Footer";
import "../assets/css/MarketPage.css"
import goat2 from "../assets/images/goats/goat2.png"

const MarketPage: React.FC = () => {
  const items = ["item1", "item2", "item3", "item4", "item5", "item6"];

  const getListingsRegistered = () => {
    return (
      <>
      {items.map((item, index) => (
        <div className="listing-item">
          <div className="listing-img">
            <img src={goat2} alt="goat 2" />
          </div>
          <div className="listing-description">
            <h1>{item}</h1>
            <p>price</p>
            <p>location</p>
          </div>
        </div>
      ))}
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="market-page">
        <h1 className="market-page-title">Explore Listings</h1>
        <div className="market-page-listings">
          {getListingsRegistered()}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MarketPage;
