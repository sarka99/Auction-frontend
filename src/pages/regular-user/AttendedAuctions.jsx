// src/pages/AllAuctions.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ApiService from "../../services/ApiServices";
import AuctionCard from "../../components/AuctionInfoCard";

function AllAuctions() {
  const { keycloak } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllActiveAuctions = async () => {
      try {
        setLoading(true);
        if (keycloak) {
          const data = await ApiService.getAllActiveBiddenAuctions(keycloak.token);
          setAuctions(data);
        }
      } catch (err) {
        setError("Failed to fetch auctions. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllActiveAuctions();
  }, [keycloak]);

  return (
    <div className="min-h-screen w-full bg-gray-50 pt-10 px-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-5">All Auctions</h1>
      {loading && <div>Loading auctions...</div>}
      {error && <div className="text-red-500">Error fetching auctions: {error}</div>}
      <div className="flex space-x-7 overflow-x-auto p-10 scrollbar-hide justify-start mx-6 w-5/5">
        {auctions.length === 0 && !loading && !error && (
          <div>No active auctions available at the moment.</div>
        )}
        {auctions.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  );
}

export default AllAuctions;
