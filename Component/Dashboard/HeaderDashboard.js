import styles from '../../styles/Component/Dashboard/Header.module.scss';

import SMSeachBar from "../SMSeachBar";
import {BellAlertIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

const HeaderDashboard = () => {

    const {data:session } = useSession();
    const router = useRouter();

    return(
        <div className={styles.container}>
            <h4>Tableau de bord</h4>
            <div className={styles.sBlock}>
                <button className={styles.search}><MagnifyingGlassIcon className={styles.bell}/></button>
                <button className={styles.search}><BellAlertIcon className={styles.bell}/></button>
                <img onClick={() => router.push('/profil') } referrerPolicy={'no-referrer'} src={session?.user.image}/>
            </div>
        </div>
    )
}
export default HeaderDashboard;