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
                <h3>Lettre aux futurs écrivains...</h3>
                <p>
                    L'aventure Ogla ne fait que commencer, et nous sommes ravis de vous avoir à nos côtés. <br/> Notre
                    principale valeur est de vous donner l&apos;opportunité de vous découvrir en tant qu&apos;écrivain ainsi que nous faire part de votre talent.
                </p>
                <a href={'/news'}>Lire plus</a>

            </div>

        </div>
    )
}