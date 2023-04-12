import styles from "../styles/Component/MusicHome.module.scss";

const MusicHome = () => {
    return (
        <div className={styles.container}>

            <img src={'assets/diapo/music2.png'}/>
            <div className={styles.text}>
                <h5> La musique accompagne <span>OGLA ♫</span> </h5>
                <p> Cette fonctionnalié est conçue pour vous accompagner dans vos moments de lecture. 
                    Elle vous permet d'écouter des morceaux de musique relaxants et apaisants, 
                    spécialement conçus pour favoriser la concentration et la détente..
                </p>
                <button> En savoir plus.. </button>
            </div>
        </div>
    )
}

export default MusicHome;