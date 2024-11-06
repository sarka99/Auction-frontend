// src/components/Auctions.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ApiService from "../../services/ApiServices";
import { Button } from "@/components/ui/button";

function Auctions() {
  const { keycloak } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllActiveAuctions = async () => {
      try {
        setLoading(true);
        if (keycloak) {
          console.log(`Attempting to fetch all active auctions!`);
          const loggedInUserToken = keycloak.token;
          const data = await ApiService.getAllActiveAuctions(loggedInUserToken);
          console.log(data);
          setAuctions(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllActiveAuctions();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-5">All Auctions</h1>
      {loading && <div>Loading auctions...</div>}
      {error && <div className="text-red-500">Error fetching auctions: {error}</div>}

      {/* Horizontal scroll container */}
      <div className="flex space-x-7 overflow-x-auto p-32 scrollbar-hide justify-center">
        {auctions.map((auction) => (
          <div
            key={auction.id}
            className="flex-shrink-0 bg-white rounded-xl shadow-lg p-6 w-72 h-96 transition transform duration-200 hover:scale-105 hover:shadow-2xl hover:bg-blue-50"
            >
            <h2 className="text-xl font-semibold text-gray-900">{auction.name}</h2>
            <p className="text-gray-700 mt-2 line-clamp-3">{auction.description}</p>
            <div className="text-gray-500 mt-2">
              <p className="font-medium">Starting Price: <span className="text-blue-600">${auction.startingPrice}</span></p>
              <p>Expires: {new Date(auction.endDateTime).toLocaleString()}</p>
            </div>
            <Button className="mt-4 bg-blue-600 text-white w-full hover:bg-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              View Auction
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Auctions;
