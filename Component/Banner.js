import styles from "../styles/Component/Banner.module.scss";
import {
    ChatBubbleLeftRightIcon, CheckIcon,
    CursorArrowRaysIcon,
} from "@heroicons/react/24/outline";
import {useRouter} from "next/router";
import {getSession, signIn, signOut, useSession} from "next-auth/react";
import {Capitalize} from "../utils/String";
import {useState} from "react";
import {LoginModal} from "./Modal/LoginModal";

export default function Banner() {
    const {data: session} = useSession();

    const router = useRouter();
    return (
        <div className={styles.container}>

            <div className={styles.absBlock}>

            </div>
            <div className={styles.mainA}>

                {
                    session ?
                        <>
                            <span className={styles.refre}>{session?.user.accessToken}</span>
                            <span className={styles.refre}>Userid : {session?.user.id}</span>

                            <h1>Bienvenue <span><strong>{Capitalize(session.user?.pseudo)}</strong></span></h1>
                            <p className={styles.presentation}><span
                                className={styles.bold}><strong>OGLA</strong></span> est une plateforme d’écriture et de
                                lecture de <strong>livres</strong> <strong>d'histoires</strong> ou
                                de <strong>romans</strong> ouverte à tous. Nous voulons que vous vous assuriez que
                                personne
                                ne puisse jamais vous empêcher d’écrire <strong>votre histoire </strong> parce que nous
                                croyons au pouvoir des <strong>mots</strong>.</p>
                        </>
                        :

                        <>
                        
                            <h1>Partagez vos histoires au monde entier avec <span><strong>OGLA</strong></span></h1>
                            <p className={styles.presentation}><span
                                className={styles.bold}><strong>OGLA</strong></span> est une plateforme d’écriture et de
                                lecture de <strong>livres</strong> <strong>d'histoires</strong> ou
                                de <strong>romans</strong> ouverte à tous. Nous voulons que vous vous assuriez que
                                personne
                                ne puisse jamais vous empêcher d’écrire <strong>votre histoire </strong> parce que nous
                                croyons au pouvoir des <strong>mots</strong>.</p>
                        </>
                }
                <div className={styles.blockBtn}>
                    <div className={styles.statsAuthor}>
                        <p className={styles.nb}><span>Déjà</span> 56</p>
                        <p className={styles.authorLabel}>auteurs</p>
                    </div>
                    <div className={styles.statsAuthor}>
                        <p className={styles.nb}><span>Pour</span> 120</p>
                        <p className={styles.authorLabel}>histoires</p>
                    </div>

                    <div className={styles.statsAuthor}>
                        <p className={styles.nb}><span>Et</span> 406</p>
                        <p className={styles.authorLabel}>chapitres</p>
                    </div>

                    <div className={styles.btnJoin}>
                        {
                            session && session.user.is_author ?
                                <button onClick={() => router.push('/dashboard')}>Ecrire
                                    <ChatBubbleLeftRightIcon/></button>
                                :
                                <button onClick={() => router.push('/devenir-auteur')}>Deviens
                                    écrivain <ChatBubbleLeftRightIcon/></button>
                        }
                    </div>
                </div>
            </div>
            <div className={styles.mainB}>
                <img className={styles.owl}
                     src={'assets/owl.png'}/>
                <div className={styles.bubbleContainer}>
                    <h5 className={styles.title}>Cette semaine <CursorArrowRaysIcon/></h5>
                    <div className={styles.textBg}>
                        <p><span>#</span>1</p>
                    </div>

                    <div className={styles.listContainer}
                    >
                        <div className={styles.item}>
                            <h5>Le village maudit</h5>
                            <div className={styles.author}>
                                <img src={'assets/profil-example.png'}/>
                                <p>Huang Jienk</p>
                            </div>
                            <p>Quelle n’est pas la surprise de Primabelle lorsqu’elle se réveille un jour coincée à
                                l’intérieur d’un roman qu’elle avait commencé à écrire elle-même. Voilà qu’elle incarne
                                une peintre méconnue qui finit, dans l’histoire, par être tuée par le personnage
                                masculin principal, le prince Rainsis. Le monde qu’elle avait créé dans ce roman n’avait
                                pas été tendre avec Rainsis. Non seulement son daltonisme lui empêche de discerner les
                                couleurs, mais en plus, il est évité de tous à cause d’une prophétie affirmant que
                                “celui qui est piégé dans un monde en noir et blanc remplira l’empire de sang”. Après
                                avoir été témoin de la souffrance de Rainsis, Primabelle décide d’empêcher cette
                                prophétie. Elle doit alors réussir à trouver l’âme sœur prédestinée de Rainsis. Le seul
                                problème, c’est qu’elle ne connaît rien de ce personnage féminin, à part le fait qu’elle
                                ait les cheveux noirs et les yeux de couleur pourpre. Primabelle parviendra-t-elle à
                                aider Rainsis à voir le monde en couleurs et à trouver le bonheur ?
                            </p>
                            <div className={styles.stats}>
                                <p><span className={styles.category}>Horreur</span> | <span className={styles.aut}>Huang Jienk</span> | <span
                                    className={styles.nb}>205 chapitres</span></p>
                            </div>
                        </div>
                    </div>
                    <button>Découvrir</button>
                </div>
            </div>
            {/*         <h1>Cette semaine</h1>

            <div className={styles.cardContainer}>

                <div className={styles.containerImg}>
<img src={"/assets/livre7.jpg"}/>
                </div>
                <div className={styles.contentContainer}>

                    <div className={styles.hADescription}>
                        <div className={styles.thumbnail}>
                            <p># 1</p>
                        </div>
                        <div className={styles.header}>
                            <h4>Cette semaine sur OGLA : {name}</h4>
                            <h3>The walking dead</h3>
                            <p>Horreur | Huang Liok | 120 chapitres | 785 j'aime(s)</p>
                        </div>

                        <div className={styles.descriptionContainer}>
                            <p>
                                She was pushed to a mysterious man and choose to run away. 6 years later, she brought back a little boy! The little boy is looking for a perfect man for his little fairy mommy : tall, 6 packs muscles and richest man!
                                “Mommy, how is this man?” The little boy pointed his finger to his magnified version of himself.
                                Bo Qingyue : “You ran away with my genes for so long. it’s time to admit you were wrong!
                            </p>
                        </div>
                    </div>


                    <button>Découvrir</button>
                </div>

            </div>*/}

            {/*       <SimpleImageSlider
                    width={width - useScrollbarSize().width}
                    height={height / 1.2}
                    images={slideImages}
                    showBullets={false}
                    showNavs={false}
                    autoPlay={true}
                    autoPlayDelay={7.0}
                />
*/}

        </div>
    )
}