import styles from '../styles/Component/Footer.module.scss';
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import Facebook from "./layouts/Icons/Social/facebook";
import Instagram from "./layouts/Icons/Social/instagram";
import Twitter from "./layouts/Icons/Social/twitter";
import DiscordIcon from "./layouts/Icons/Social/discord";
import { GetRandomBookService } from "../service/Book/BookService";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from 'react-redux';
import { changeTheme, selectTheme } from '../store/slices/themeSlice';
import { MoonIcon, MusicalNoteIcon, SunIcon } from "@heroicons/react/24/outline";
import { selectActiveMusicStatus, setActiveMusic } from "../store/slices/musicSlice";
import 'tippy.js/dist/tippy.css'
import Tippy from "@tippyjs/react";
import 'tippy.js/animations/scale.css';

export default function Footer() {
    const router = useRouter();
    const { data: session } = useSession();
    const theme = useSelector(selectTheme);
    const selectMusicState = useSelector(selectActiveMusicStatus);
    const dispatch = useDispatch();

    const getRandomBook = () => {
        GetRandomBookService()
            .then((res) => {
                router.push({
                    pathname: '/livre/' + res._id,
                    query: res.slug
                })
            })
    }

    function setTheme() {
        dispatch(changeTheme())
    }

    return (
        <div className={styles.container}>
            <div className={styles.socialLinks}>
                <h5>Rejoins OGLA sur Discord</h5>
                <div className={styles.social}>
                    <Facebook />
                    <Instagram />
                    <Link href={'https://twitter.com/OglaOff'} target={'_blank'} rel={'noreferrer'}>
                        <a target={'_blank'} rel={'noreferrer'}>
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
                            <li><Link href="/bibliotheque"><a
                                className={router.pathname === "/bibliotheque" ? styles.activeNav : ""}>Bibliothèque</a></Link>
                            </li>
                            {
                                !session || !session.user.is_author &&
                                <li><Link href="/"><a
                                    className={router.pathname === "/new-writer" ? styles.activeNav : ""}>Deviens
                                    écrivain</a></Link></li>
                            }

                            <li tabIndex={0} style={{ cursor: 'pointer' }} onClick={() => getRandomBook()}>Aléatoire</li>
                            <li className={styles.btn}>
                                <Tippy
                                    trigger={'mouseenter'}
                                    content={'Musique'}
                                    delay={[200, 0]}
                                    animation={'scale'}
                                    placement={'top'}
                                >
                                    <div
                                        className={styles.headphone}
                                        onClick={() => dispatch(setActiveMusic())}>
                                        <MusicalNoteIcon />
                                        {
                                            selectMusicState &&
                                            <div className={styles.animation}></div>
                                        }
                                    </div>
                                </Tippy>

                                {
                                    theme ?
                                        <Tippy
                                            trigger={'mouseenter'}
                                            content={'Thème'}
                                            delay={[200, 0]}
                                            animation={'scale'}
                                            placement={'bottom'}
                                        >
                                            <SunIcon onClick={setTheme} className={styles.svgTheme} />
                                        </Tippy>
                                        :
                                        <Tippy
                                            trigger={'mouseenter'}
                                            content={'Thème'}
                                            delay={[200, 0]}
                                            animation={'scale'}
                                            placement={'bottom'}
                                        >
                                            <MoonIcon onClick={setTheme} className={styles.svgTheme} />
                                        </Tippy>
                                }
                            </li>
                        </ul>
                    </div>

                    <div className={styles.plan}>
                        <h6>A propos</h6>
                        <ul>
                            <li><Link href={"/conditions-generales-d'utilisation"}>Conditions générales
                                d&apos;utilisation </Link></li>
                            <li><a href={'mailto:support@ogla.fr?subject=Demande d\'assistance Ogla'}>Support </a></li>
                            <li>© OGLA Tous droits réservés 2023
                            </li>
                            *
                        </ul>
                    </div>
                </div>

                <div className={styles.text}>
                    <h6>Qui sommes nous?</h6>
                    <p>Ogla est une plateforme d&apos;écriture et de lecture ouverte à tous. Grâce à Ogla, personne ne
                        vous empêchera d&apos;écrire votre histoire parce que nous croyons au pouvoir des mots.</p>
                </div>
            </div>
        </div>
    )
}

