import styles from '../styles/Component/Partner.module.scss';
import {GetImgPathOfAssets} from "../utils/ImageUtils";
import React from "react";
import ScreenSize from "../utils/Size";

export const Partner = () => {

    const [width, height] = ScreenSize();


    return (
        <div className={styles.container}>

            <div className={styles.imgContainer}>
                <img src={GetImgPathOfAssets() + 'category/banner/autre2.png'}
                     alt={'Image Ogla Livres'}/>
            </div>


            <div className={styles.rContainer}>
                <h3>Lettre à nos futurs écrivains...</h3>
                <p>
                    L'aventure Ogla ne fait que commencer, et nous sommes ravis de vous avoir à nos côtés. <br/> Nous croyons
                    fermement en l'importance de donner à chacun l'opportunité de vivre l'expérience unique d'être écrivain.
                </p>
                <a href={'/news'}>Lire plus</a>

            </div>

        </div>
    )
}