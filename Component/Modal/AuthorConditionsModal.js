import styles from '../../styles/Component/Modal/AuthorConditionsModal.module.scss';
import anim from "../../styles/utils/anim.module.scss";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {BackUp} from "../layouts/Btn/BackUp";

export const AuthorConditionsModal = ({close}) => {
    return (
        <div className={styles.container}>

            <div className={styles.containerContent + ' ' + anim.scaleInModal}>
                <XMarkIcon onClick={close} className={styles.close}/>

                <div className={styles.containerImg}>
                    <img src={process.env.NEXT_PUBLIC_ASSETS + 'logo/mountain.png'}/>
                </div>

                <div className={styles.containerTitle}>
                    <h3>Règlement écrivain</h3>
                    <p>Mis à jour le 09/06/23</p>
                </div>

                <h4>This privacy Policy will help you better understand how we collect, use and share your personal
                    information.
                </h4>

                <div className={styles.containerItem}>
                    <div className={styles.item}>
                        <h5>1. Cookies</h5>
                        <p>This privacy Policy will help you better understand how we collect, use and share your personal
                            information.This privacy Policy will help you better understand how we collect, use and share
                            your personal information.This privacy Policy will help you better understand how we collect,
                            use and share your personal information.This privacy Policy will help you better understand how
                            we collect, use and share your personal information.This privacy Policy will help you better
                            understand how we collect, use and share your personal information.This privacy Policy will help
                            you better understand how we collect, use and share your personal information.This privacy
                            Policy will help you better understand how we collect, use and share your personal
                            information.This privacy Policy will help you better understand how we collect, use and share
                            your personal information.</p>
                    </div>

                    <div className={styles.item}>
                        <h5>1. Cookies</h5>
                        <p>This privacy Policy will help you better understand how we collect, use and share your personal
                            information.This privacy Policy will help you better understand how we collect, use and share
                            your personal information.This privacy Policy will help you better understand how we collect,
                            use and share your personal information.This privacy Policy will help you better understand how
                            we collect, use and share your personal information.This privacy Policy will help you better
                            understand how we collect, use and share your personal information.This privacy Policy will help
                            you better understand how we collect, use and share your personal information.This privacy
                            Policy will help you better understand how we collect, use and share your personal
                            information.This privacy Policy will help you better understand how we collect, use and share
                            your personal information.</p>
                    </div>

                    <div className={styles.item}>
                        <h5>1. Cookies</h5>
                        <p>This privacy Policy will help you better understand how we collect, use and share your personal
                            information.This privacy Policy will help you better understand how we collect, use and share
                            your personal information.This privacy Policy will help you better understand how we collect,
                            use and share your personal information.This privacy Policy will help you better understand how
                            we collect, use and share your personal information.This privacy Policy will help you better
                            understand how we collect, use and share your personal information.This privacy Policy will help
                            you better understand how we collect, use and share your personal information.This privacy
                            Policy will help you better understand how we collect, use and share your personal
                            information.This privacy Policy will help you better understand how we collect, use and share
                            your personal information.</p>
                    </div>

                    <div className={styles.item}>
                        <h5>1. Cookies</h5>
                        <p>This privacy Policy will help you better understand how we collect, use and share your personal
                            information.This privacy Policy will help you better understand how we collect, use and share
                            your personal information.This privacy Policy will help you better understand how we collect,
                            use and share your personal information.This privacy Policy will help you better understand how
                            we collect, use and share your personal information.This privacy Policy will help you better
                            understand how we collect, use and share your personal information.This privacy Policy will help
                            you better understand how we collect, use and share your personal information.This privacy
                            Policy will help you better understand how we collect, use and share your personal
                            information.This privacy Policy will help you better understand how we collect, use and share
                            your personal information.</p>
                    </div>

                    <div className={styles.item}>
                        <h5>1. Cookies</h5>
                        <p>This privacy Policy will help you better understand how we collect, use and share your personal
                            information.This privacy Policy will help you better understand how we collect, use and share
                            your personal information.This privacy Policy will help you better understand how we collect,
                            use and share your personal information.This privacy Policy will help you better understand how
                            we collect, use and share your personal information.This privacy Policy will help you better
                            understand how we collect, use and share your personal information.This privacy Policy will help
                            you better understand how we collect, use and share your personal information.This privacy
                            Policy will help you better understand how we collect, use and share your personal
                            information.This privacy Policy will help you better understand how we collect, use and share
                            your personal information.</p>
                    </div>

                    <div className={styles.item}>
                        <h5>1. Cookies</h5>
                        <p>This privacy Policy will help you better understand how we collect, use and share your personal
                            information.This privacy Policy will help you better understand how we collect, use and share
                            your personal information.This privacy Policy will help you better understand how we collect,
                            use and share your personal information.This privacy Policy will help you better understand how
                            we collect, use and share your personal information.This privacy Policy will help you better
                            understand how we collect, use and share your personal information.This privacy Policy will help
                            you better understand how we collect, use and share your personal information.This privacy
                            Policy will help you better understand how we collect, use and share your personal
                            information.This privacy Policy will help you better understand how we collect, use and share
                            your personal information.</p>
                    </div>
                </div>


            </div>
        </div>
    )
}