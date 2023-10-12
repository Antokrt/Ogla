import styles from "../../styles/Component/Post/FooterOnPost.module.scss"
import {
    ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import { LikeBtnSidebar } from "../layouts/Btn/Like";
import ScreenSize from "../../utils/Size";
import { HeadPhoneBtnOnFooter } from "../layouts/Btn/ActionBtn";
import { GetDefaultBookImgWhenError } from "../../utils/ImageUtils";
import { FormatCount } from "../../utils/NbUtils";
import { useSelector } from "react-redux";
import { selectTheme } from "../../store/slices/themeSlice";

const FooterOnBook = ({ openCommentary, openList, img, title, like, author, nbCommentary, nbChapter, likeBook, hasLike }) => {

    const [width, height] = ScreenSize();
    const theme = useSelector(selectTheme);

    if (width > 600 && height > 500) {
        return (
            <div className={theme ? styles.container : styles.container + ' ' + styles.dark}>
                <div className={styles.titleContainer + ' ' + styles.child}>
                    <img alt={'Image Livre Ogla'} src={img} onError={(e) => e.target.src = GetDefaultBookImgWhenError()} />
                    <div>
                        <p className={styles.titleBook}>{title}</p>
                        <p className={styles.like}>{FormatCount(like)} j'aimes - <span>{author}</span></p>
                    </div>
                </div>
                <div className={styles.likeContainer + ' ' + styles.child}>
                    <LikeBtnSidebar onLike={likeBook} isLike={hasLike} />
                </div>
                <div className={styles.commentAndListContainer + ' ' + styles.child}>
                    <HeadPhoneBtnOnFooter />
                    <div className={styles.b} onClick={openCommentary}>
                        <ChatBubbleBottomCenterTextIcon />
                        <p>{FormatCount(nbCommentary)} commentaire(s) </p>
                    </div>
                </div>
            </div>)
    }
    else {
        return null;
    }
}

export default FooterOnBook;