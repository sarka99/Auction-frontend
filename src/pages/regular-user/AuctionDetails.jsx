import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import ApiService from "../../services/ApiServices";

function AuctionDetails() {
  const { keycloak } = useAuth();
  const { auctionId } = useParams();
  const [auction, setAuction] = useState(null);
  const [auctionBids, setAuctionBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bidValue,setBidValue] = useState("");
  
  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        setLoading(true);
        const loggedInUserToken = keycloak.token;
        if (loggedInUserToken && keycloak) {
          const data = await ApiService.getAuctionDetails(
            auctionId,
            loggedInUserToken
          );
          console.log(data)
          setAuction(data);
          setAuctionBids(data.bids);
        }
      } catch (err) {
        setError("Failed to fetch auction details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAuctionDetails();
  }, [auctionId,auctionBids.length]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  const returnHighestBid = () =>{
    if(auctionBids.length === 0){
        return 0;
    }
    return Math.max(...auctionBids.map((bid) => bid.amount));
  }
  const handleOnBidChanged = (e) =>{
    setBidValue(e.target.value);
  }
  const handleOnPlaceBid = () => {
    console.log(`Trying to place the bid of amount ${bidValue} on auctionId ${auctionId}`);
  
    const highestBid = returnHighestBid();
    const loggedInUserId = keycloak.tokenParsed?.sub;
  
    // Get current time and auction's end time
    const currentTime = new Date();
    const auctionEndTime = new Date(auction?.endDateTime);
  
    // Check if the auction has expired
    const hasAuctionExpired = currentTime > auctionEndTime;
  
    // Check if the logged-in user is the auction owner
    if (auction.userId === loggedInUserId) {
      alert("Owner cannot place bid");
      return;
    }
  
    // Check if the bid value is valid
    if (bidValue <= highestBid) {
      alert("Your bid must be higher than the current highest bid.");
      return;
    }
  
    if (bidValue <= auction.startingPrice) {
      alert("Your bid must be higher than the starting price.");
      return;
    }
  
    if (hasAuctionExpired) {
      alert("The auction has expired.");
      return;
    }
  
    // Place the bid if all checks pass
    const newBid = placeBid();
    setAuctionBids((prevBids) => [...prevBids, newBid]);
    setBidValue("");
  };
  const placeBid = async () => {
    try{
        setLoading(true);
        //making the place bid API request
        await ApiService.placeBidOnAuction(auctionId,keycloak.token,bidValue);

    }catch(error){
        setError(error);
        console.log(`This error occured when placing bid ${error}`);
    }finally{
        setLoading(false);
    }
  }
  
  const fetchAuctionDetails = async () => {
    try {
      setLoading(true);
      const loggedInUserToken = keycloak.token;
      if (loggedInUserToken && keycloak) {
        const data = await ApiService.getAuctionDetails(
          auctionId,
          loggedInUserToken
        );
        console.log(data)
        setAuction(data);
        setAuctionBids(data.bids);
      }
    } catch (err) {
      setError("Failed to fetch auction details. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="container mx-auto p-6">
      {/* Auction Header */}
      <Card className="mb-8 mt-8 shadow-lg border rounded-xl border-gray-300 bg-transparent">
        <CardHeader className="mb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold">
                {auction?.name}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {auction?.description}
              </CardDescription>
            </div>
            <div className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-semibold">
              {auctionBids.length} {auctionBids.length === 1 ? "Bid" : "Bids"}
            </div>
          </div>
        </CardHeader>
        <CardContent className="inline-flex space-x-48">

          {/* Starting Price */}
          <div className="space-y-2 text-left">
            <h3 className="text-xl font-medium">Starting Price</h3>
            <p className="text-lg font-bold">${auction?.startingPrice}</p>
          </div>

          {/* Number of Bids */}
          <div className="space-y-2 text-left">
            <h3 className="text-xl font-medium">Total Bids</h3>
            <p className="text-lg font-bold">{auctionBids.length}</p>
          </div>

          {/* Highest Bid */}
          <div className="space-y-2 text-left">
            <h3 className="text-xl font-medium">Highest Bid</h3>
            <p className="text-lg font-bold">
                {returnHighestBid()}
            </p>
          </div>

          {/* End time*/}
          <div className="space-y-2 text-left">
            <h3 className="text-xl font-medium">Ends At</h3>
            <p className="text-lg font-bold">
              {new Date(auction?.endDateTime).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* this is Bids Table  */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Bids</h3>
        <Table className="w-full table-auto border-collapse border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-6 py-4 text-left text-sm font-medium text-gray-700 ">
                Bidder
              </th>
              <th className="border px-6 py-4 text-left text-sm font-medium text-gray-700">
                Amount
              </th>
              <th className="border px-6 py-4 text-left text-sm font-medium text-gray-700">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {auctionBids.length > 0 ? (
              auctionBids.map((bid) => (
                <tr
                  key={bid.id}
                  className="border-t hover:bg-gray-50 transition-all duration-200 ease-in-out"
                >
                  <td className="border px-6 py-4 text-sm">
                    {bid.bidderEmail}
                  </td>
                  <td className="border px-6 py-4 text-sm">${bid.amount}</td>
                  <td className="border px-6 py-4 text-sm">
                    {new Date(bid.time).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-center border px-6 py-4 text-sm"
                >
                  No bids placed yet.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {/* bid placing section */}
        <div className="flex justify-end mr-3 py-11 space-x-4">
          <Input
            className="bg-gray-50 font-semibold px-4 py-7 w-full shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 "
            style={{ borderRadius: "8px" }}
            placeholder="Enter your bid amount"
            type="number"
            min="1"
            value = {bidValue}
            onChange = {(event) => handleOnBidChanged(event)}
          />
          <Button 
          className="bg-gray-800 text-white px-6 py-7 rounded-xl shadow-lg hover:bg-gray-900 transition-all duration-300 ease-in-out active:scale-95"
          onClick = {handleOnPlaceBid}
          >
            Place Bid
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AuctionDetails;
