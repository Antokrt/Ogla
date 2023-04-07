import styles from '../../styles/Component/Modal/NotifModal.module.scss';
import {BellAlertIcon, XCircleIcon, XMarkIcon} from "@heroicons/react/24/outline";
import anim from "../../styles/utils/anim.module.scss";
import scroll from "../../styles/utils/scrollbar.module.scss";
import {router, useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useEffect} from "react";


export const NotifModal = ({close}) => {
    const router = useRouter();
    const {data:session} = useSession();

    useEffect(() => {
        console.log(session)

    },[])

    const openSidebar = () => {
        return new Promise((resolve, reject) => {
            if(typeof window !== 'undefined'){
                localStorage.setItem('openSidebar',true);
                resolve();
            }
            else {
                reject();
            }

        })
    }

    const nb = 2;

/*    <p onClick={() => {

        openSidebar()
            .then(() => router.push({
                pathname: '/livre/642c12553fa0f3a26544dd1d',
            }))
            .catch(() => router.push({
                pathname: '/livre/642c12553fa0f3a26544dd1d',
            }))
    }}>Livre</p>*/

    return <div className={styles.container}>
        <div className={styles.containerContent + ' ' + anim.scaleInModal}>

            <div className={styles.header}>
                <p></p>
                <h5>Notifications <span></span></h5>
                <XCircleIcon onClick={close} className={styles.close}/>
            </div>


            {
                nb > 0 ?
                    <div className={styles.contentNotif}>

                        <div className={styles.itemNotif  + ' '+ anim.scaleInModal}>
                            <img src={'/assets/profil-example.png'}/>
                            <div className={styles.content}>
                                <h6>BraytorLaCizaille a liké votre commentaire !</h6>
                                <p>"J'adore ce livre car..."</p>
                                <div className={styles.date}>
                                    <p className={styles.date}>Il y a quelques secondes...</p>
                                    <div></div>
                                </div>
                            </div>

                        </div>
                        <div className={styles.itemNotif}>
                            <img src={'/assets/profil-example.png'}/>
                            <div className={styles.content}>
                                <h6>BraytorLaCizaille a liké votre commentaire !</h6>
                                <p>"J'adore ce livre car..."</p>
                                <div className={styles.date}>
                                    <p className={styles.date}>Il y a quelques secondes...</p>
                                    <div></div>
                                </div>
                            </div>

                        </div>

                        <div className={styles.itemNotif}>
                            <img src={'/assets/profil-example.png'}/>
                            <div className={styles.content}>
                                <h6>BraytorLaCizaille a liké votre commentaire !</h6>
                                <p>"J'adore ce livre car..."</p>
                                <div className={styles.date}>
                                    <p className={styles.date}>Il y a quelques secondes...</p>
                                    <div></div>
                                </div>
                            </div>

                        </div>           <div className={styles.itemNotif}>
                        <img src={'/assets/profil-example.png'}/>
                        <div className={styles.content}>
                            <h6>BraytorLaCizaille a liké votre commentaire !</h6>
                            <p>"J'adore ce livre car..."</p>
                            <div className={styles.date}>
                                <p className={styles.date}>Il y a quelques secondes...</p>
                                <div></div>
                            </div>
                        </div>

                    </div>           <div className={styles.itemNotif}>
                        <img src={'/assets/profil-example.png'}/>
                        <div className={styles.content}>
                            <h6>BraytorLaCizaille a liké votre commentaire !</h6>
                            <p>"J'adore ce livre car..."</p>
                            <div className={styles.date}>
                                <p className={styles.date}>Il y a quelques secondes...</p>
                                <div></div>
                            </div>
                        </div>

                    </div>           <div className={styles.itemNotif}>
                        <img src={'/assets/profil-example.png'}/>
                        <div className={styles.content}>
                            <h6>BraytorLaCizaille a liké votre commentaire !</h6>
                            <p>"J'adore ce livre car..."</p>
                            <div className={styles.date}>
                                <p className={styles.date}>Il y a quelques secondes...</p>
                                <div></div>
                            </div>
                        </div>

                    </div>           <div className={styles.itemNotif}>
                        <img src={'/assets/profil-example.png'}/>
                        <div className={styles.content}>
                            <h6>BraytorLaCizaille a liké votre commentaire !</h6>
                            <p>"J'adore ce livre car..."</p>
                            <div className={styles.date}>
                                <p className={styles.date}>Il y a quelques secondes...</p>
                                <div></div>
                            </div>
                        </div>

                    </div>

                        <div className={styles.itemNotif}>

                        </div>
                    </div> :

                    <div className={styles.empty}>
                        <img src={'/assets/jim/smile7.png'}/>
                        <p>Vous n'avez pas de notifications</p>
                    </div>
            }




        </div>
    </div>
}