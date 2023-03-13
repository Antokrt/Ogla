import styles from '../../styles/Component/Dashboard/Header.module.scss';

import SMSeachBar from "../SMSeachBar";
import {BellAlertIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {useSession} from "next-auth/react";

const HeaderDashboard = () => {

    const {data:session } = useSession();

    return(
        <div className={styles.container}>
            <SMSeachBar width={40}/>
            <div className={styles.sBlock}>
                <button className={styles.search}><MagnifyingGlassIcon className={styles.bell}/></button>
                <button className={styles.search}><BellAlertIcon className={styles.bell}/></button>
                <button className={styles.addBtnHeader}> + Nouveau livre</button>
                <img referrerPolicy={'no-referrer'} src={session?.user.image}/>
            </div>
        </div>
    )
}
export default HeaderDashboard;