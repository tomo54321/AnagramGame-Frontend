import { useCallback, useEffect, useState } from "react";
import { socket } from '../../Modules/Connection';

export const Game = ({
    letters,
    possibleWords,
    players
}) => {

    const [availableLetters, setAvailableLetters] = useState(letters);
    const [guessedWords, setGuessedWords] = useState([]);
    const [entry, setEntry] = useState("");
    const [clock, setClock] = useState(120);
    
    const onTick = useCallback(({ time }) => {
        setClock(time);
    }, [setClock]);

    const onKeyPressed = useCallback((e) => {
        const letter = String.fromCharCode(e.keyCode).toLocaleLowerCase();
        console.log(letter);
        // If the letter hasn't been used?
        if(availableLetters.includes(letter)){
            // Add it to the entry
            setEntry(en => en + letter);
            // Find it in our available letters
            const letterIndex = availableLetters.findIndex(lettr => lettr === letter);
            // Remove it from our available letters
            setAvailableLetters(avLetters => {
                const letters = [...avLetters];
                letters.splice(letterIndex, 1);
                return letters;
            })
        } else if(e.keyCode === 13) { // If the user is submitting their entry?
            socket.emit("room action", { action: "submit guess", data: entry });

            setEntry("");
            setAvailableLetters(letters);
        }

    }, [availableLetters, letters, entry]);

    const onGuessedWord = useCallback(({ word }) => {
        const words = guessedWords;
        words.push(word);
        setGuessedWords(words);
    }, [setGuessedWords, guessedWords]);

    useEffect(() => {
        socket.on("update game clock", onTick);
        socket.on("guessed word", onGuessedWord);
        document.addEventListener("keypress", onKeyPressed);
        return () => {
            socket.off("update game clock", onTick);
            socket.off("guessed word", onGuessedWord);
            document.removeEventListener("keypress", onKeyPressed);
        };
    }, [onTick, onKeyPressed, onGuessedWord]);


    return(
        <div>
            <h1>Guess away!</h1>
            <h2>{clock}</h2>
            <p>Possible Words: {possibleWords}</p>
            <p>Gussed Words:</p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent:"space-around" }}>
                {guessedWords.map((word) => <span key={word} style={{ display: "block", margin: 10 }}>{word}</span>)}
            </div>
            <hr />
            <p>Entry: </p>
            <p>{entry}</p>
            <hr />
            <p>Available Letters:</p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent:"space-around" }}>
                {availableLetters.map((letter) => <span key={letter} style={{ display: "block", margin: 10 }}>{letter}</span>)}
            </div>
            <hr />
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent:"space-around" }}>
                {players.map(player => (
                    <div key={player.id}>
                        <b style={{display: "block"}}>{player.username}</b>
                        <span>{player.points}pts</span>
                    </div>
                ))}
            </div>
        </div>
    )
}