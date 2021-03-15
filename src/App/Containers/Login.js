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
        <div className="home">
            <div className="game-title">
                <h1>Wordle</h1>
                <b className="beta">BETA</b>
            </div>
            <form onSubmit={e => {
                connectToServer();
                e.preventDefault();
            }}>
                <input type="text" placeholder="Username" className="form-control" onChange={e => setUsername(e.target.value)} value={username}/>
                <input type="submit" className="btn btn-primary" value="Login"/>
            </form>

            <small className="legal">&copy; Sharksfin {(new Date()).getFullYear()}</small>
        </div>
    )

};