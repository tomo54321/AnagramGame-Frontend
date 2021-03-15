import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { socket } from '../Modules/Connection';
import { SetRoom as SetStaticRoom } from '../Modules/Room';
import { RoomState } from '../Constants/RoomStates';

export const Rooms = ({ history }) => {
    const [loading, setLoading] = useState(true);
    const [rooms, setRooms] = useState([]);

    const onRecieveRooms = useCallback((allRooms) => {
        setRooms(allRooms);
        setLoading(false);
    }, []);
    const onCreateAndJoin = useCallback((room) => {
        SetStaticRoom(room);
        history.push({
            pathname: `/${room.id}`
        })
    }, [history]);

    const onRefreshRooms = useCallback(() => {
        setLoading(true);
        setRooms([]);
        socket.emit("list rooms");
    }, [setLoading, setRooms]);

    useEffect(() => {
        socket.emit("list rooms");
        socket.on("list rooms", onRecieveRooms);
        socket.on("join room", onCreateAndJoin);
        return () => {
            socket.off("join room", onCreateAndJoin);
            socket.off("list rooms", onRecieveRooms);
        };
    }, [onRecieveRooms, onCreateAndJoin]);

    const lobbies = rooms.map(room => (
        <Link 
        to={`/${room.id}`} 
        key={room.id}
        className="room">
            <span className="name">{room.name}</span> 
            <div className="status">
                <span className="status">{room.state === RoomState.IN_LOBBY  ? "Joinable" : "In Game"}</span>
                <span className="players">{room.players.length} Players</span>
            </div>
        </Link>
    ))

    return(
        <div className="rooms">
            <div className="game-title">
                <h1>Wordle</h1>
                <b className="beta">BETA</b>
            </div>
            <div className="list">
                <div style={{ marginBottom: 10}}>
                    Welcome, {socket.io.opts.query.username}!
                </div>
                <div className="room-controls">
                    <button type="button" className="btn btn-primary" onClick={() => socket.emit("create room")}>Create Room</button>
                    <button type="button" className="btn btn-secondary" onClick={() => onRefreshRooms()}>Refresh</button>
                </div>
                <div className="room-list">
                    { loading ? "Loading..." : lobbies}
                </div>
            </div>
        </div>
    )

};