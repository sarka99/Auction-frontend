import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ApiService from "../../services/ApiServices";
import { Button } from "@/components/ui/button";
import { Navigate, useNavigate } from 'react-router-dom'; // Import useNavigate


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
          console.log(`Attempting to fetch all active auctions!`);
          const loggedInUserToken = keycloak.token;
          const data = await ApiService.getAllActiveAuctions(loggedInUserToken);
          console.log(data); // Log the entire fetched data
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

  const handleOnViewAutionClicked = (auctionId) =>{
      console.log(`Auction with id ${auctionId} clicked`)
      navigate(`/auction-details/${auctionId}`)

  }

  return (
    <div className="min-h-screen w-full bg-gray-50 pt-10 px-10"> {/* Adjust top padding for better spacing */}
      <h1 className="text-3xl font-bold text-gray-800 mb-5">All Auctions</h1>
      {loading && <div>Loading auctions...</div>}
      {error && <div className="text-red-500">Error fetching auctions: {error}</div>}

      {/* Horizontal scroll container */}
      <div className="flex space-x-7 overflow-x-auto p-10 scrollbar-hide justify-start mx-6 w-5/5"> {/* Increase padding and width */}
        {/* Log auctions state for debugging */}
        {console.log("Auction State: ", auctions)}

        {auctions.length === 0 && !loading && !error && (
          <div>No active auctions available at the moment.</div>
        )}

        {auctions.map((auction) => (
          <div
            key={auction.id}
            className="flex-shrink-0 bg-white rounded-xl shadow-lg p-8 w-80 h-80 flex flex-col justify-between transition transform duration-200 hover:scale-105 hover:shadow-2xl"
            >
            {/* Adjust card size */}
            <div >
              <h2 className="text-xl font-semibold text-gray-900">{auction.name}</h2>
              <p className="text-gray-700 mt-2 line-clamp-3">{auction.description}</p>
              <div className="text-gray-500 mt-2">
                <p className="font-medium">
                  Starting Price: <span className="text-blue-600">${auction.startingPrice}</span>
                </p>
                <p>Expires: {new Date(auction.endDateTime).toLocaleString()}</p>
              </div>
            </div>

            <Button className="mt-6 bg-black rounded-xl text-white w-full hover:bg-gray-800 active:scale-95 focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 transition transform duration-150"
            onClick={()=>{handleOnViewAutionClicked(auction.id)}}
            >
            View Auction
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Auctions;
