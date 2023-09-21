import styles from '../../styles/Component/Sub/SubModal.module.scss';
import {XMarkIcon} from "@heroicons/react/24/outline";
import {useEffect, useState} from "react";
import {LoaderImg} from "../layouts/Loader";

export const SubModal = ({close}) => {


    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loader = setTimeout(() => setLoading(false), 3000);

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
                    <p>content</p>
            }
        </div>
    )
}