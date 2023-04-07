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
            <svg id="visual" viewBox="0 0 900 600" version="1.1"><path d="M0 28L21.5 29.2C43 30.3 86 32.7 128.8 32.2C171.7 31.7 214.3 28.3 257.2 28.3C300 28.3 343 31.7 385.8 32.3C428.7 33 471.3 31 514.2 29.3C557 27.7 600 26.3 642.8 26.3C685.7 26.3 728.3 27.7 771.2 27.8C814 28 857 27 878.5 26.5L900 26L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z" fill="#16191c" stroke-linecap="round" stroke-linejoin="miter"/></svg>
        </div>
    )
}

export default MusicHome;