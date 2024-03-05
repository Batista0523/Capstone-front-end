import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import PlayerExample from '../Components/PlayerExample';
import Example from '../Components/PlayerStatsTable';
import "./PlayerExamplePage.scss";

const VITE_X_RAPIDAPI_KEY2 = process.env.REACT_APP_X_RAPIDAPI_KEY2;
const VITE_X_RAPIDAPI_HOST2 = process.env.REACT_APP_X_RAPIDAPI_HOST2;
const VITE_X_RAPIDAPI_URL3 = process.env.REACT_APP_X_RAPIDAPI_URL3;

const PlayerExamplePage = () => {
    const [data, setData] = useState(null);
    const [playerId, setPlayerId] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState('2023'); // Default season

    useEffect(() => {
        const fetchData = async () => {
            const options = {
                method: 'GET',
                url: VITE_X_RAPIDAPI_URL3,
                params: {
                    id: playerId, // Use playerId state
                    season: selectedSeason
                },
                headers: {
                  'X-RapidAPI-Key': VITE_X_RAPIDAPI_KEY2,
                  'X-RapidAPI-Host': VITE_X_RAPIDAPI_HOST2
                }
              };

            try {
                const response = await axios.request(options);
                setData(response.data.response[0]);
                console.log(response.data.response);
            } catch (error) {
                console.error(error);
            }
        };

        if (playerId) {
            fetchData();
        }
    }, [playerId, selectedSeason]); // Fetch data whenever playerId or selectedSeason changes

    // Extract playerId from the URL parameters when the component mounts
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const playerIdFromParams = params.get('userId');
        if (playerIdFromParams) {
            setPlayerId(playerIdFromParams);
        }
    }, []);

    return (
        <div className="player-example-page">
            {data ? (
                <>
                    {/* Render player name as a clickable link */}
                    <Link to={`/player/${data.id}`}>{data.firstname} {data.lastname}</Link>
                    <PlayerExample data={data} />
                    <div className="baseTable">
                        {/* Additional player stats table or other components */}
                    </div>
                </>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
}

export default PlayerExamplePage;
