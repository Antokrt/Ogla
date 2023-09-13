import styles from '../../styles/Component/Dashboard/SmHeader.module.scss';

import SMSeachBar from "../SMSeachBar";
import {BellAlertIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {useSession} from "next-auth/react";

const HeaderDashboard = ({title,nb}) => {

    return(
        <div className={styles.container}>
            <div className={styles.sBlock}>
                <h6>Tous mes <span className={styles.book}>livres</span> {nb && <span className={styles.nb}>{nb}</span>}</h6>
            </div>
        </div>
    )
}
export default HeaderDashboard;