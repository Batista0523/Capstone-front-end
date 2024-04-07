import React, { useEffect, useState } from "react";
import { Card, StyledBody, StyledAction, StyledThumbnail } from "baseui/card";
import { Button } from "baseui/button";
import { useNavigate } from "react-router-dom";
import { Block } from "baseui/block";

const PlayerCard = ({ player, personalData, primaryColor, secondaryColor, team }) => {
    const navigate = useNavigate();
    const [playerImage, setPlayerImage] = useState("https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png");
    const [textColor, setTextColor] = useState("white")

    useEffect(() => {
        switch (team) {
            case "San Antonio Spurs":
                setTextColor("black");
                break;
            default:
                setTextColor("white");
        }
    }, [team, secondaryColor]);


    useEffect(() => {

        const playerName = `${player.player.firstname.toLowerCase()}` + ` ${player.player.lastname.toLowerCase()}`

        const imageUrl = `${import.meta.env.VITE_BASE_URL}/playerimages/${playerName}`;
        fetch(imageUrl)
            .then((response) => response.json())
            .then((data) => {

                setPlayerImage(data.image_url);

            })
            .catch(() => {
                console.error("Failed to fetch player image");

            });
    }, [player.player.firstname, player.player.lastname, navigate]);


    return (
        <Card
            overrides={{
                Root: {
                    style: {
                        display: "flex",
                        justifyContent: "center",
                        width: "316px",
                        height: "179px",
                        marginBottom: "5px",
                        backgroundColor: primaryColor,
                        // backgroundColor: "#EA6607",
                        
                        borderRadius: "0",
                        border: "none",
                    }
                },
                Title: {
                    style: {
                       

                        fontSize: '19px',
                        textAlign: 'center',
                        marginTop: "-6px",
                        marginBottom: "18px",
                        lineHeight: "1.1",
                        // color: secondaryColor
                        color: textColor,
                        // paddingTop: "2px"
                    },
                }
            }}
            title={`${player.player.firstname} ${player.player.lastname}`}
        >
            <Block marginBottom="26px" marginTop="-16px">
                <StyledThumbnail
                    src={playerImage}
                    style={{ width: '240px', height: '180px',border: "none", marginTop: "-10px" }}
                />
                <StyledBody style={{ fontSize: "15px", fontWeight: "600", lineHeight: "1.1", marginTop: "23px", color: textColor }}>
                    

                </StyledBody>
            </Block>
        </Card>
    );
};

export default PlayerCard;
