import styles from '../../../styles/Pages/Dashboard/Support.module.scss';
import VerticalAuthorMenu from "../../../Component/Menu/VerticalAuthorMenu";
import HeaderDashboard from "../../../Component/Dashboard/HeaderDashboard";

const Support = () => {
    return(
        <div className={styles.container}>
            <div className={styles.containerMain}>
                <div className={styles.verticalMenuContainer}>
                    <VerticalAuthorMenu/>
                </div>
                <div className={styles.containerData}>
                    <HeaderDashboard/>
                    <div className={styles.supportContainer}>
                        <h3>Support</h3>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Support;