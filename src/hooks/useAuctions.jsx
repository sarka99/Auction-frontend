// src/hooks/useAuctions.js
import { useEffect, useState } from 'react';
import { fetchActiveAuctionsForUser } from '../services/auctionService';
import { useAuth } from './useAuth';

export const useAuctions = () => {
    const { keycloak } = useAuth();
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("fetching auctions")
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchActiveAuctionsForUser(keycloak.tokenParsed.sub, keycloak.token);
                setAuctions(data);           
                console.log("Fetched data:", auctions);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (keycloak.token) {
            fetchData();
        }
    }, [keycloak]);

    return { auctions, loading, error };
};
