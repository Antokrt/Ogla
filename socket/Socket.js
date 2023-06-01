import {useDispatch, useSelector} from "react-redux";
import {selectSocketStatus, setActiveSocket} from "../store/slices/socketSlice";
import {addNotif, selectNotifs, setAllNotifs} from "../store/slices/notifSlice";
import {useSession} from "next-auth/react";
import React, {useCallback, useEffect} from "react";
import {io} from "socket.io-client";

export const Socket = () => {
    const selectSocketState = useSelector(selectSocketStatus);
    const selectNotifsState = useSelector(selectNotifs);
    const dispatch = useDispatch();
    const { data: session } = useSession();

    const initializeSocket = useCallback(() => {
        if (session) {
            let socket;
            if (!selectSocketState) {
                socket = io("http://localhost:3008/notifications", {
                        auth: {
                            token: session?.user.accessToken
                        }
                    }
                );
                dispatch(setActiveSocket(true))
            }
            if (socket) {
                socket.emit("userId", 1190201)
                socket.removeAllListeners("status");
                socket.on("status", (notif) => {
                    dispatch(setAllNotifs(notif));
                })
                socket.removeAllListeners("new");
                socket.on("new", (notif) => {
                    dispatch(addNotif(notif));
                })
            }
        }
    }, [dispatch, selectNotifsState, selectSocketState, session])

    useEffect(() => {
        initializeSocket();
    }, [initializeSocket]);

    return (
        <h1 style={{ fontSize: "1px", zIndex: "-1", display: "none" }}>.</h1>
    )
}
