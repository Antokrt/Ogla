import styles from '../../styles/Component/Sub/SubModal.module.scss';
import {CheckBadgeIcon, StarIcon, XMarkIcon} from "@heroicons/react/24/solid";
import {useEffect, useState} from "react";
import {LoaderImg} from "../layouts/Loader";
import {GetDefaultUserImgWhenError} from "../../utils/ImageUtils";
import {FormatDateStr} from "../../utils/Date";
import {ArrowsPointingInIcon, CursorArrowRaysIcon, PencilIcon} from "@heroicons/react/24/outline";
import {SubBtn} from "./SubBtn";

export const SubModal = ({close, img, pseudo, becameAuthor}) => {


    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loader = setTimeout(() => setLoading(false), 0);

        return () => clearTimeout(loader);
    }, [])

    return (
        <div className={styles.container}>
            <XMarkIcon onClick={() => close()} className={styles.close}/>
            {
                loading ?
                    <div className={styles.loaderContainer}>
                        <LoaderImg/>
                    </div> :
                    <div className={styles.containerMain}>

                        <div className={styles.promoContainer}>
                            <h6>Soutenez {pseudo} et ses créations en vous abonnant à son profil auteur</h6>
                        </div>


                        <div className={styles.header}>
                            <div className={styles.containerImg}>
                                <img src={img} alt={'Img Profil'}
                                     onError={(e) => e.target.src = GetDefaultUserImgWhenError()}/>
                            </div>

                            <div className={styles.contentHeader}>
                                <h4>{pseudo} <CheckBadgeIcon/></h4>
                                <p>Auteur Ogla depuis le {FormatDateStr(becameAuthor)}.</p>
                                <CursorArrowRaysIcon className={styles.icon}/>
                            </div>
                        </div>

                        <div className={styles.earnContainer}>
                            <h5>En vous abonnant à {pseudo}, vous aurez accès à :</h5>
                            <div className={styles.earnListContainer}>

                                <div className={styles.itemList}>
                                    <span className={styles.nb}>1</span>
                                    <p className={styles.value}><span>TOUS</span> les derniers chapitres de n'importe quel livre de <span>{pseudo}</span>.</p>
                                </div>

                                <div className={styles.itemList}>
                                    <span className={styles.nb}>2</span>
                                    <p className={styles.value}>
                                        Les dernières news privées
                                        de <span>{pseudo}.</span>
                                    </p>
                                </div>

                                <div className={styles.itemList}>
                                    <span className={styles.nb}>3</span>
                                <p className={styles.value}>
                                    Une reconnaissance éternelle de la part de
                                    l'auteur pour votre soutien ! 😉
                                </p>
                                </div>
                            </div>
                        </div>


                        <div className={styles.fixedContainer}>
                            <button><span className={styles.labelBtn}>S'abonner <StarIcon/> </span> <span className={styles.priceBtn}>3.99 €</span></button>
                        </div>


                    </div>
            }
        </div>
    )
}