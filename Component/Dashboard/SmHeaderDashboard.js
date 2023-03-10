import styles from '../../styles/Component/Dashboard/SmHeader.module.scss';

import SMSeachBar from "../SMSeachBar";
import {BellAlertIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {useSession} from "next-auth/react";

const HeaderDashboard = ({title}) => {

    const {data:session } = useSession();

    return(
        <div className={styles.container}>
            <div className={styles.sBlock}>
                <h6>{title}</h6>
            </div>
        </div>
    )
}
export default HeaderDashboard;