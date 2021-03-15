import React from "react";
import { Link } from 'react-router-dom';
export const Room = ({
    name,
    admin,
    players,
    onStartGamePressed
}) => (
    <div>
        <h1>{name}</h1>
        <Link to="/">Leave Room</Link>
        {
            admin ? <button onClick={onStartGamePressed} disabled={players.length < 2}>Start Game</button> : null
        }
        {players.map((player) => <div key={player.username}>{player.username}</div>)}
    </div>
)