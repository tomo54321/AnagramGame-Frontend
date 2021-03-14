import { useCallback, useState } from 'react';
import { socket } from '../Modules/Connection';

export const Login = () => {
    const [username, setUsername] = useState("");

    const connectToServer = useCallback(() => {
        if(socket.connected || username === ""){
            console.error("Already connected!");
            return;
        }

        socket.io.opts.query.username = username;
        socket.connect();

    }, [username]);

    return(
        <div>
            <form onSubmit={e => {
                connectToServer();
                e.preventDefault();
            }}>
                <input type="text" onChange={e => setUsername(e.target.value)} value={username}/>
                <input type="submit" value="Login"/>
            </form>
        </div>
    )

};