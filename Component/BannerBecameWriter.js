import styles from '../styles/Component/BannerBecameWriter.module.scss';
import ScreenSize from '../utils/Size';
export const BannerBecameWriter = () => {

    const [width, height] = ScreenSize();

    return(
        <div className={styles.container}>

            <div className={styles.content}>
                <div className={styles.title}>
                    <h5>Deviens à ton tour</h5>
                    {
                        width > 500 &&
                        <ul>
                            <li> <span> écrivain </span> </li>
                            <li> <span> romancier </span> </li>
                            <li> <span> créateur </span> </li>
                            <li> <span> poète </span> </li>
                            <li> <span> narrateur </span> </li>
                            <li> <span> rédacteur </span> </li>
                            <li> <span> rêveur </span> </li>
                        </ul>
                    }
                    {
                        width <= 500 &&
                        <h5> écrivain </h5>
                    }
                </div>
                <p>L'écriture est un voyage passionnant, et <strong>Ogla </strong> est votre guide. <br/> Rejoignez-nous et découvrez votre potentiel en tant qu'écrivain, tout en partageant vos histoires avec le monde entier.</p>
                <div className={styles.btnContainer}>
                    <button>C'est parti !</button>
                </div>
            </div>

            <img className={styles.image} src={'/assets/diapo/mountain.png'}/>

        </div>
    )
}