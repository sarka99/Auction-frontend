// src/components/AuctionCard.js
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const AuctionCard = ({ auction }) => {
  const navigate = useNavigate();

  const handleOnViewAuctionClicked = () => {
    navigate(`/auction-details/${auction.id}`);
  };

  return (
    <div className="flex-shrink-0 bg-white rounded-xl shadow-lg p-8 w-80 h-80 flex flex-col justify-between transition transform duration-200 hover:scale-105 hover:shadow-2xl">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{auction.name}</h2>
        <p className="text-gray-700 mt-2 line-clamp-3">{auction.description}</p>
        <div className="text-gray-500 mt-2">
          <p className="font-medium">
            Starting Price: <span className="text-blue-600">${auction.startingPrice}</span>
          </p>
          <p>Expires: {new Date(auction.endDateTime).toLocaleString()}</p>
        </div>
      </div>
      <Button
        className="bg-blue-600 text-white px-6 py-3 mt-6 rounded-xl shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out active:scale-95"
        onClick={handleOnViewAuctionClicked}
      >
        View Auction
      </Button>
    </div>
  );
};

export default AuctionCard;
