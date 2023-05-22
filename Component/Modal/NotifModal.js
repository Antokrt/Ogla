import styles from '../../styles/Component/Modal/NotifModal.module.scss';
import { BellAlertIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import anim from "../../styles/utils/anim.module.scss";
import scroll from "../../styles/utils/scrollbar.module.scss";
import { router, useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { allDel, allReadReducer, selectNotifs } from '../../store/slices/notifSlice';
import { useDispatch, useSelector } from 'react-redux';
import Notif from './Notif';
import { DeleteAllNotifs, readAll } from '../../service/Notifications/NotificationsService';
import { selectTheme } from '../../store/slices/themeSlice';

export const NotifModal = ({ close }) => {
    const router = useRouter();
    const { data: session } = useSession();
    const allNotifs = useSelector(selectNotifs);
    const dispatch = useDispatch();
    const theme = useSelector(selectTheme);

    const openSidebar = () => {
        return new Promise((resolve, reject) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('openSidebar', true);
                resolve();
            }
            else {
                reject();
            }
        })
    }

    function DeleteAll() {
        if (allNotifs.length > 0)
            DeleteAllNotifs(allNotifs[0].date_creation)
                .then(() => {
                    dispatch(allDel())
                })
    }

    function readAllNotifs() {
        if (allNotifs.length > 0)
            readAll(allNotifs[0].date_creation)
                .then(() => {
                    dispatch(allReadReducer())
                })
    }

    return <div className={theme? styles.container : styles.darkContainer}>
        <div className={styles.containerContent + ' ' + anim.scaleInModal}>
            <div className={styles.header}>
                <p></p>
                <h5>Notifications <span></span></h5>
                <XCircleIcon onClick={close} className={styles.close} />
            </div>
            {
                allNotifs.length > 0 ?
                    <div className={styles.contentNotif}>
                        {
                            allNotifs.map((elem, id) => {
                                return (
                                    <Notif key={id} element={elem} />
                                )
                            })
                        }
                    </div> :
                    <div className={styles.empty}>
                        {
                            !theme &&
                            <img src={'/assets/diapo/old.png'} />
                        }
                        {
                            theme &&
                            <img src={'/assets/jim/smile7.png'} />
                        }
                        <p> Vous n'avez pas de notifications </p>
                    </div>
            }
            {
                allNotifs.length > 0 &&
                <div className={styles.footer}>
                    <h3 className={styles.lus} onClick={readAllNotifs}> Marquer comme lue(s)</h3>
                    <h3 className={styles.suppr} onClick={DeleteAll}> Tout supprimer </h3>
                </div>
            }
        </div>
    </div>
}