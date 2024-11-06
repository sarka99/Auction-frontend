// src/services/auctionService.js
import axios from 'axios';

const API_URL = 'http://localhost:8081/api/auctions/user';

export const fetchActiveAuctionsForUser = async (userId, token) => {
    try {
        const response = await axios.get(`${API_URL}/${userId}/active`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Return the auction data received from the backend
    } catch (error) {
        throw error; // Throw the error to handle it later in the component
    }
};

export const editAuctionDescription = async() =>{
    
}


