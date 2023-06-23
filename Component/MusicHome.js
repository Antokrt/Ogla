import styles from "../styles/Component/MusicHome.module.scss";

const MusicHome = () => {
    return (

    <div className={styles.container}>

        <img className={styles.image} src={'/assets/diapo/music4.png'}/>

        <div className={styles.content}>
            <h5>La musique accompagne <span>OGLA </span></h5>
            <p> Cette fonctionnalié est conçue pour vous accompagner dans vos moments de lecture.
                Elle vous permet d'écouter des morceaux de musique relaxants et apaisants,
                spécialement conçus pour favoriser la concentration et la détente..
            </p>
            <div className={styles.btnContainer}>
                <button>En savoir plus</button>
            </div>
        </div>


    </div>
    )
}

export default MusicHome;