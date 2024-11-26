import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import ApiService from '../services/ApiServices';
import { useAuth } from '../hooks/useAuth';





function CreateAuction() {
  const navigate = useNavigate();
  const { keycloak } = useAuth();
  const [auctionDetails, setAuctionDetails] = useState({
    name: '',
    description: '',
    startingPrice: '',
    endDateTime: '',
  });
  const [imageFile, setImageFile] = useState(null);  // State for the selected image
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuctionDetails({ ...auctionDetails, [name]: value });
    console.log(`keycloak token: ${keycloak.token}`);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);  // Store the selected image file in state
  }
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Create FormData instance and append auction details and the selected image file
    const formData = new FormData();
    //append auction details
    formData.append("auction", JSON.stringify(auctionDetails));
    //append image file if it's selected
    if(imageFile){
      formData.append("image", imageFile);
    }

    try {
      setLoading(true);
      setError(null);
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`); // Logs key and value
      }
      // Send the auction details to the backend to create the auction
      const newAuction = await ApiService.createAuction(formData, keycloak.token);

      // If the auction was successfully created, navigate to "My Auctions" page
      if (newAuction) {
        navigate('/my-auctions');
      } else {
        setError('Auction creation failed');
      }
    } catch (error) {
      setError(`Error: ${error.message || 'Something went wrong'}`);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-gray-50 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Create a New Auction</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Auction Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter Auction Name"
              value={auctionDetails.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={auctionDetails.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
              placeholder="Provide a brief description of your auction"
            />
          </div>

          <div>
            <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700">
              Starting Price
            </label>
            <input
              type="number"
              name="startingPrice"
              placeholder="Ex: 500$"
              id="startingPrice"
              value={auctionDetails.startingPrice}
              onChange={handleInputChange}
              required
              min="0"
               style={{
              borderRadius: "8px",
              WebkitAppearance: "none", // Hide spinners in Webkit-based browsers (Chrome, Safari)
              MozAppearance: "textfield", // Hide spinners in Firefox
            }}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="endDateTime" className="block text-sm font-medium text-gray-700">
              End Date and Time
            </label>
            <input
              type="datetime-local"
              name="endDateTime"
              id="endDateTime"
              value={auctionDetails.endDateTime}
              onChange={handleInputChange}
              required
              
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

            {/* Image Upload */}
            <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Auction Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-3 text-white font-semibold rounded-xl shadow-md ${
                loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
              } focus:outline-none`}
            >
              {loading ? 'Creating Auction...' : 'Create Auction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAuction;
