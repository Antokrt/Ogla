import styles from "../styles/Component/MusicHome.module.scss";

const MusicHome = () => {
    return (
        <div className={styles.container}>
            <div className={styles.background}>
            </div>
            <div className={styles.Text}>
                <h1> Découvrez l'option de musique ♫</h1>
                <p> Cette fonctionnalié est conçue pour vous accompagner dans vos moments de lecture. 
                    Elle vous permet d'écouter des morceaux de musique relaxants et apaisants, 
                    spécialement conçus pour favoriser la concentration et la détente..
                </p>
                <div className={styles.button}> En savoir plus.. </div>
            </div>
        </div>
    )
}

export default MusicHome;