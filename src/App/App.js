import { useEffect, useState } from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import { Login } from './Containers/Login';
import { Rooms } from './Containers/Rooms';
import { socket } from './Modules/Connection';
import { RoomManager } from './Containers/RoomManager';

export const App = () => {
    const [connected, setConnected] = useState(false);
    useEffect(() => {
        socket.on("connect", () => {
            setConnected(true);
        });
        socket.on("disconnect", () => {
            setConnected(false);
        });
    }, []);
    if (!connected) { return <Login /> }

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Rooms} />
                <Route path="/:roomId" exact component={RoomManager} />
            </Switch>
        </BrowserRouter>
    )

};