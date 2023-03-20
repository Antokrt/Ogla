import { useContext } from "react"
import { SocketContext } from "../utils/context/socket"

const Notification = () => {
    const { socket, setSocket, BuildSocket } = useContext(SocketContext);
    console.log(socket);
    return (
        <div> hihi </div>
    )
}

export default Notification