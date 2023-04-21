import { useContext } from "react"
import { SocketContext } from "../utils/context/socket"

const Notification = () => {
    const { socket, setSocket, BuildSocket } = useContext(SocketContext);
    return (
        <div> hihi </div>
    )
}

export default Notification