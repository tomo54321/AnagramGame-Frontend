import { useCallback, useEffect, useState } from "react";
import { socket } from '../../Modules/Connection';

export const Leaderboard = ({
    allWords,
    players
}) => {

    const [clock, setClock] = useState(60);

    const onTick = useCallback(({ time }) => {
        setClock(time);
    }, [setClock]);

    useEffect(() => {
        socket.on("update game clock", onTick);
        return () => {
            socket.off("update game clock", onTick);
        };
    }, [onTick]);


    return(
        <div>
            <h1>Here's how you all did</h1>
            <h2>{clock}</h2>
            <hr />
            <p>All Possible Words:</p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent:"space-around" }}>
                {allWords.map((word) => <span key={word} style={{ display: "block", margin: 10 }}>{word}</span>)}
            </div>
            <hr />
            <p>Leaderboard</p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent:"space-around" }}>
                {players.sort((player_one, player_two) => (player_one.points > player_two) ? 1 : -1 ).map((player, index) => (
                    <div key={player.id}>
                        <b style={{display: "block"}}>#{index + 1} {player.username}</b>
                        <span>{player.points}pts</span>
                    </div>
                ))}
            </div>
        </div>
    )
}