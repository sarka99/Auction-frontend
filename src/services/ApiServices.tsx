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
    }
};

export default ApiService;
