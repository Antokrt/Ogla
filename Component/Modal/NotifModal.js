import styles from '../../styles/Component/Modal/NotifModal.module.scss';
import { XCircleIcon } from "@heroicons/react/24/outline";
import anim from "../../styles/utils/anim.module.scss";
import { allDel, allReadReducer, selectNotifs } from '../../store/slices/notifSlice';
import { useDispatch, useSelector } from 'react-redux';
import Notif from './Notif';
import { DeleteAllNotifsService, ReadAllService } from '../../service/Notifications/NotificationsService';
import { selectTheme } from '../../store/slices/themeSlice';
import { CheckCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import { GetImgPathOfAssets } from "../../utils/ImageUtils";

export const NotifModal = ({ close }) => {
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
            DeleteAllNotifsService(allNotifs[0].date_creation)
                .then(() => {
                    dispatch(allDel())
                })
    }

    function readAllNotifs() {
        if (allNotifs.length > 0)
            ReadAllService(allNotifs[0].date_creation)
                .then(() => {
                    dispatch(allReadReducer())
                })
    }

    return <div className={theme ? styles.container : styles.container + ' ' + styles.dark}>
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

                        <img
                            className={styles.old}
                            alt={'Image Ogla'}
                            onError={(e) => e.target.src = '/assets/diapo/old.png'}
                            src={GetImgPathOfAssets() + 'diapo/old.png'}
                        />
                        <p> Vous n'avez pas de notifications </p>
                    </div>
            }
            {
                allNotifs.length > 0 &&
                <div className={styles.footer}>
                    <button className={styles.read} onClick={readAllNotifs}> Marquer comme lus <CheckCircleIcon /> </button>
                    <button className={styles.delete} onClick={DeleteAll}> Tout supprimer <TrashIcon /> </button>
                </div>
            }
        </div>
    </div>
}