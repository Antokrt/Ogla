import styles from "../styles/Component/MusicHome.module.scss";
import {GetImgPathOfAssets} from "../utils/ImageUtils";

const MusicHome = () => {
    return (

        <div className={styles.container}>

            <img className={styles.image} onError={(e) => e.target.src = '/assets/diapo/music4.png'}
                 src={GetImgPathOfAssets() + 'diapo/music4.png'} alt={'Image Musique Ogla'}/>

            <div className={styles.content}>
                <h5>La musique accompagne <span>OGLA </span></h5>
                <p>Cette fonctionnalié est conçue pour vous accompagner dans vos moments de lecture.
                    Elle vous permet d&apos;écouter des morceaux de musique relaxants et apaisants,
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