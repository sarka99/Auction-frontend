// src/components/Auctions.jsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuctions } from "../../hooks/useAuctions";
import { useAuth } from "../../hooks/useAuth";
import ApiService from "../../services/ApiServices"; // Adjusted path to ApiServices
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
//TODO: finish up My Auctions page fully, rn not finished
function MyAuctions() {
  const { keycloak } = useAuth();
  const [auctions, setAuctions] = useState([]); // Initialize auctions as an empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Control dialog visibility
  const [editingAuctionId, setEditingAuctionId] = useState(null); // ID of the auction being edited
  const [newDescription, setNewDescription] = useState(""); // New description
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const userId = keycloak.tokenParsed?.sub;
        if (userId) {
          console.log(`About to fetch all auctions for ${userId}`);
          const data = await ApiService.getActiveAuctionsForUser(
            userId,
            keycloak.token
          );
          console.log(data);
          setAuctions(data); // Assume data is in the expected array format
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, [keycloak]);

  useEffect(() => {
    console.log(`Logged in user token from auctions: ${keycloak.token}`);
    console.log(`Logged in userId from auctions: ${keycloak.tokenParsed?.sub}`);
  }, [keycloak]);

  const handleView = (auctionId) => {
    console.log(`Handling view for auctionId ${auctionId}`);
  };
  const handleEdit = (auctionId) => {
    const auctionToEdit = auctions.find((auction) => auction.id === auctionId);
    setEditingAuctionId(auctionId);
    setNewDescription(auctionToEdit?.description || ""); // Set the current description in the input
    setIsDialogOpen(true); // Open the dialog
    //get the new comment, then make a post request to editAuctionDescription
  };
  const handleDelete = (id) => console.log("Deleting auction", id);

  const handleOnCreateAuction = () => {
    console.log("Creating auction");
  };
  const handleDescriptionChange = (e) => {
    setNewDescription(e.target.value);
  };

  const handleSubmitEdit = async () => {
    try {
      console.log(
        `editingAuctionID before making post request ${editingAuctionId}`
      );
      await ApiService.editAuctionDescription(editingAuctionId,newDescription,keycloak.token);
      //Here we update the Auction object in our component to display the new auction with its new description
      setAuctions((prevAuctions) =>
        prevAuctions.map((auction) =>
          auction.id === editingAuctionId
            ? { ...auction, description: newDescription }
            : auction
        )
      );
      setIsDialogOpen(false); // Close the dialog
      setEditingAuctionId(null); // Reset the auction being edited
      setNewDescription(""); // Clear the input
    } catch (err) {
      setError("Failed to update description");
    }
  };
  if (loading) return <div>Loading auctions...</div>;
  if (error) return <div>Error fetching auctions: {error}</div>;

  return (
    <div className="min-h-screen w-full my-1 bg-gray-100 p-10 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Auctions</h1>
        <Button
          className="bg-black text-white rounded-xl px-4 py-2 hover:bg-gray-800 transition duration-200"
          onClick={handleOnCreateAuction}
        >
          Create Auction
        </Button>
      </div>

      <div className="w-full max-w-full space-y-4">
        {auctions.map((auction) => (
          <div
            key={auction.id}
            className="bg-white rounded-xl shadow-lg p-5 flex items-center space-x-4 w-full hover:bg-gray-50"
          >
            <img
              src={auction.imageUrl} // Adjust based on your DTO
              alt="Auction"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-grow">
              <h2 className="font-bold text-gray-800 text-lg">
                {auction.name}
              </h2>
              <p>Description: {auction.description}</p>
              <p>Starting price: {auction.startingPrice}</p>
              <p>Expires: {new Date(auction.endDateTime).toLocaleString()}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                className="bg-neutral-800 text-white rounded-xl px-4 py-2 hover:bg-gray-700 transition duration-200"
                onClick={() => handleView(auction.id)}
              >
                View
              </Button>

              <Button
                className="bg-neutral-800 text-white rounded-xl px-4 py-2 hover:bg-gray-700 transition duration-200"
                onClick={() => handleEdit(auction.id)}
              >
                Edit
              </Button>

              <Button
                className="bg-red-600 rounded-xl text-white px-4 py-2 hover:bg-red-700 transition duration-200"
                onClick={() => handleDelete(auction.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog component for editing description, it will only open once the isDialogOpen is set to true*/}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="w-full sm:max-w-[425px] md:max-w-[600px] lg:max-w-[600px] h-96"> {/* Adjusted height and added rounded corners */}
      <DialogHeader>
            <DialogTitle>Edit Auction Description</DialogTitle>
            <DialogDescription>
              Enter the new description and click "Save changes" to update the
              auction.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-5"> {/* Stacks items vertically with a small gap */}
          <Label htmlFor="description" className="text-left">
                Description
              </Label>
              <Textarea
                id="description"
                value={newDescription}
                onChange={handleDescriptionChange}
                className="h-32 resize-none p-2 border rounded-xl" // Style adjustments
                placeholder="Enter new description"
              />
            </div>
          </div>
          <DialogFooter>
            {/* Once submit is clicked we make an api request, send in the required parameters */}
            <Button
              onClick={handleSubmitEdit}
              className="bg-blue-600 text-white rounded-xl px-4 py-2 mt-2 hover:bg-blue-500"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MyAuctions;
