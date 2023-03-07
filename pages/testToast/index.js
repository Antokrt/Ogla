import { toastDisplayError } from "../../utils/Toastify";
import { toastDisplayPromise } from "../../utils/Toastify";
import { GetCommentService } from "../../service/Comment/CommentService";

const testToast = () => {

    const aff = () => {
        console.log("eh")
        toastDisplayError("error");
    }

    // const prom = () => {
    //     return new Promise((resolve, reject) => {
    //         axios
    //     })
    // }

    return (
        <class>
            <button onClick={() => toastDisplayPromise(GetCommentService("book", "63ef5d00bdce627e84ee191b", 1, 3, true, "popular"))}> Notify !</button>
        </class>
    )
}

export default testToast

