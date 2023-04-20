import styles from '../styles/Component/BannerBecameWriter.module.scss';
export const BannerBecameWriter = () => {
    return(
        <div className={styles.container}>

            <div className={styles.content}>
                <h5>Deviens écrivain à ton tour</h5>
                <p>L'écriture est un voyage passionnant, et <strong>Ogla </strong> est votre guide. <br/> Rejoignez-nous et découvrez votre potentiel en tant qu'écrivain, tout en partageant vos histoires avec le monde entier.</p>
                <div className={styles.btnContainer}>
                    <button>C'est parti !</button>
                </div>
            </div>

            <img className={styles.image} src={'/assets/diapo/mountain.png'}/>

        </div>
    )
}