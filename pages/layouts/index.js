import styles from '../../styles/Pages/Layout.module.scss';
import {useState} from "react";
import {CountLike, LikeBtn, LikeBtnWithCount, TextLikeBtn} from "../../Component/layouts/Btn/Like";
import {DeleteBtn, GoogleLoginBtn, LinkBtn, ReadBtn} from "../../Component/layouts/Btn/Link";
import CardBookPublic from "../../Component/Card/CardBook";
import {Loader1, Loader2} from "../../Component/layouts/Loader";
import {CheckBtn, CloseBtn} from "../../Component/layouts/Btn/ActionBtn";
import HotPost from "../../Component/Post/HotPost";
import PreviewHorizontalPost from "../../Component/Post/PreviewHorizontalPost";
import PreviewHorizontalPostList from "../../Component/Post/PreviewHorizontalPostList";
import {BookTitle, TitleComponent} from "../../Component/layouts/Text";
import MainSearchBar from "../../Component/MainSearchBar";

const Layouts = () => {
    const [hasLike, setHasLike] = useState(true);
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
             <LikeBtn isLike={hasLike} onLike={() => setHasLike(!hasLike)}/>
                <CountLike isLike={hasLike} onLike={() => setHasLike(!hasLike)}/>
                <TextLikeBtn nb={212} isLike={hasLike} onLike={() => setHasLike(!hasLike)}/>
                <ReadBtn text={'Lire'}/>
                <LinkBtn text={'Se connecter'}/>
                <DeleteBtn text={'Supprimer'}/>
                <GoogleLoginBtn text={'Se connecter avec google'}/>
                <CardBookPublic/>
                <Loader1/>
                <Loader2/>
                <CloseBtn/>
                <CheckBtn/>
                <TitleComponent title={'Populaire'}/>
                <PreviewHorizontalPostList title={'Populaire Horreur'}/>
                <BookTitle title={'Heyy'}/>
            </div>

            <div className={styles.grid}>
            </div>
        </div>
    )
}

export default Layouts;