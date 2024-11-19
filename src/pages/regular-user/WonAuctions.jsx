import React, { useState,useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import ApiService from "../../services/ApiServices";
import { Navigate, useNavigate } from 'react-router-dom'; // Import useNavigate
import AuctionCard from "../../components/AuctionInfoCard";



function WonAuctions(){
    const {keycloak} = useAuth();
    const [auctions,setAuctions] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    useEffect(()=>{
        const fetchAllEndedWonAuctions = async () =>{
            try{
                setLoading(true);
                if(keycloak){
                    console.log(`Attempting to fetch all won  auctions for userid: ${keycloak.id}`);
                    const loggedInUserToken = keycloak.token;
                    const data = await ApiService.getAllEndedWonAuctions(loggedInUserToken);
                    console.log(data);
                    setAuctions(data);
                }

            }catch(err){

            }finally{
                setLoading(false);
            }
        };
        fetchAllEndedWonAuctions();

    }, [keycloak])
    return(
        <>
    <div className="min-h-screen w-full bg-gray-50 pt-10 px-10"> {/* Adjust top padding for better spacing */}
      <h1 className="text-3xl font-bold text-gray-800 mb-5">All Auctions</h1>
      {loading && <div>Loading auctions...</div>}
      {error && <div className="text-red-500">Error fetching auctions: {error}</div>}

      {/* Horizontal scroll container */}
      <div className="flex space-x-7 overflow-x-auto p-10 scrollbar-hide justify-start mx-6 w-5/5"> {/* Increase padding and width */}

        {auctions.length === 0 && !loading && !error && (
          <div>No won auctions available at the moment.</div>
        )}

        {auctions.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
        </>
    )
}
export default WonAuctions;