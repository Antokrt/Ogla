import styles from '../../../styles/Pages/Dashboard/Support.module.scss';
import VerticalAuthorMenu from "../../../Component/Menu/VerticalAuthorMenu";
import HeaderDashboard from "../../../Component/Dashboard/HeaderDashboard";
import SmHeaderDashboard from "../../../Component/Dashboard/SmHeaderDashboard";
import VerticalPhoneMenu from "../../../Component/Menu/VerticalPhoneMenu";
import VerticalTabMenu from "../../../Component/Menu/VerticalTabMenu";
import ScreenSize from "../../../utils/Size";
import useOrientation from "../../../utils/Orientation";

const Support = () => {

    const [width, height] = ScreenSize();
    const orientation = useOrientation();


    return (
        <div className={styles.container}>
            <div className={styles.containerMain}>
                {
                    width < 700 && orientation === 'portrait' ?
                        <VerticalPhoneMenu/>
                        :
                        <>
                            {
                                width >= 700 && width <= 1050 ?
                                    <div className={styles.verticalTabContainer}>
                                        <VerticalTabMenu/>
                                    </div>
                                    :
                                    <div className={styles.verticalMenuContainer}>
                                        <VerticalAuthorMenu/>
                                    </div>
                            }
                        </>

                }
                <div className={styles.containerData}>
                    <SmHeaderDashboard title={'Support'}/>
                    <div className={styles.supportContainer}>
                        <img src={'/assets/diapo/old.png'}/>
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