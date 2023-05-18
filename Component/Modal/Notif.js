import { useEffect } from "react";
import styles from "../../styles/Component/Modal/Notif.module.scss"
import anim from "../../styles/utils/anim.module.scss";
import { FormatDateFrom } from "../../utils/Date";
import { useState } from "react";
import { useRouter } from "next/router";
import { GetOneBook } from "../../service/Book/BookService";
import { useDispatch } from "react-redux";
import { deleteOne, setActiveModalNotif, setRead } from "../../store/slices/notifSlice";
import { GetChapterById } from "../../service/Chapter/ChapterService";
import {
DeleteMyNotifsService,
    DeleteAllNotifsService, ReadNotifService
} from "../../service/Notifications/NotificationsService";
import { TrashIcon } from "@heroicons/react/24/outline";

const Notif = (element) => {

    const [text, setText] = useState([]);
    const [user, setUser] = useState("");
    const router = useRouter();
    const dispatch = useDispatch();
    useEffect(() => {
        // const str = element.element.content.content.text.split(' ');
        // setText(element.element.content.content.text.split(str[0]));
        // setUser(str[0])
        console.log(element)
    }, [element.element.read])

    function NavigateNotif() {
        switch (element.element.code) {
            case 1:
                // like de livre -> naviguer vers le livre en question
                dispatch(setActiveModalNotif(false));
                dispatch(setRead(element.element._id))
                GetOneBook(element.element.targetDocumentId)
                    .then((res) => {
                        ReadNotifService(element.element._id);
                        router.push({
                            pathname: '/livre/' + element.element.targetDocumentId,
                            query: res.slug
                        })
                    }
                    )
                    .catch((err) => console.log(err));
                break;

            case 2:
                // like de chapitre -> naviguer vers le chapitre en question
                dispatch(setActiveModalNotif(false));
                dispatch(setRead(element.element._id))
                GetChapterById(element.element.targetDocumentId)
                    .then((res) => {
                        ReadNotifService(element.element._id);
                        router.push({
                            pathname: '/chapitre/' + element.element.targetDocumentId,
                            query: { name: res.title, slug: res.slug, i: 1 },
                        })
                    })
                    .catch((err) => console.log(err));
                break;

            case 3:
                // like de profil -> naviguer vers le profil
                break;

            case 4:
                // like de commentaire ->
                break;

            case 5:
                // like de réponse ->
                break;

            case 6:
                // like du commentaire par l'autheur ->
                break;

            case 7:
                // like d'une réponse par l'autheur ->
                break;

            case 10:
                // un utilisateur à commenté votre livre ->
                dispatch(setActiveModalNotif(false));
                dispatch(setRead(element.element._id))
                GetOneBook(element.element.targetDocumentId)
                    .then((res) => {
                        // Ouvrir les commentaires
                        ReadNotifService(element.element._id);
                        router.push({
                            pathname: '/livre/' + element.element.targetDocumentId,
                            query: res.slug
                        })
                    }
                    )
                    .catch((err) => console.log(err));
                break;

            case 11:
                // un utilisateur à liker votre chapitre
                dispatch(setActiveModalNotif(false));
                dispatch(setRead(element.element._id))
                GetChapterById(element.element.targetDocumentId)
                    .then((res) => {
                        // Ouvrir les commentaires
                        ReadNotifService(element.element._id);
                        router.push({
                            pathname: '/chapitre/' + element.element.targetDocumentId,
                            query: { name: res.title, slug: res.slug, i: 1 },
                        })
                    })
                    .catch((err) => console.log(err));
                break;

            case 20:
                // Vous avez une réponse
                break;

            case 21:
                // Vous avez une réponse de l'autheur
                break;

            default:
                console.log("error code : " + element.element.code)
                break;
        }
    }

    function DeleteOneNotif() {
        DeleteAllNotifsService(element.element._id)
            .then(() => dispatch(deleteOne(element.element._id)))
            .catch((err) => console.log(err))
    }

    return (
        <div className={styles.container}>
            <div className={!element.element.read ? styles.itemNotif + ' ' + anim.scaleInModal : styles.itemNotifOpen} onClick={NavigateNotif}>
                <div className={styles.cntImg}>
                    <img src={element.element.content.sender.img} />
                    {
                        !element.element.read &&
                        <div className={styles.notRead}> </div>
                    }
                </div>
                <div className={styles.content}>
                    <h6 className={!element.element.read ? styles.notRead : styles.read}> {element.element.content.content.text} </h6>
                    <div className={styles.date}>
                        <p className={styles.date}> {FormatDateFrom(element.element.content.date_creation)} </p>
                    </div>
                </div>
            </div>
            <div className={styles.options} onClick={DeleteOneNotif}>
                <TrashIcon />
            </div>
        </div>
    )
}

export default Notif;