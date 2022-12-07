import styles from '../styles/Component/Footer.module.scss';
import Link from "next/link";
import React, {useContext, useState} from "react";
import {LangueContext} from "../utils/context";
import {useRouter} from "next/router";
export default function Footer(){
const  langueActive  = useContext(LangueContext);
const router = useRouter();
    return(
        <div className={styles.container}>
            {
                router.pathname === "/" &&
                <div className={styles.socialLinks}>
                    <h5>Laisse écrire l'auteur qui est en toi</h5>
                    <div className={styles.social}>
                    </div>
                </div>
            }


            <div className={styles.linkFooter}>

                <div className={styles.planContainer}>
                    <div className={styles.plan}>
                        <h6>Plan</h6>
                        <ul>
                            <li><Link href="/"><a
                                className={router.pathname === "/" ? styles.activeNav : ""}>Accueil</a></Link></li>
                            <li><Link href="/Category"><a className={router.pathname === "/post" ? styles.activeNav : ""}>Derniers
                                ouvrages</a></Link></li>
                            <li><Link href="/"><a className={router.pathname === "/new-writer" ? styles.activeNav : ""}>Deviens
                                écrivain</a></Link></li>
                            <li><Link href="/"><a
                                className={router.pathname === "/contact" ? styles.activeNav : ""}>Contact</a></Link></li>
                        </ul>
                    </div>

                    <div className={styles.plan}>
                        <h6>A propos</h6>
                        <ul>
                            <li>Mentions légales</li>
                            <li>Données personnelles</li>
                            <li>Nous rejoindre</li>
                            <li>Conditions générales</li>
                            <li>© OGLA Tous droits réservés 2022
                            </li>

                        </ul>
                    </div>
                </div>


                <div className={styles.text}>
                    <h6>Qui sommes nous?</h6>
                <p>Ogla est une plateforme d’écriture et de lecture de livres, d’histoires ou de romans ouverte à tous. Nous voulons que vous vous assuriez que personne ne puisse jamais vous empêcher d’écrire votre histoire parce que nous croyons au pouvoir des mots.</p>

                    <p></p>
                </div>
            </div>


        </div>
    )
}

