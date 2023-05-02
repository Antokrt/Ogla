import styles from '../styles/Component/Footer.module.scss';
import Link from "next/link";
import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { LangueContext } from "../utils/context";
import Facebook from "./layouts/Icons/Social/facebook";
import Instagram from "./layouts/Icons/Social/instagram";
import Twitter from "./layouts/Icons/Social/twitter";
import DiscordIcon from "./layouts/Icons/Social/discord";
import { GetRandomBookService } from "../service/Book/BookService";
import { useSession } from "next-auth/react";
import { useSelector } from 'react-redux';
import { selectTheme } from '../store/slices/themeSlice';


export default function Footer() {
    const router = useRouter();
    const { data: session } = useSession();
    const theme = useSelector(selectTheme)

    const getRandomBook = () => {
        GetRandomBookService()
            .then((res) => {
                console.log(res);
                router.push({
                    pathname: '/livre/' + res._id,
                    query: res.slug
                })
            })
    }

    return (
        <div className={theme? styles.container : styles.darkContainer}>
            <div className={styles.socialLinks}>
                <h5>Rejoins OGLA sur Discord</h5>
                <div className={styles.social}>
                    <Facebook />
                    <Instagram />
                    <Link href={'https://twitter.com/OglaOff'} target={'_blank'} rel={'noopener'} >
                        <a target={'_blank'}>
                            <Twitter />
                        </a>

                    </Link>
                    <DiscordIcon />

                </div>
            </div>
            <div className={styles.linkFooter}>

                <div className={styles.planContainer}>
                    <div className={styles.plan}>
                        <h6>Plan</h6>
                        <ul>
                            <li><Link href="/"><a
                                className={router.pathname === "/" ? styles.activeNav : ""}>Accueil</a></Link></li>
                            <li><Link href="/cat"><a className={router.pathname === "/cat" ? styles.activeNav : ""}>Derniers
                                ouvrages</a></Link></li>
                            {
                                !session || !session.user.is_author &&
                                <li><Link href="/"><a className={router.pathname === "/new-writer" ? styles.activeNav : ""}>Deviens
                                    écrivain</a></Link></li>
                            }

                            <li style={{ cursor: 'pointer' }} onClick={() => getRandomBook()}>Aléatoire</li>

                            <li><Link href="/"><a
                                className={router.pathname === "/contact" ? styles.activeNav : ""}>Contact</a></Link></li>
                        </ul>
                    </div>

                    <div className={styles.plan}>
                        <h6>A propos</h6>
                        <ul>
                            <li>Mentions légales</li>
                            <li>Données personnelles</li>
                            <li>Conditions générales</li>
                            <li>Support</li>
                            <li>© OGLA Tous droits réservés 2022
                            </li>

                        </ul>
                    </div>
                </div>


                <div className={styles.text}>
                    <h6>Qui sommes nous?</h6>
                    <p>Ogla est une plateforme d’écriture et de lecture ouverte à tous. Grâce à Ogla, personne ne vous empêchera d’écrire votre histoire parce que nous croyons au pouvoir des mots.</p>

                    <p></p>
                </div>
            </div>
        </div>
    )
}

