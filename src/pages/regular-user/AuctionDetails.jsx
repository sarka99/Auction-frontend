import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ApiService from "../../services/ApiServices";

function AuctionDetails() {
    const { keycloak } = useAuth();
    const { auctionId } = useParams();
    const [auction, setAuction] = useState(null);
    const [auctionBids, setAuctionBids] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAuctionDetails = async () => {
            try {
                setLoading(true);
                const loggedInUserToken = keycloak.token;
                if (loggedInUserToken && keycloak) {
                    const data = await ApiService.getAuctionDetails(auctionId, loggedInUserToken);
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
    }, [auctionId, keycloak]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            {/* Auction Header */}
            <Card className="mb-8 mt-8 shadow-lg border rounded-xl border-gray-300 bg-transparent">
                <CardHeader className="mb-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-3xl font-semibold">{auction?.name}</CardTitle>
                            <CardDescription className="text-gray-600">{auction?.description}</CardDescription>
                        </div>
                        <div className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-semibold">
                            {auctionBids.length} {auctionBids.length === 1 ? "Bid" : "Bids"}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="text-xl font-medium">Starting Price:</h3>
                        <p className="text-lg font-semibold">${auction?.startingPrice}</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-medium">Ends At:</h3>
                        <p className="text-lg font-semibold">{new Date(auction?.endDateTime).toLocaleString()}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Bids Table */}
            <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">Bids</h3>
                <Table className="w-full table-auto border-collapse border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border px-6 py-4 text-left text-sm font-medium text-gray-700 ">Bidder</th>
                            <th className="border px-6 py-4 text-left text-sm font-medium text-gray-700">Amount</th>
                            <th className="border px-6 py-4 text-left text-sm font-medium text-gray-700">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auctionBids.length > 0 ? (
                            auctionBids.map((bid) => (
                                <tr key={bid.id} className="border-t hover:bg-gray-50 transition-all duration-200 ease-in-out">
                                    <td className="border px-6 py-4 text-sm">{bid.bidderEmail}</td>
                                    <td className="border px-6 py-4 text-sm">${bid.amount}</td>
                                    <td className="border px-6 py-4 text-sm">{new Date(bid.time).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center border px-6 py-4 text-sm">No bids placed yet.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
                <Button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">Place a Bid</Button>
            </div>
        </div>
    );
}

export default AuctionDetails;
