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
};

export default ApiService;
