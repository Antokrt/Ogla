import { AcademicCapIcon, ArrowLeftOnRectangleIcon, ArrowPathIcon, Bars3Icon, BellAlertIcon, BookOpenIcon, ChevronLeftIcon, ChevronRightIcon, HomeIcon, KeyIcon, PencilIcon, Squares2X2Icon, StarIcon, UserIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useState } from "react";
import styles from "../styles/Component/HeaderResponsive.module.scss";

const HeaderResponsive = () => {
    const [open, setOpen] = useState(true);
    const [query, setQuery] = useState("");

    const session = useSession();

    function SubmitForm(e) {
        e.preventDefault();
        e.target.reset();
        if(search.length !== 0 && search !== "undefined") {
            router.push({
                pathname: "/rechercher",
                query: {search: search}
            })
            submit();
            e.target.reset();
        }
        return null;
    }

    return (
        <div className={styles.HeaderResponsive}>
            {
                !open &&
                <div className={styles.HeaderResponsiveClosed}>
                    <ChevronRightIcon />
                    Hey
                </div>
            }
            {
                open &&
                <div className={styles.HeaderResponsiveOpen}>
                    <ChevronLeftIcon />
                    <div>
                        <h1> OGLA </h1>
                        <form className={styles.HeaderResponsiveOpenForm} onSubmit={(e) => SubmitForm(e)}>
                            <input
                                autoComplete={'off'}
                                onChange={(e) => setQuery(e.target.value)} 
                                type="text" 
                                name={"searchbar"} 
                                placeholder="Cherchez un livre"
                            />
                        </form>
                    </div>
                    <div>
                        <div className={styles.HeaderResponsiveOpenSubject}> <p> Ogla </p> <p></p> </div>
                    
                        <div className={styles.HeaderResponsiveOpenMenu}>
                            <HomeIcon />
                            <h3> Accueil </h3>
                        </div>
                        <div className={styles.HeaderResponsiveOpenMenu}>
                            <Bars3Icon />
                            <h3> Catégories </h3>
                        </div>
                        <div className={styles.HeaderResponsiveOpenMenu}>
                            <UserIcon />
                            <h3> Profil </h3>
                        </div>
                        <div className={styles.HeaderResponsiveOpenMenu}>
                            <StarIcon />
                            <h3> Favories </h3>
                        </div>
                        
                        <div className={styles.HeaderResponsiveOpenMenu}>
                            <ArrowPathIcon />
                            <h3> Aléatoire </h3>
                        </div>
                        {
                                !session &&
                                <div style={{width:"100%"}} >
                                    <div className={styles.HeaderResponsiveOpenMenu}>
                                        <KeyIcon />
                                        <h3> Se connecter </h3>
                                    </div>
                                    <div className={styles.HeaderResponsiveOpenMenu}>
                                        <AcademicCapIcon />
                                        <h3> S'inscrire </h3>
                                    </div>
                                </div>
                        }
                        {
                                session &&
                                <div style={{width:"100%"}} >
                                    <div className={styles.HeaderResponsiveOpenMenu}>
                                        <BellAlertIcon />
                                        <h3> Notifications </h3>
                                    </div>
                                </div>
                        }
                        <div className={styles.HeaderResponsiveOpenLine}>  </div>
                        <div className={styles.HeaderResponsiveOpenSubject}> <p> author </p> <p></p> </div>
                    
                        {
                                session && !session?.user?.is_author &&
                                <div style={{width:"100%"}} >
                                <div className={styles.HeaderResponsiveOpenMenu}>
                                    <PencilIcon />
                                    <h3> Devenir autheur </h3>
                                </div>
                                </div>
                        }
                        {
                                session && session?.user?.is_author &&
                                <div style={{width:"100%"}} >
                                <div className={styles.HeaderResponsiveOpenMenu}>
                                    <Squares2X2Icon />
                                    <h3> Dashboard </h3>
                                </div>
                                <div className={styles.HeaderResponsiveOpenMenu}>
                                    <BookOpenIcon />
                                    <h3> Mes livres </h3>
                                </div>
                                <div className={styles.HeaderResponsiveOpenMenu}>
                                    <PencilIcon />
                                    <h3> Ecrire </h3>
                                </div>
                            </div>
                        }

                    </div>
                    {
                                session &&
                                <div style={{width:"100%"}} >
                                    <div className={styles.HeaderResponsiveOpenMenu}>
                                        <ArrowLeftOnRectangleIcon />
                                        <h3> Déconnection </h3>
                                    </div>
                                </div>
                        }
                </div>
            }
        </div>
    )
}

export default HeaderResponsive;