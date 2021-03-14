import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { socket } from '../Modules/Connection';
import { SetRoom as SetStaticRoom } from '../Modules/Room';

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
        <Link to={`/${room.id}`} key={room.id}>{room.name}<br /> {room.players.length} Players</Link>
    ))

    return(
        <div>
            <div>
                Username: {socket.io.opts.query.username}
            </div>
            <div>
                <button type="button" onClick={() => socket.emit("create room")}>Create Room</button>
                <button type="button" onClick={() => onRefreshRooms()}>Refresh</button>
            </div>
            <div>
                { loading ? "Loading..." : lobbies}
            </div>
        </div>
    )

};