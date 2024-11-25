// src/services/ApiServices.js

const API_BASE_URL = 'http://localhost:8081/api';

const ApiService = {
    getActiveAuctionsForUser: async (userId, userToken) => {
        const response = await fetch(`${API_BASE_URL}/auctions/user/${userId}/active`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userToken}`, // Add token in Authorization header
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`Network response was not ok!`);
        }
        
        return response.json();
    },
    editAuctionDescription : async (auctionId,newDescription, userToken) =>{
        const response = await fetch(`${API_BASE_URL}/auctions/${auctionId}/description`,{
            method:'POST',
            headers:{
                'Authorization': `Bearer ${userToken}`, // Add token in Authorization header
                'Content-Type': 'application/json',
            },
            //sending only the newDescription as an object (controller method takes that as param)
            body: JSON.stringify({newDescription}) 
        });
        if(!response.ok){
            throw new Error("Failed to update auction description");
        }
        return response.json();

    },
    getAllActiveAuctions : async (userToken) =>{
        const response = await fetch(`${API_BASE_URL}/auctions/active`,{
            method : 'GET',
            headers : {
                'Authorization': `Bearer ${userToken}`, // Add token in Authorization header
                'Content-Type': 'application/json',
            }
        });

        if(!response.ok){
            throw new Error("Failed to fetch all active auctions");
        }
        return response.json();
    },

    getAuctionDetails : async (auctionId,userToken) =>{
        const response = await fetch(`${API_BASE_URL}/auctions/${auctionId}`,{
            method : 'GET',
            headers : {
                'Authorization': `Bearer ${userToken}`, // Add token in Authorization header
                'Content-Type': 'application/json',
            }

        });

        if(!response.ok){
            throw new Error("Failed to fetch auction details");
        }
        return response.json();
    },
    placeBidOnAuction: async (auctionId, userToken, bidAmount) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auctions/${auctionId}/bids`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: bidAmount })
            });
    
            if (!response.ok) {
                throw new Error("Failed to place bid on auction");
            }
    
            const data = await response.json();
            
            console.log("API Response (New Bid):", data);  // Log the response
            return data;  // Ensure you're returning the response correctly
    
        } catch (error) {
            console.error("Error placing bid:", error);  // Log any errors in placing the bid
            throw error;
        }
    },
    getAllActiveBiddenAuctions : async (userToken) => {
        const response = await fetch(`${API_BASE_URL}/auctions/bids/active`,{
            method : 'GET',
            headers : {
                'Authorization': `Bearer ${userToken}`, // Add token in Authorization header
                'Content-Type': 'application/json',
            }
        });

        if(!response.ok){
            throw new Error("Failed to fetch all active auctions");
        }
        return response.json();
    },
    getAllEndedWonAuctions : async (userToken) =>{
        const response = await fetch(`${API_BASE_URL}/auctions/endedWon`,{
            method : 'GET',
            headers : {
                'Authorization': `Bearer ${userToken}`, // Add token in Authorization header
                'Content-Type': 'application/json',
            }
        });
        if(!response.ok){
            throw new Error("Failed to fetch all ended won auctions");
        }
        return response.json();
    },
    deleteAuctionById : async (userToken, auctionId) =>{
        const response = await fetch(`${API_BASE_URL}/auctions/delete/${auctionId}`, {
            method : 'DELETE',
            headers : {
                'Authorization': `Bearer ${userToken}`, // Add token in Authorization header
                'Content-Type': 'application/json',
            }
        });
        if(!response.ok){
            throw new Error("Failed to remove the auction");

        }
        return response.json();
    },
    createAuction: async (auctionDetails, userToken) => {
        const response = await fetch(`${API_BASE_URL}/auctions/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userToken}`, // Assuming JWT token is required
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(auctionDetails), // Send auction details to the backend
        });
    
        if (!response.ok) {
            throw new Error("Failed to create auction");
        }
    
        return response.json(); // Return the created auction data
    },
    listAllUsers : async (userToken) => {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            method : 'GET',
            headers:{
                'Authorization': `Bearer ${userToken}`, // Assuming JWT token is required
                'Content-Type': 'application/json',
            }
        });

        if(!response.ok){
            throw new Error("Failed to fetch all the users");

        }
        return response.json();
    },
    updateUserName : async (userId, newUserName, userToken) => {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/update-username`, {
            method : 'PUT',
            headers : {
                'Authorization': `Bearer ${userToken}`, // Assuming JWT token is required
                'Content-Type': 'application/json',
            },
            //send the body object to the backend, an object containing only the new user name
            body: JSON.stringify({newUserName}) 
        });
        if(!response.ok){
            throw new Error("Failed to update username");
        }
        return response.json();
    },
    deleteUserByUserId : async (userId, userToken) => {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/delete-user`,{
            method : 'PUT',
            headers : {
                'Authorization': `Bearer ${userToken}`, // Assuming JWT token is required
                'Content-Type': 'application/json',
            }

        });
        if(!response.ok){
            throw new Error("Failed to remove user");
        }
        return response.json();
    }
};

export default ApiService;
