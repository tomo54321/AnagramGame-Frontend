import React from "react";
import { Room as StaticRoom, SetRoom as SetStaticRoom } from '../Modules/Room';
import { RoomState } from '../Constants/RoomStates';
import { socket } from '../Modules/Connection';
import { Room } from "./InGame/Room";
import { StarterCountdown } from './InGame/StarterCountdown';
import { Leaderboard } from './InGame/Leaderboard';
import { Game } from "./InGame/Game";

export class RoomManager extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            room: null
        };

        this.wasRoomAdmin = false;

        this.onConnectedToRoom = this.onConnectedToRoom.bind(this);
        this.onPlayerJoined = this.onPlayerJoined.bind(this);
        this.onPlayerLeft = this.onPlayerLeft.bind(this);
        this.onIAmAdmin = this.onIAmAdmin.bind(this);
        this.onRoomStateChange = this.onRoomStateChange.bind(this);
        this.onPlayerUpdate = this.onPlayerUpdate.bind(this);
    }

    componentDidMount(){
        if(StaticRoom !== null){
            this.setState({
                room: StaticRoom,
                loading: false
            });
            this.wasRoomAdmin = true;
            SetStaticRoom(null);
        } else {
            this.wasRoomAdmin = false;
            socket.emit("join room", { id: this.props.match.params.roomId });
            socket.on("join room", this.onConnectedToRoom);
        }

        socket.on("player joined", this.onPlayerJoined);
        socket.on("player left", this.onPlayerLeft);
        socket.on("new admin", this.onIAmAdmin);
        socket.on("update game state", this.onRoomStateChange);
        socket.on("player update", this.onPlayerUpdate);
    }
    componentWillUnmount(){
        socket.emit("leave room");
        if(!this.wasRoomAdmin){
            socket.off("join room", this.onConnectedToRoom);
        }
        socket.off("player joined", this.onPlayerJoined);
        socket.off("player left", this.onPlayerLeft);
        socket.off("new admin", this.onIAmAdmin);
        socket.off("update game state", this.onRoomStateChange);
        socket.off("player update", this.onPlayerUpdate);
    }

    onConnectedToRoom(roomData){
        this.setState({
            room: roomData,
            loading: false
        })
    }
    onPlayerJoined(player){
        const room = this.state.room;
        room.players.push(player);
        this.setState({ room });
    }
    onPlayerLeft(playerId){
        const room = this.state.room;
        const playerIndex = room.players.findIndex(player => player.id === playerId);
        if(playerIndex !== -1){
            room.players.splice(playerIndex, 1);
        }
        this.setState({ room });
    }
    onIAmAdmin(){
        const room = this.state.room;
        room.admin = true;
        this.setState({ room })
    }
    onRoomStateChange({ state, data }){
        this.setState(prevState => {
            const room = {...prevState.room, ...data};
            room.state = state;
            return { room };
        })
    }
    onPlayerUpdate({ playerId, data }) {
        const room = this.state.room;
        const playerIndex = room.players.findIndex(player => player.id === playerId);
        if(playerIndex !== -1){
            room.players[playerIndex] = data;
        }
        this.setState({ room });
    }

    render(){
        const { room, loading } = this.state;
        if(loading){ return <h1>Connecting...</h1> }
        if(room.state === RoomState.IN_LOBBY) { return <Room 
            name={room.name} 
            admin={room.admin} 
            players={room.players} 
            onStartGamePressed={e => {
                socket.emit("room action", { action: "start game", data: null });
                e.preventDefault();
            }}
            />}
        if(room.state === RoomState.START_COUNTDOWN){ return <StarterCountdown /> }
        if(room.state === RoomState.IN_GAME) { return <Game letters={room.letters} possibleWords={room.possibleWords} players={room.players}/> }
        if(room.state === RoomState.GAME_FINISH){ return <Leaderboard allWords={room.allWords} players={room.players}/> }
        return (
            <div>
                <h1>Playing...</h1>
            </div>
        )
    }

}