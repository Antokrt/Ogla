import styles from '../../styles/Pages/NewsPage.module.scss';
import {HeaderMain} from "../../Component/HeaderMain";
import {HeaderMainResponsive} from "../../Component/HeaderMainResponsive";
import React from "react";
import ScreenSize from "../../utils/Size";
import Footer from "../../Component/Footer";
import {GetImgPathOfAssets} from "../../utils/ImageUtils";

const News = () => {
    const [width, height] = ScreenSize();

    return (
        <div className={styles.container}>
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
                            Lettre à nos écrivains <span className={styles.points}>:</span>
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

                        <p>L'aventure <span className={styles.imp}>Ogla</span> ne fait que commencer, et nous sommes ravis de vous avoir à nos côtés. Nous
                            croyons fermement en l'importance de donner à chacun l'opportunité de vivre l'expérience
                            unique d'être écrivain. Que vous soyez un débutant plein d'idées ou un écrivain chevronné en
                            quête de nouveaux défis, notre plateforme est conçue pour nourrir votre créativité et vous
                            accompagner dans votre parcours littéraire.
                        </p>

                        <p>Rejoignez-nous et plongez dans un univers où vos mots prennent vie et où vos histoires
                            peuvent toucher les cœurs des lecteurs du monde entier. Notre communauté dynamique et
                            bienveillante est là pour vous soutenir, vous encourager et vous guider à chaque étape de
                            votre expérience. Que vous souhaitiez écrire des policiers, des romances, des nouvelles ou
                            explorer d'autres genres, Ogla vous offre la plateforme idéale pour partager votre voix
                            unique avec le monde.</p>

                        <h3>Pourquoi Ogla ?</h3>

                        <p>
                            Notre plateforme a été créée pour répondre aux défis et aux difficultés auxquels de nombreux
                            écrivains font face dans le monde littéraire d'aujourd'hui. Nous comprenons les obstacles
                            qui se dressent sur le chemin de la réalisation de vos rêves littéraires, tels que la
                            difficulté de se lancer dans l'industrie, les obstacles pour trouver un éditeur et les
                            revenus souvent modestes que l'on touche une fois que notre livre est publié.
                        </p>

                        <p>
                            Dans un système traditionnel, l'édition à compte d'auteur peut souvent aboutir à des
                            rétributions minimales pour les écrivains, ne représentant qu'une petite fraction,
                            <span className={styles.imp}>   généralement autour de 10% du prix de vente du livre </span>.
                            Ces perspectives financières limitées peuvent être décourageantes pour les écrivains qui
                            rêvent de vivre de leur passion littéraire.
                        </p>

                        <h3>Quel futur ?</h3>
                        <p>
                            Nous sommes déterminés à soutenir les écrivains et à reconnaître la valeur de leur
                            travail. À terme, nous prévoyons de mettre en place un <span className={styles.imp}> système de rémunération
                            équitable pour tous nos écrivains </span> qui contribuent à notre communauté. Votre passion
                            pour l'écriture pourrait éventuellement devenir une source de revenus, vous permettant de
                            poursuivre votre passion et de faire vivre vos écrits.
                        </p>

                        <p>

                            Nous croyons en la <span className={styles.imp}> valorisation du talent des écrivains </ span> et en leur droit d'être justement
                            rémunérés pour leurs efforts et leur créativité. Notre plateforme vise à créer un
                            environnement où les écrivains peuvent atteindre un public plus large, bénéficier d'une plus
                            grande visibilité et obtenir des revenus plus équitables pour leurs œuvres.
                        </p>

                        <p>Nous espèrons qu'Ogla vous plaira et avons hâte de découvrir vos premiers retours en tant qu'écrivain.</p>

                        <p><span className={styles.imp}>Nous vous souhaitons la bienvenue sur Ogla !</span> </p>

                        <p className={styles.sign}>L'equipe d'Ogla</p>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}

export default News;