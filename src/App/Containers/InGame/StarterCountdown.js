import { useCallback, useEffect, useState } from 'react';
import { socket } from '../../Modules/Connection';
export const StarterCountdown = () => {

    const [clock, setClock] = useState(3);

    const onTick = useCallback(({ time }) => {
        setClock(time);
    }, [setClock]);

    useEffect(() => {
        socket.on("update game clock", onTick);
        return () => {
            socket.off("update game clock", onTick);
        };
    }, [onTick]);

    return (
        <div>
            <b>{clock}</b>
        </div>
    )

};