import styles from "../styles/Component/Banner.module.scss";
import {useSession} from "next-auth/react";

export default function Banner() {
    const {data: session} = useSession();
    return (
        <div className={styles.container}>
            <div className={styles.HomeCenterBlock}>
                <div className={styles.HomeTextBlock}>
                    <div className={styles.HomeCenterTitle}>
                        <h1> Commencez votre voyage avec <span>OGLA</span> ! </h1>
                        <p> Découvrez des histoires captivantes et des
                            aventures passionantes qui vous ferons voyager au-delà de votre imagination... </p>
                        <button> Voir la librairie</button>
                        <p className={styles.token}>{session?.user?.accessToken}</p>
                    </div>
                </div>
                    <img className={styles.welcomeDesktop} src={'/assets/diapo/Welcome.png'}/>


            </div>
            <img className={styles.mountain} src={'/assets/diapo/mountain2.png'}/>
            <svg id="visual" viewBox="0 0 960 540" version="1.1">
                <path
                    d="M0 507L22.8 507C45.7 507 91.3 507 137 508.7C182.7 510.3 228.3 513.7 274 515.3C319.7 517 365.3 517 411.2 516C457 515 503 513 548.8 512.5C594.7 512 640.3 513 686 513.8C731.7 514.7 777.3 515.3 823 515.5C868.7 515.7 914.3 515.3 937.2 515.2L960 515L960 541L937.2 541C914.3 541 868.7 541 823 541C777.3 541 731.7 541 686 541C640.3 541 594.7 541 548.8 541C503 541 457 541 411.2 541C365.3 541 319.7 541 274 541C228.3 541 182.7 541 137 541C91.3 541 45.7 541 22.8 541L0 541Z"
                    fill="#1C232B" stroke-linecap="round" stroke-linejoin="miter"/>
            </svg>
        </div>
    )
}