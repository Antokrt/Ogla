import { useSession } from "next-auth/react";
import { createContext, useContext, useMemo, useState } from "react";

export const SocketContext = createContext(undefined, undefined);

function SocketProvider ({ children }) {
    const [socket, setSocket] = useState({});

    const {data: session} = useSession();

    const BuildSocket = () => {
        if (session) {
            setSocket(io('http://localhost:3008/notifications'))
        }
    }

    const value = useMemo(() => {
        return {
            socket,
            setSocket,
            BuildSocket,
        }
    }, [socket]);

    return (
        <SocketContext.Provider value={ value } >
            {children}
        </SocketContext.Provider>
    )

}

export default SocketProvider;