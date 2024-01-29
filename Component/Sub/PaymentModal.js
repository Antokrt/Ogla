import styles from '../../styles/Component/Modal/PaymentModal.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {
    closePayment,
    selectInfosPaymentState,
    selectPaymentModalState,
    setActivePaymentModalState
} from "../../store/slices/subscriptionPaymentSlice";
import anim from "../../styles/utils/anim.module.scss";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {BodyOverflowUtils} from "../../utils/BodyUtils";
import {useEffect, useState} from "react";
import {GetDefaultUserImgWhenError} from "../../utils/ImageUtils";
import {LoaderImg} from "../layouts/Loader";
import {useSession} from "next-auth/react";
import {instance} from "../../service/config/Interceptor";
import {GetIntentService} from "../../service/Payment/PaymentsService";

export const PaymentModal = () => {

    const seeModal = useSelector(selectPaymentModalState);
    const infos = useSelector(selectInfosPaymentState);
    const dispatch = useDispatch();
    const [month,setMonth] = useState(1);
    const [loading,setLoading] = useState(false);
    const [intentSecret ,setIntentSecret] = useState(null);
    const [error,setError] = useState(false);
    const {data: session} = useSession();

    useEffect(() => {
        if(seeModal){
            setLoading(true);
            getIntent(1);

            setLoading(false);
        }
    },[seeModal])

    const closeModal = () => {
        dispatch(closePayment());
        dispatch(setActivePaymentModalState(false));
        setMonth(1);
        setIntentSecret(null);
    }

    const getIntent = async (month) => {
        try {
            const intent = await GetIntentService({authorId:infos.authorId,month_duration:month});
           setIntentSecret(intent.client_secret);
        }
        catch (e) {
            setError(true);
        }
    }

    const changeMonth = (newValue) => {
        setMonth(parseInt(newValue));
        const month = parseInt(newValue);
        const rangeVerif = month >= 1 && month <= 12 ;
        if(rangeVerif){
            setLoading(true);
            getIntent(parseInt(newValue))
                .then(() => setLoading(false))
                .catch(() => setLoading(false))
        }
    }

    if(seeModal && session){
        BodyOverflowUtils('hidden');
        return (
            <div className={styles.container}>
                <div className={styles.containerContent + ' ' + anim.scaleInModal}>
                    <XMarkIcon onClick={closeModal} className={styles.close}/>

                    <h3>Terminer l'achat</h3>

                    <div className={styles.recapContainer}>
                        <div className={styles.authorContainer}>
                            <p className={styles.recapTitle}>Récapitulatif d'achat</p>
                            <div>
                                <img referrerPolicy={'no-referrer'}  src={infos.authorImg}
                                     onError={(e) => e.target.src = GetDefaultUserImgWhenError()}
                                     alt={'Ecrivain Profil Ogla'}/>
                                <p>{infos.authorPseudo}</p>
                            </div>

                        </div>

                        <div className={styles.monthContainer}>
                            <div className={styles.periodContainer}>
                                <p className={styles.label}>Période </p>
                                <select onChange={(e) => changeMonth(e.target.value)} defaultValue={1}>
                                    <option value={1}>1 mois</option>
                                    <option value={3}>3 mois</option>
                                    <option value={6}>6 mois</option>
                                </select>
                            </div>

                            <div className={styles.priceContainer}>
                                <p className={styles.label}>Prix</p>
                                {
                                    !loading ?
                                        <p className={styles.price}>{3.99 * month} €</p>
                                        :
                                        <LoaderImg/>
                                }
                            </div>
                        </div>
                    </div>
                    {
                        intentSecret ? <h1>client_secret :{intentSecret}</h1> : <LoaderImg/>
                    }
                </div>

            </div>
        )
    }
    else {
        BodyOverflowUtils('initial');
    }

}