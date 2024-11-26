import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ApiService from "../../services/ApiServices";
import { Button } from "@/components/ui/button";
import { Navigate, useNavigate } from 'react-router-dom'; // Import useNavigate
import AuctionCard from "../../components/AuctionInfoCard";



function Auctions() {
  const { keycloak } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllActiveAuctions = async () => {
      try {
        setLoading(true);
        if (keycloak) {
          const loggedInUserToken = keycloak.token;
          const data = await ApiService.getAllActiveAuctions(loggedInUserToken);
          setAuctions(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllActiveAuctions();
  }, [keycloak]);

  const handleOnViewAuctionClicked = (auctionId) => {
    console.log(`Clicked on auctionId ${auctionId}`)
    navigate(`/auction-details/${auctionId}`);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 pt-10 px-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-5">All Auctions</h1>
      {loading && <div>Loading auctions...</div>}
      {error && <div className="text-red-500">Error fetching auctions: {error}</div>}

      {/* Grid Layout for Auctions */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {auctions.length === 0 && !loading && !error && (
          <div>No active auctions available at the moment.</div>
        )}

        {auctions.map((auction) => (
          <AuctionCard 
          key={auction.id} 
          auction={auction}
          onClick={() => handleOnViewAuctionClicked(auction.id)} // Pass auction ID to the handler
          />
        ))}
      </div>
    </div>
  );
}

export default Auctions;