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
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaEye, FaPlusCircle } from "react-icons/fa"; // Importing the icons
import { useParams } from "react-router-dom";  // Import useParams to get userId from the URL

function MyAuctions() {
  const { keycloak } = useAuth();
  const [auctions, setAuctions] = useState([]); // Initialize auctions as an empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Control dialog visibility
  const [isDeleteDiaglogOpen, setIsDeleteDialogOpen] = useState(false);
  const [auctionToDeleteId, setAuctionToDeleteId] = useState(null); // ID of the auction to delete
  const [editingAuctionId, setEditingAuctionId] = useState(null); // ID of the auction being edited
  const [newDescription, setNewDescription] = useState(""); // New description
  const { userId } = useParams();  // Get userId from the URL params
  const [auctionsUserId, setAuctionsUserId] = useState("");
  const navigate = useNavigate();

  //TODO:  fetch the auctions depending on if the useParams is empty or not if not empty fetch auctions for the selected userId, 
  useEffect(() => {
    const fetchAuctions = async () => {
      const userToFetch = userId || keycloak.tokenParsed?.sub;

  
      try {
        setLoading(true);
        const loggedInUserId = keycloak.tokenParsed?.sub;
        if (loggedInUserId) {
          console.log(`About to fetch all auctions for ${userToFetch}`);
          const data = await ApiService.getActiveAuctionsForUser(
            userToFetch,
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


  const handleView = (auctionId) => {
    //navigate/redirect user to the auctiondetails page.
    console.log(`Handling view for auctionId ${auctionId}`);
    navigate(`/auction-details/${auctionId}`);
  };
  const handleEdit = (auctionId) => {
    const auctionToEdit = auctions.find((auction) => auction.id === auctionId);
    setEditingAuctionId(auctionId);
    setNewDescription(auctionToEdit?.description || ""); // Set the current description in the input
    setIsDialogOpen(true); // Open the dialog
    //get the new comment, then make a post request to editAuctionDescription
  };
  const handleDelete = (auctionId) => {
    //here we delete the auction based on its id
    console.log(`Deleting auction with id: ${auctionId}`);
    setAuctionToDeleteId(auctionId); // Store the ID of the auction being deleted
    setIsDeleteDialogOpen(true); // Open the delete confirmation dialog
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      console.log(
        `about to remove auction with auctionId ${auctionToDeleteId}`
      );
      if (!keycloak.token || auctionToDeleteId == null) {
        throw new Error("Token or auction to delete id invalid");
      }
      await ApiService.deleteAuctionById(keycloak.token, auctionToDeleteId);

      //remove auction from the list by filtering it handleOnCreateAuction, doing this to update the list of auctions to reflect the removal
      setAuctions((prevAuctions) =>
        prevAuctions.filter((auction) => auction.id !== auctionToDeleteId)
      );

      //once removed close dialog and reset auctionToDeleteId
      setIsDeleteDialogOpen(false);
      setAuctionToDeleteId(null);
    } catch (err) {
      setError("Failed to delete auction");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAuction = () => {
    console.log("Creating auction");
    navigate(`/create-auction`);
  };
  const handleDescriptionChange = (e) => {
    setNewDescription(e.target.value);
  };

  const handleSubmitEdit = async () => {
    try {
      console.log(
        `editingAuctionID before making post request ${editingAuctionId}`
      );
      await ApiService.editAuctionDescription(
        editingAuctionId,
        newDescription,
        keycloak.token
      );
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

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setEditingAuctionId(false);
  };
    // Format the endDateTime to show only year, month, day, hour, and minute
    const formatExpiryDate = (endDateTime) => {
      const date = new Date(endDateTime);
      // Use toLocaleDateString and toLocaleTimeString to show just the needed parts
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",  // "short" will give us abbreviated month (e.g., "Dec")
        day: "numeric",
      });
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${formattedDate} ${formattedTime}`;
    };
  if (loading) return <div>Loading auctions...</div>;
  if (error) return <div>Error fetching auctions: {error}</div>;

  return (
    <div className="min-h-screen w-full my-1 bg-gray-100 p-10 flex flex-col items-center ">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Auctions</h1>
        <Button
          className="bg-gray-800 text-white px-6 py-3 mt-6 rounded-xl shadow-lg hover:bg-gray-900 focus:ring-2 focus:ring-gray-500 transition-all duration-300 ease-in-out active:scale-95"
          onClick={handleCreateAuction}
        >
          <FaPlusCircle size={20}  className="mr-2"/>
          Create
        </Button>
      </div>

      <div className="w-full max-w-full space-y-4">
        {auctions.map((auction) => (
          <div
            key={auction.id}
            className="bg-white rounded-xl shadow-lg p-5 flex items-center space-x-4 w-full  hover:bg-gray-50 transition transform duration-200  hover:shadow-2xl"
          >
            <div className="flex-grow">
              <h2 className="font-bold text-gray-800 text-lg">
                {auction.name}
              </h2>
              <p>Description: {auction.description}</p>
              <p>Starting price: {auction.startingPrice}</p>
              <p>Expires: {formatExpiryDate(auction.endDateTime)}</p>  {/* Format the date */}
              </div>
            <div className="flex space-x-2">
              <Button
                className="text-gray-600  hover:text-gray-900 hover:scale-125 focus:outline-none transition duration-200"
                onClick={() => handleView(auction.id)}
              >
                <FaEye size={20} />
              </Button>

              <Button
                className="text-gray-600 hover:text-gray-900 hover:scale-125 focus:outline-none transition duration-200"
                onClick={() => handleEdit(auction.id)}
              >
                <FaEdit size={20} />
              </Button>

              <Button
                className="text-gray-600  hover:text-gray-900 hover:scale-125 focus:outline-none transition duration-200"
                onClick={() => handleDelete(auction.id)}
              >
                <FaTrashAlt size={20} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog component for editing description, it will only open once the isDialogOpen is set to true*/}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full sm:max-w-[425px] md:max-w-[600px] lg:max-w-[600px] h-96">
          {" "}
          {/* Adjusted height and added rounded corners */}
          <DialogHeader>
            <DialogTitle>Edit Auction Description</DialogTitle>
            <DialogDescription>
              Enter the new description and click "Save changes" to update the
              auction.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-5">
              {" "}
              {/* Stacks items vertically with a small gap */}
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

      {/* Delete auction dialog */}
      <Dialog open={isDeleteDiaglogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="w-full sm:max-w-[500px] md:max-w-[700px] lg:max-w-[800px] h-[20vh] min-h-[200px]">
          <DialogHeader>
            <DialogTitle>Delete Auction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this auction? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="bg-red-600 text-white rounded-xl px-4 py-2 hover:bg-red-700"
              onClick={handleConfirmDelete} // Handle deletion on confirm
            >
              Confirm
            </Button>
            <Button
              className="bg-neutral-800 text-white rounded-xl px-4 py-2 hover:bg-gray-700"
              onClick={handleCancelDelete} // Handle cancellation
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MyAuctions;
