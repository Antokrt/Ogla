import styles from '../../../styles/Pages/Dashboard/Support.module.scss';
import VerticalAuthorMenu from "../../../Component/Menu/VerticalAuthorMenu";
import HeaderDashboard from "../../../Component/Dashboard/HeaderDashboard";

const Support = () => {
    return (
        <div className={styles.container}>
            <div className={styles.containerMain}>
                <div className={styles.verticalMenuContainer}>
                    <VerticalAuthorMenu/>
                </div>
                <div className={styles.containerData}>
                    <HeaderDashboard/>
                    <div className={styles.supportContainer}>
                        <img src={'/assets/jim/smile6.png'}/>
                        <h3>Contactez nous</h3>
                        <p>Pour toute question ou problème technique, contactez notre équipe de support sur <span
                            className={styles.discord}>Discord</span> ou à l'adresse suivante : <strong><a
                            href={'mailto:support@ogla.fr?subject=Demande d\'assistance Ogla'}>support@ogla.fr</a> </strong></p>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Support;