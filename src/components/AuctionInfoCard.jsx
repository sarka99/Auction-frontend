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
        className="mt-6 bg-black rounded-xl text-white w-full hover:bg-gray-800 active:scale-95 focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 transition transform duration-150"
        onClick={handleOnViewAuctionClicked}
      >
        View Auction
      </Button>
    </div>
  );
};

export default AuctionCard;
