import { AcademicCapIcon, ArrowLeftOnRectangleIcon, ArrowPathIcon, Bars3CenterLeftIcon, Bars3Icon, BellAlertIcon, BookOpenIcon, ChevronDownIcon, HomeIcon, KeyIcon, PencilIcon, Squares2X2Icon, StarIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSession, signOut} from "next-auth/react";
import { useEffect } from "react";
import { useState } from "react";
import styles from "../styles/Component/HeaderResponsive.module.scss";
import anim from "../styles/utils/anim.module.scss"
import { LogoutService } from "../service/User/Account.service";
import { useRouter } from "next/router";

const HeaderResponsive = () => {
    const [open, setOpen] = useState(false);
    const [close, setClose] = useState(false);
    const [closeOgla, setCloseOgla] = useState("not");
    const [openOgla, setOpenOgla] = useState(true);
    const [openAuthor, setOpenAuthor] = useState(false);
    const [closeAuthor, setCloseAuthor] = useState("not");
    const [animMouseUp, setAnimMouseUp] = useState("");
    const [query, setQuery] = useState("");
    const { data: session } = useSession();

    const router = useRouter()

    function SubmitForm(e) {
        e.preventDefault();
        e.target.reset();
        if (search.length !== 0 && search !== "undefined") {
            router.push({
                pathname: "/rechercher",
                query: { search: search }
            })
            submit();
            e.target.reset();
        }
        return null;
    }

    function OpenMenu() {
        setOpen(true);
        setClose(false);
    }

    async function CloseMenu() {
        setClose(true);
        setCloseOgla(true);
        setCloseOgla("not");
        setCloseAuthor("not");
        setTimeout(() => {
            setOpen(false);
        }, 150);
    }

    async function StateMenuOgla() {
        if (openOgla) {
            setOpenOgla(false);
            setCloseOgla("");
        }
        else {
            setOpenOgla(true);
        }
    }

    function StateMenuAuthor() {
        if (openAuthor) {
            setOpenAuthor(false);
            setCloseAuthor("");
        }
        else
            setOpenAuthor(true);
    }

    useEffect(() => {
        console.log(session?.user);
    }, [session])

    function handleMouseUp() {
        setAnimMouseUp("animMouseUp")
        setTimeout(() => {
            setAnimMouseUp("")
        }, 500)
    }

    function NavProfil() {
        if (session)
            router.push('/profil')
        else
            router.push({pathname: "/auth", query: "login"})
    }

    return (
        <div className={styles.HeaderResponsive}>
            {
                !open &&
                <div className={styles.HeaderResponsiveClosed}>
                    <h1 onClick={() => router.push("/")}> OGLA </h1>
                    <form className={styles.HeaderResponsiveOpenForm} onSubmit={(e) => SubmitForm(e)}>
                        <input
                            autoComplete={'off'}
                            onChange={(e) => setQuery(e.target.value)}
                            type="text"
                            name={"searchbar"}
                            placeholder="Cherchez un livre"
                        />
                    </form>
                    <Bars3Icon onClick={OpenMenu} />
                </div>
            }

            {
                open && !close &&
                <div className={styles.HeaderResponsiveOpen + " " + anim.fadeIn}>
                    <div className={styles.HeaderResponsiveOpenContent + " " + anim.slideInRight}>
                        <div  className={styles.otherDiv}>
                            <div className={styles.HeaderTop}>
                                <h1 onClick={() => router.push("/")}> OGLA </h1>
                                <XMarkIcon onClick={CloseMenu} />
                            </div>
                            <form className={styles.HeaderResponsiveOpenForm} onSubmit={(e) => SubmitForm(e)}>
                                <input
                                    autoComplete={'off'}
                                    onChange={(e) => setQuery(e.target.value)}
                                    type="text"
                                    name={"searchbar"}
                                    placeholder="Chercher un livre"
                                />
                            </form>
                            <div className={styles.HeaderResponsiveTitle}>
                                <div className={styles.HeaderResponsiveOpenSubject} onClick={StateMenuOgla}>
                                    <p> Ogla </p>
                                    <ChevronDownIcon className={openOgla ? styles.HeaderResponsiveOpenActive : styles.HeaderResponsiveOpenInactive} />
                                </div>
                            </div>
                            <div className={openOgla ? styles.HeaderResponsiveOpenMenu + ' ' + anim.scaleUpVerticalTop : `${styles["HeaderResponsiveOpenMenu" + closeOgla]} ${anim["scaleDownVerticalTop"]}`}>
                                <ul>
                                    <li onClick={() => router.push("/")} > <HomeIcon/> Accueil </li>
                                    <li onClick={() => router.push("/Category")}> <Bars3CenterLeftIcon/> Catégories </li>
                                    <li onClick={NavProfil}> <UserIcon/> Profil </li>
                                    <li onClick={() => router.push("/profil")}> <StarIcon/> Favoris </li>
                                    <li onClick={() => router.push("/profil")}> <ArrowPathIcon/> Aléatoire </li>
                                </ul>
                                {
                                    session &&
                                    <ul>
                                        <li onClick={() => router.push("/devenir-auteur")}> <BellAlertIcon/> Notifications </li>
                                    </ul>
                                }
                            </div>

                            <div className={styles.HeaderResponsiveTitle}>
                                <div className={styles.HeaderResponsiveOpenSubject} onClick={StateMenuAuthor}>
                                    <p> Author </p>
                                    <ChevronDownIcon className={openAuthor ? styles.HeaderResponsiveOpenActive : styles.HeaderResponsiveOpenInactive} />
                                </div>
                            </div>

                            {
                                <div className={openAuthor ? styles.HeaderResponsiveOpenMenu + ' ' + anim.scaleUpVerticalTop : `${styles["HeaderResponsiveOpenMenu" + closeAuthor]} ${anim["scaleDownVerticalTop"]}`}>
                                    {
                                        !session?.user?.is_author &&
                                        <ul>
                                            <li onClick={() => router.push("/devenir-auteur")}> <PencilIcon/> Devenir autheur </li>
                                        </ul>
                                    }
                                    {
                                        session && session?.user?.is_author &&
                                        <ul>
                                            <li onClick={() => router.push('/dashboard')}> <Squares2X2Icon/> Dashboard </li>
                                            <li onClick={() => router.push('/dashboard/books')}> <BookOpenIcon/> Mes livres </li>
                                            <li onClick={() => router.push('/dashboard/nouveau-livre')}> <PencilIcon/> Ecrire </li>
                                        </ul>
                                    }

                                </div>
                            }

                        </div>

                        {
                            session &&
                            <div className={styles.HeaderResponsiveOpenAccount}>
                                <div className={styles.HeaderBottomLeft}>                                
                                    <div className={styles.HeaderResponsiveOpenAccountImg} onClick={() => router.push('/profil')}>
                                        <img src={session?.user.image} alt="Photo de profil" />
                                    </div>
                                    {
                                        session?.user.is_author &&
                                        <div className={styles.testpenAnim}>
                                            <h2> {session?.user.author.firstName} {session?.user.author.lastName} </h2>
                                            <div style={{display: "flex"}}>
                                                <p> @{session?.user.pseudo} </p>
                                                <PencilIcon />
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div>
                                    {
                                        !session?.user.is_author &&
                                        <div>
                                            <h2> @{session?.user.pseudo} </h2>
                                            <p> Lecteur - Lectrice </p>
                                        </div>
                                    }
                                </div>
                                <ArrowLeftOnRectangleIcon onClick={() => {
                                    LogoutService()
                                        .then(() => signOut()
                                            .then(() => router.push('/')))
                                        .catch(() => signOut()
                                            .then(() => router.push('/')))
                                }}
                                title={'Se déconnecter'} />
                            </div>
                        }
                        {
                            !session &&
                            <div className={styles.HeaderResponsiveOpenAccountNoConnect}>
                                <div className={styles.HeaderSeConnecter} onClick={() => router.push({pathname: "/auth", query: "login"})}>
                                    <h3> Se connecter  </h3>
                                    <KeyIcon />
                                </div>
                                <div className={styles.HeaderSinscrire /* + " " + `${anim[animMouseUp  + "1"]}`*/} onClick={() => router.push({pathname: "/auth", query: "login"})} onMouseUp={handleMouseUp} >
                                    <h3> S'inscrire   </h3>
                                    <AcademicCapIcon />
                                </div>
                            
                            </div>
                        }

                    </div>
                    <div className={styles.HeaderVide} onClick={CloseMenu}>
                    </div>
                </div>
            }

            {
                open && close &&
                <div className={styles.HeaderResponsiveOpen + " " + anim.FadeOut}>
                    <div className={styles.HeaderResponsiveOpenContent + " " + anim.slideInLeft}>
                    <div  className={styles.otherDiv}>
                            <div className={styles.HeaderTop}>
                                <h1> OGLA </h1>
                                <XMarkIcon onClick={CloseMenu} />
                            </div>
                            <form className={styles.HeaderResponsiveOpenForm} onSubmit={(e) => SubmitForm(e)}>
                                <input
                                    autoComplete={'off'}
                                    onChange={(e) => setQuery(e.target.value)}
                                    type="text"
                                    name={"searchbar"}
                                    placeholder="Chercher un livre"
                                />
                            </form>
                            <div className={styles.HeaderResponsiveTitle}>
                                <div className={styles.HeaderResponsiveOpenSubject} onClick={StateMenuOgla}>
                                    <p> Ogla </p>
                                    <ChevronDownIcon className={openOgla ? styles.HeaderResponsiveOpenActive : styles.HeaderResponsiveOpenInactive} />
                                </div>
                            </div>
                            <div className={openOgla ? styles.HeaderResponsiveOpenMenu + ' ' + anim.scaleUpVerticalTop : `${styles["HeaderResponsiveOpenMenu" + closeOgla]} ${anim["scaleDownVerticalTop"]}`}>
                                <ul>
                                    <li> Accueil </li>
                                    <li> Catégories </li>
                                    <li> Profil </li>
                                    <li> Favoris </li>
                                    <li> Aléatoire </li>
                                </ul>
                                {
                                    session &&
                                    <ul>
                                        <li> Notifications </li>
                                    </ul>
                                }
                            </div>

                            <div className={styles.HeaderResponsiveTitle}>
                                <div className={styles.HeaderResponsiveOpenSubject} onClick={StateMenuAuthor}>
                                    <p> Author </p>
                                    <ChevronDownIcon className={openAuthor ? styles.HeaderResponsiveOpenActive : styles.HeaderResponsiveOpenInactive} />
                                </div>
                            </div>

                            {
                                <div className={openAuthor ? styles.HeaderResponsiveOpenMenu + ' ' + anim.scaleUpVerticalTop : `${styles["HeaderResponsiveOpenMenu" + closeAuthor]} ${anim["scaleDownVerticalTop"]}`}>
                                    {
                                        !session?.user?.is_author &&
                                        <ul>
                                            <li> Devenir autheur </li>
                                        </ul>
                                    }
                                    {
                                        session && session?.user?.is_author &&
                                        <ul>
                                            <li> Dashboard </li>
                                            <li> Mes livres </li>
                                            <li> Ecrire </li>
                                        </ul>
                                    }

                                </div>
                            }

                        </div>

                        {
                            session &&
                            <div className={styles.HeaderResponsiveOpenAccount}>
                                <div className={styles.HeaderBottomLeft}>                                
                                    <div className={styles.HeaderResponsiveOpenAccountImg}>
                                        <img src={session?.user.image} alt="Photo de profil" />
                                    </div>
                                    {
                                        session?.user.is_author &&
                                        <div className={styles.testpenAnim}>
                                            <h2> {session?.user.author.firstName} {session?.user.author.lastName} </h2>
                                            <div style={{display: "flex"}}>
                                                <p> @{session?.user.pseudo} </p>
                                                <PencilIcon />
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div>
                                    {
                                        !session?.user.is_author &&
                                        <div>
                                            <h2> @{session?.user.pseudo} </h2>
                                            <p> Lecteur - Lectrice </p>
                                        </div>
                                    }
                                </div>
                                <ArrowLeftOnRectangleIcon />
                            </div>
                        }
                        {
                            !session &&
                            <div className={styles.HeaderResponsiveOpenAccountNoConnect}>
                                <h3> Se connecter </h3>
                                <h3> S'inscrire </h3>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default HeaderResponsive;