import { toastDisplayError } from "../../utils/Toastify";
import { toastDisplayPromise } from "../../utils/Toastify";
import { GetCommentService } from "../../service/Comment/CommentService";
import HeaderResponsive from "../../Component/HeaderResponsive";
import ProfilAuthor from "../../Component/Profil/ProfilAuthor";

const testToast = () => {

    return (
        <div>
            <ProfilAuthor type={2} content={""}/>
        </div>
    )
}

export default testToast

