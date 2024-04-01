
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, StyledBody, StyledThumbnail, StyledTitle } from "baseui/card";
import "./TeamLeaderPlayerCard.scss"
import { useNavigate } from "react-router-dom";
import { Block } from "baseui/block";
import {
    LabelMedium,
    LabelXSmall,
    LabelSmall,
    LabelLarge,
    HeadingLarge,
    HeadingMedium,
    HeadingSmall
} from "baseui/typography";
import { Heading, HeadingLevel } from 'baseui/heading';
import Spin from './SpinLoad';

const VITE_X_RAPIDAPI_KEY = import.meta.env.VITE_X_RAPIDAPI_KEY2;
const VITE_X_RAPIDAPI_HOST = import.meta.env.VITE_X_RAPIDAPI_HOST2;
const VITE_X_RAPIDAPI_URL3 = import.meta.env.VITE_X_RAPIDAPI_URL3;
const VITE_X_RAPIDAPI_URL2 = import.meta.env.VITE_X_RAPIDAPI_URL2;
const VITE_PLAYER_IMAGE_BASE_URL = import.meta.env.VITE_BASE_URL;

const TeamPlayerLeaderCard = ({ teamId, season, isSearchVisible, setIsSearchVisible, sendDataToParent, primaryColor, secondaryColor }) => {
    const navigate = useNavigate();
    const [leaders, setLeaders] = useState([]);
    const [playerImages, setPlayerImages] = useState([])
    const [personalData, setPersonalData] = useState([]);
    console.log(leaders)

    useEffect(() => {
        const fetchPlayerStats = async () => {
            try {
                const response = await axios.request({
                    method: 'GET',
                    url: VITE_X_RAPIDAPI_URL2,
                    params: {
                        team: teamId,
                        season: season
                    },
                    headers: {
                        'X-RapidAPI-Key': VITE_X_RAPIDAPI_KEY,
                        'X-RapidAPI-Host': VITE_X_RAPIDAPI_HOST
                    }
                });
                setPersonalData(response.data.response.filter(e => {
                    return (leaders.map(e => e.id).includes(Number(e.id)))
                }));
            } catch (error) {
                console.error(error);
            }
        };
        if (leaders.length > 0) {
            fetchPlayerStats();
        }
    }, [teamId, season, leaders]);
    console.log("PERSONAL DATA", personalData)

    useEffect(() => {
        const fetchTeamLeaders = async () => {
            const options = {
                method: 'GET',
                url: VITE_X_RAPIDAPI_URL3,
                params: { team: teamId, season },
                headers: {
                    'X-RapidAPI-Key': VITE_X_RAPIDAPI_KEY,
                    'X-RapidAPI-Host': VITE_X_RAPIDAPI_HOST,
                },
            };

            try {
                const response = await axios.request(options);
                console.log("LEADERS: ", response)
                sendDataToParent(response.data.response[0])
                if (response.data && response.data.response) {
                    const playerStats = response.data.response.reduce((acc, curr) => {
                        const playerId = curr.player.id;
                        if (!acc[playerId]) {
                            acc[playerId] = { ...curr.player, points: 0, assists: 0, rebounds: 0 };
                        }
                        acc[playerId].points += curr.points;
                        acc[playerId].assists += curr.assists;
                        acc[playerId].rebounds += curr.totReb;
                        return acc;
                    }, {});
                    console.log(leaders)
                    // Sort and find leaders
                    const sortedPoints = Object.values(playerStats).sort((a, b) => b.points - a.points);
                    const sortedAssists = Object.values(playerStats).sort((a, b) => b.assists - a.assists);
                    const sortedRebounds = Object.values(playerStats).sort((a, b) => b.rebounds - a.rebounds);

                    // Include category and construct image URL
                    const leadersWithCategory = [
                        { ...sortedPoints[0], category: 'Points Leader' },
                        { ...sortedAssists[0], category: 'Assists Leader' },
                        { ...sortedRebounds[0], category: 'Rebounds Leader' }
                    ].map(leader => ({ ...leader }));
                    setLeaders(leadersWithCategory);
                }
            } catch (error) {
                console.error('Failed to fetch team leaders:', error);
            }
        };
        fetchTeamLeaders();
    }, [teamId, season]);

    useEffect(() => {
        const fetchData = async () => {
            const images = await Promise.all(leaders.map(async (leader) => {
                const player = `${leader.firstname.toLowerCase()} ${leader.lastname.toLowerCase()}`;
                try {
                    const response = await fetch(`${VITE_PLAYER_IMAGE_BASE_URL}/playerimages/${player}`);
                    const data = await response.json();
                    return data.image_url;
                } catch (error) {
                    console.error('Failed to fetch player image:', error);
                    return 'https://via.placeholder.com/150';
                }
            }));
            setPlayerImages(images);
        };

        if (leaders.length > 0) {
            fetchData();
        }
    }, [leaders, VITE_PLAYER_IMAGE_BASE_URL]);

    return (
        <div>
            {personalData.length > 0 ?
                <div className="teamleaderdisplaycards">
                    {leaders.map((leader, index) => (
                        <div
                            key={index}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                setIsSearchVisible(false)
                                navigate(`/player/${leader.id}`, { state: { ...leader } })
                            }}
                        >

                            <Card className="responsiveCard"
                                overrides={{
                                    Root: {
                                        style: {
                                            width: "420px",
                                            marginBottom: "10px",
                                            height: "190px",
                                            borderRadius: "0"
                                        }
                                    }
                                }}
                            >
                                <StyledTitle>
                                    {leader.firstname} {leader.lastname}
                                <StyledThumbnail src={playerImages[index] || 'https://via.placeholder.com/150'}
                                    style={{ marginLeft:'30px',marginTop: "-55px", height: '235px', width: '240px', alignSelf: "center", border: "none" }} />
                                </StyledTitle>
                                <StyledTitle>
                                    {personalData && personalData[index] && personalData[index].leagues && personalData[index].leagues.standard ? " #" + personalData[index].leagues.standard.jersey : ""}  &nbsp;
                                    </StyledTitle>
                                <StyledBody>
                                    <HeadingLevel >
                                        <Heading marginTop="-16px" marginBottom="-1px" styleLevel={6}>
                                            {leader.category.split(" ")[0] === "Points" && `Points: ${leader.points}`}
                                            {leader.category.split(" ")[0] === "Assists" && `Assists: ${leader.assists}`}
                                            {leader.category.split(" ")[0] === "Rebounds" && `Rebounds: ${leader.rebounds}`}
                                        </Heading>
                                    </HeadingLevel>
                                    {leader.category.split(" ")[0] === "Points" ?
                                        <LabelMedium>Assists: {leader.assists} &nbsp;&nbsp;&nbsp;&nbsp; Rebounds: {leader.rebounds}</LabelMedium> : leader.category.split(" ")[0] === "Assists" ?
                                            <LabelMedium>Points: {leader.points} &nbsp;&nbsp;&nbsp;&nbsp; Rebounds: {leader.rebounds}</LabelMedium> : leader.category.split(" ")[0] === "Rebounds" ?
                                                <LabelMedium>Points: {leader.points} &nbsp;&nbsp;&nbsp;&nbsp; Assists: {leader.assists} </LabelMedium> : "n/a"}

                                </StyledBody>
                            </Card>
                        </div>
                    ))}
                </div>
                : <Spin></Spin>}
        </div>
    );
};

export default TeamPlayerLeaderCard;