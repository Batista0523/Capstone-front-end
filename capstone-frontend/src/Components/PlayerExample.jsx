import React, { useEffect, useState } from "react";
import { Table } from "baseui/table-semantic";
import Spin from "./SpinLoad";
import axios from "axios";
import MyGraph from "./MyChart";
import { useNavigate } from "react-router-dom"
import "./PlayerExample.scss"
import { Block } from "baseui/block";
import { Heading, HeadingLevel } from 'baseui/heading';
import { Avatar } from "baseui/avatar";
import { Select } from 'baseui/select';
import {
    LabelMedium,
    LabelXSmall,
    HeadingLarge,
    HeadingMedium,
    HeadingSmall
} from "baseui/typography";

const VITE_X_RAPIDAPI_KEY2 = import.meta.env.VITE_X_RAPIDAPI_KEY2;
const VITE_X_RAPIDAPI_HOST2 = import.meta.env.VITE_X_RAPIDAPI_HOST2;
const VITE_X_RAPIDAPI_URL3 = import.meta.env.VITE_X_RAPIDAPI_URL3;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

function PlayerExample({ data, playerid }) {
    let navigate = useNavigate()

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const tableWidth = windowWidth < 768 ? '100%' : '60rem';


    const [playerImage, setPlayerImage] = useState({
        player_id: 0,
        player: "",
        birth_date: "",
        image_url: ""
    })
    useEffect(() => {
        const player = `${data.firstname.toLowerCase()}` + ` ${data.lastname.toLowerCase()}`
        console.log(player)
        fetch(`${VITE_BASE_URL}/playerimages/${player}`)
            .then(response => response.json())
            .then(playerImage => {
                setPlayerImage(playerImage)
            })
            .catch(() => navigate("/not-found"))
    }, [data, navigate])

    const [referenceData, setReferenceData] = useState({})
    const [playerStats, setPlayerStats] = useState([]);
    const [points, setPoints] = useState([]);
    const [assists, setAssists] = useState([]);
    const [rebounds, setRebounds] = useState([]);
    const [threePoints, setThreePoints] = useState([]);
    const [plusMinus, setPlusMinus] = useState([]);
    const [minutes, setMinutes] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState("2023");

    useEffect(() => {
        const fetchPlayerStats = async () => {
            const requestOptions = {
                method: "GET",
                url: VITE_X_RAPIDAPI_URL3,
                params: {
                    id: playerid,
                    season: selectedSeason,
                },
                headers: {
                    "X-RapidAPI-Key": `${VITE_X_RAPIDAPI_KEY2}`,
                    "X-RapidAPI-Host": `${VITE_X_RAPIDAPI_HOST2}`,
                },
            };

            try {
                const response = await axios(requestOptions);
                setPlayerStats(response.data.response);
                console.log(response.data)
                setReferenceData(response.data.response[0])
                setPoints(response.data.response.map((e) => e.points));
                setAssists(response.data.response.map((e) => e.assists));
                setRebounds(response.data.response.map((e) => e.defReb + e.offReb));
                setThreePoints(response.data.response.map((e) => e.tpm));
                setPlusMinus(response.data.response.map((e) => e.plusMinus));
                setMinutes(response.data.response.map((e) => e.min));
                setBlocks(response.data.response.map((e) => e.blocks));
            } catch (error) {
                console.error("Error fetching player statistics:", error);
            }
        };
        fetchPlayerStats();
    }, [playerid, selectedSeason]);

    const calculateAveragePointsPerGame = () => {
        if (!playerStats) return null;

        let totalPoints = 0;
        let totalGames = 0;
        playerStats.forEach((stat) => {
            const points = stat.points || 0;
            totalPoints += parseInt(points);
            totalGames++;
        });

        if (totalGames === 0) return 0;

        const averagePointsPerGame = totalPoints / totalGames;
        return averagePointsPerGame.toFixed(2);
    };

    const calculateAverageReboundsPerGame = () => {
        if (!playerStats) return null;

        let totalRebounds = 0;
        let totalGames = 0;
        playerStats.forEach((stat) => {
            const rebounds = stat.totReb || 0; // Assuming totReb represents total rebounds
            totalRebounds += parseInt(rebounds);
            totalGames++;
        });

        if (totalGames === 0) return 0;

        const averageReboundsPerGame = totalRebounds / totalGames;
        return averageReboundsPerGame.toFixed(2);
    };

    const calculateAverageAssistsPerGame = () => {
        if (!playerStats) return null;

        let totalAssists = 0;
        let totalGames = 0;
        playerStats.forEach((stat) => {
            const assists = stat.assists || 0;
            totalAssists += parseInt(assists);
            totalGames++;
        });
        if (totalGames === 0) return 0;
        const averageAssistsPerGame = totalAssists / totalGames;
        return averageAssistsPerGame.toFixed(2);
    };

    const calculateTotalBlocksForSeason = (playerStats) => {
        if (!playerStats) return 0;

        const totalBlocks = playerStats.reduce(
            (total, stat) => total + parseInt(stat.blocks || 0),
            0
        );
        return totalBlocks;
    };

    const calculateTotalAssistsForSeason = (playerStats) => {
        if (!playerStats) return 0;

        const totalAssists = playerStats.reduce(
            (total, stat) => total + parseInt(stat.assists || 0),
            0
        );
        return totalAssists;
    };

    const calculateTotalPointsForSeason = (playerStats) => {
        if (!playerStats) return 0;

        const totalPoints = playerStats.reduce(
            (total, stat) => total + parseInt(stat.points || 0),
            0
        );
        return totalPoints;
    };

    const getLastFiveGames = () => {
        if (!playerStats) return [];

        const sortedStats = playerStats.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        return sortedStats.slice(0, 5);
    };

    const overrides = {};

    const handleSeasonChange = (params) => {
        const { value } = params;
        if (value.length > 0) {
            setSelectedSeason(value[0].id);
        }
    };
    const seasonOptions = [
        { label: '2020', id: '2020' },
        { label: '2021', id: '2021' },
        { label: '2022', id: '2022' },
        { label: 'Current', id: '2023' },
    ];
    const selectedValue = seasonOptions.filter(option => option.id === selectedSeason);


    return (
        <div>
            <Block width="100%" display="flex" flexDirection="column" alignItems="center">
                <Block className="filler"></Block>
                <Block className="sub__heading" display="flex" justifyContent="space-between" alignItems="center" width="100%" backgroundColor="#ED751C" padding="20px">
                    <Block className="head__shot" $style={{ maxWidth: "250px", flexGrow: 1, marginLeft: "160px", marginBottom: "-6px" }}>
                        <img src={playerImage.image_url || 'https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png'} alt="Head Shot" style={{ height: "260px" }} />
                    </Block>
                    <Block className="info" display="flex" flexDirection="column" alignItems="center" $style={{ flexGrow: 3 }}>
                        <Block width="auto" maxWidth="300px" display="flex" alignItems="center" marginBottom="20px" marginTop="-30px">
                            <Select
                                options={[
                                    { id: '2020', label: '2020-2021' },
                                    { id: '2021', label: '2021-2022' },
                                    { id: '2022', label: '2022-2023' },
                                    { id: '2023', label: '2023-2024' },
                                ]}
                                labelKey="label"
                                valueKey="id"
                                onChange={handleSeasonChange}
                                value={selectedValue}
                                placeholder="Select..."
                                clearable={false}
                            />
                        </Block>
                        <HeadingLevel>
                            <Heading styleLevel={3}>{data.firstname} {data.lastname}</Heading>
                            <Heading styleLevel={6}>{referenceData.team ? referenceData.team.name : ""} {referenceData ? referenceData.pos : ""}</Heading>
                        </HeadingLevel>

                        <Block display="flex" justifyContent="space-around" width="50%">
                            <LabelXSmall>PPG</LabelXSmall>
                            <LabelXSmall>RPG</LabelXSmall>
                            <LabelXSmall>APG</LabelXSmall>
                            <LabelXSmall>TS%</LabelXSmall>
                        </Block>
                        <Block display="flex" justifyContent="space-around" width="50%">
                            <LabelMedium>{calculateAveragePointsPerGame()}</LabelMedium>
                            <LabelMedium>{calculateAverageReboundsPerGame()}</LabelMedium>
                            <LabelMedium>{calculateAverageAssistsPerGame()}</LabelMedium>
                            <LabelMedium>N/A</LabelMedium>
                        </Block>
                    </Block>
                    <Block className="team__logo" $style={{ flexGrow: 1, marginRight: "100px" }}>
                        {/* <img src={referenceData.team.logo} alt="Team Logo" style={{ height: "150px" }} /> */}
                        <Avatar
                            overrides={{
                                Avatar: {
                                    style: ({ $theme }) => ({
                                        borderRadius: "0",
                                        width: 'auto',
                                        objectFit: 'contain',
                                        height: 'auto',
                                        width: 'auto',
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                    }),
                                },
                                Root: {
                                    style: ({ $theme }) => ({
                                        borderRadius: "0",
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'visible',
                                        width: '170px',
                                        height: '170px',
                                    }),
                                },
                            }}
                            name={referenceData.team ? referenceData.team.name : ""}
                            size="100px"
                            src={referenceData.team ? referenceData.team.logo : ""}
                        />
                    </Block>
                </Block>
                <Block className="divider" width="100%" display="flex" flexDirection="column" alignItems="center">
                    <HeadingLarge color="black">Season Stats</HeadingLarge>
                    {points.length > 0 ? (
                        <Block className="graph" display="flex" justifyContent="center" alignItems="center" marginTop="-60px">
                            <MyGraph
                                playerStats={playerStats}
                                points={points}
                                assists={assists}
                                rebounds={rebounds}
                                threePoints={threePoints}
                                plusMinus={plusMinus}
                                minutes={minutes}
                                blocks={blocks}
                            />
                        </Block>
                    ) : (
                        <Spin />
                    )}
                </Block>
                <Block className="chart-container" width="100%" display="flex" flexDirection="column" alignItems="center" padding="scale500">
                    <Block width="50%" overflow="auto">
                        {playerStats ? (
                            <Table
                                overrides={overrides}
                                columns={[
                                    "Total Assists",
                                    "Total Blocks",
                                    "Total Points",
                                    "Team",
                                ]}
                                data={[
                                    [
                                        calculateTotalAssistsForSeason(playerStats),
                                        calculateTotalBlocksForSeason(playerStats),
                                        calculateTotalPointsForSeason(playerStats),
                                        //   playerStats[0].team.name,
                                    ],
                                ]}
                            />
                        ) : (
                            <p>Loading...</p>
                        )}
                    </Block>
                    <Block width="50%" overflow="auto">
                        <Block display="flex" justifyContent="center" width="100%">
                            <HeadingSmall color="black" marginTop="50px">Last 5 Games</HeadingSmall>
                        </Block>

                        {playerStats ? (
                            <Table
                                overrides={overrides}
                                columns={["Assists", "Blocks", "Points", "Team"]}
                                data={getLastFiveGames().map((stat) => [
                                    stat.assists,
                                    stat.blocks,
                                    stat.points,
                                    stat.team.name,
                                ])}
                            />
                        ) : (
                            <p>Loading...</p>
                        )}
                    </Block>
                </Block>
            </Block>
        </div>
    );
}

export default PlayerExample;
