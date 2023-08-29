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
import {GetDefaultUserImgWhenError} from "../../utils/ImageUtils";

const Notif = ({ element }) => {

    const router = useRouter();
    const dispatch = useDispatch();

    function NavigateNotif() {
        switch (element.code) {
            case 1:
            case 10:
                // like de livre -> naviguer vers le livre
                // un utilisateur à commenté votre livre -> naviguer vers le livre et ouvrir commentaire
                dispatch(setActiveModalNotif(false));
                dispatch(setRead(element._id))
                GetOneBook(element.targetDocumentId)
                    .then((res) => {
                        if (element.code === 10)
                            localStorage.setItem('openSidebar', true);
                        ReadNotifService(element._id);
                        if (router.pathname.startsWith('/livre') && router.query.id === element.targetDocumentId)
                            window.location.reload()
                        router.push({
                            pathname: '/livre/' + element.targetDocumentId,
                            query: res.slug
                        })
                    }
                    )
                    .catch((err) => console.log(err));
                break;

            case 3:
                // Like de profil -> Naviguer vers le profil
                dispatch(setActiveModalNotif(false));
                dispatch(setRead(element._id))
                ReadNotifService(element._id);
                localStorage.setItem('side', 'writer');
                router.push('/profil')
                break;

            case 4:
            case 5:
            case 6:
            case 7:
            case 11:
            case 2:
            case 20:
            case 21:
                // Like de commentaire -> Livre ou Chapitre
                // Like de réponse -> Livre ou Chapitre
                // Like du commentaire par l'autheur -> Livre ou Chapitre
                // Like d'une réponse par l'autheur -> Livre ou Chapitre
                // Un utilisateur à commenté votre chapitre
                // Like de chapitre -> naviguer vers le chapitre en question 
                // Vous avez une réponse
                // Vous avez une réponse de l'auteur
                dispatch(setActiveModalNotif(false));
                dispatch(setRead(element._id))
                if (element.secondTargetDocumentId === "null") {
                    GetOneBook(element.targetDocumentId)
                        .then((res) => {
                            localStorage.setItem('openSidebar', true);
                            ReadNotifService(element._id);
                            console.log(router.pathname)
                            if (router.pathname.startsWith('/livre') && router.query.id === element.targetDocumentId)
                                router.reload()
                            router.push({
                                pathname: '/livre/' + element.targetDocumentId,
                                query: res.slug
                            })
                        }
                        )
                        .catch((err) => console.log(err));
                }
                else {
                    GetChapterById(element.targetDocumentId)
                        .then((resChap) => {
                            GetOneBook(element.secondTargetDocumentId)
                                .then((res) => {
                                    res.chapter_list.forEach((elem, index) => {
                                        if (elem === element.targetDocumentId) {
                                            let numberI = index + 1;
                                            if (element.code !== 2)
                                                localStorage.setItem('openSidebar', true);
                                            ReadNotifService(element._id);
                                            if (router.pathname.startsWith('/chapitre') && router.query.id === element.targetDocumentId)
                                                window.location.reload()
                                            router.push({
                                                pathname: '/chapitre/' + element.targetDocumentId,
                                                query: { slug: resChap.slug, i: numberI },
                                            })
                                        }
                                    })
                                })

                        })
                        .catch((err) => console.log(err));
                }
                break;

            default:
                console.log("error code : " + element.code)
                break;
        }
    }

    function DeleteOneNotif() {
        DeleteAllNotifsService(element._id)
            .then(() => dispatch(deleteOne(element._id)))
            .catch((err) => console.log(err))
    }

    return (
        <div className={styles.container}>
            <div className={!element.read ? styles.itemNotif + ' ' + anim.scaleInModal : styles.itemNotifOpen} onClick={NavigateNotif}>
                <div className={styles.cntImg}>
                    <img className={anim.fadeIn} referrerPolicy={'no-referrer'} src={element.content.sender.img} onError={(e) => e.target.src = GetDefaultUserImgWhenError() } />
                    {
                        !element.read &&
                        <div className={styles.notRead}> </div>
                    }
                </div>
                <div className={styles.content}>
                    <h6 className={!element.read ? styles.notRead : styles.read}> {element.content.content.text} </h6>
                    <div className={styles.date}>
                        <p className={styles.date}> {FormatDateFrom(element.content.date_creation)} </p>
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