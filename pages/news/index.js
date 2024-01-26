import styles from '../../styles/Pages/NewsPage.module.scss';
import {HeaderMain} from "../../Component/HeaderMain";
import {HeaderMainResponsive} from "../../Component/HeaderMainResponsive";
import React from "react";
import ScreenSize from "../../utils/Size";
import Footer from "../../Component/Footer";
import {GetImgPathOfAssets} from "../../utils/ImageUtils";
import { useSelector } from 'react-redux';
import { selectTheme } from '../../store/slices/themeSlice';

const News = () => {
    const [width] = ScreenSize();
    const theme = useSelector(selectTheme);

    return (
        <div className={theme ? styles.container : styles.container + ' ' + styles.dark}>
            {
                width > 950 ?
                    <HeaderMain/> :
                    <div style={{width: '100%'}}>
                        <HeaderMainResponsive/>
                    </div>
            }
            <div className={styles.containerMain}>
                <div className={styles.bannerContainer}>
                    <div className={styles.leftContainer}>
                        <h1>
                            Lettre aux écrivains <span className={styles.points}>:</span>
                        </h1>
                        <h2>L&apos;aventure Ogla ne fait que commencer...</h2>
                        <p>Le 10/07/2023</p>
                    </div>

                    <div className={styles.imgContainer}>
                        <img src={GetImgPathOfAssets() + 'category/banner/autre.png'}
                             onError={(e) => e.target.src = '/assets/category/banner/autre.png'}
                             alt={'Image Ogla Livres'}/>
                    </div>
                </div>

                <div className={styles.containerText}>
                    <div className={styles.item}>
                        <h3>Introduction</h3>

                        <p>L&apos;aventure <span className={styles.imp}>Ogla</span> ne fait que commencer, et nous
                            sommes ravis de vous avoir à nos côtés. Notre
                            principale valeur est de vous donner l&apos;opportunité de vous découvrir en tant
                            qu&apos;écrivain ainsi que nous faire part de votre talent.
                        </p>

                        <p>Rejoignez nous et plonger dans un univers où vos mots prennent vie et où vos histoires
                            peuvent toucher les cœurs des lecteurs francophones. Dynamique, bienveillante notre communauté est là pour vous soutenir, vous encourager et vous guider à chaque étape de
                            votre expérience. Que vous souhaitiez écrire des policiers, des romances, des nouvelles ou
                            explorer d&apos;autres genres, Ogla vous offre la plateforme idéale pour partager votre voix
                            unique.</p>

                        <h3>Pourquoi Ogla ?</h3>

                        <p>
                            Notre plateforme a été créée pour répondre aux défis et aux difficultés auxquels de nombreux
                            écrivains sont confrontés dans le monde littéraire d&apos;aujourd&apos;hui. Nous comprenons les
                            obstacles
                            qui se dressent sur le chemin de la réalisation de vos rêves littéraires, tels que la
                            difficulté de se lancer dans l&apos;industrie ou encore pour trouver un éditeur. En terme de rémunération,
                           les revenus sont souvent mal équilibrés entre éditeurs et écrivains.
                        </p>

                        <p>
                            Dans le système traditionnel, l&apos;édition à compte d&apos;auteur peut souvent aboutir à
                            des
                            rétributions minimales pour les écrivains, ne représentant qu&apos;une petite fraction,
                            <span className={styles.imp}>   généralement autour de 10% du prix de vente du livre. </span>
                            Ces perspectives financières limitées peuvent être décourageantes pour les écrivains qui
                            rêvent de vivre de leur passion littéraire.
                        </p>

                        <h3>Quel futur ?</h3>
                        <p>
                            Nous sommes déterminés à vous soutenir et à reconnaître la valeur de votre
                            travail. À terme, nous prévoyons de mettre en place un <span className={styles.imp}> système de rémunération
                            équitable pour tous nos écrivains </span> qui contribuent à la communauté. Votre passion
                            pour l&apos;écriture pourrait éventuellement devenir une source de revenus, vous permettant
                            de
                            poursuivre votre passion et de faire vivre vos écrits.
                        </p>

                        <p>

                            Nous croyons en la <span
                            className={styles.imp}> valorisation de votre talent </span> et en votre droit
                            d&apos;être justement
                            rémunérés pour vos efforts et votre créativité. Notre plateforme vise à créer un
                            environnement où les écrivains peuvent atteindre un public plus large, bénéficier d&apos;une
                            plus
                            grande visibilité et obtenir des revenus plus équitables pour leurs œuvres.
                        </p>

                        <p>Nous espèrons qu&apos;Ogla vous plaira et avons hâte de découvrir vos premiers retours...</p>

                        <p><span className={styles.imp}>Nous vous souhaitons la bienvenue sur Ogla !</span></p>

                        <p className={styles.sign}>L&apos;equipe d&apos;Ogla</p>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}

export default News;