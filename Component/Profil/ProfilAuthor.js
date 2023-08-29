import styles from "../../styles/Component/Profil/ProfilAuthor.module.scss";
import anim from "../../styles/utils/anim.module.scss";
import { useEffect, useRef, useState } from "react";
import Instagram from "../layouts/Icons/Social/instagram";
import { ArrowPathIcon, ArrowUturnLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import Twitter from "../layouts/Icons/Social/twitter";
import Facebook from "../layouts/Icons/Social/facebook";
import { UpdateLinksProfilAuthor, deleteLink } from "../../service/Dashboard/BooksAuthorService";
import { useSession } from "next-auth/react";
import { toastDisplayError } from "../../utils/Toastify";
import { CheckCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";

const ProfilAuthor = ({ type, content }) => {

    const [change, setChange] = useState(false);
    const [social, setSocial] = useState("");
    const [link, setLink] = useState("");;
    const { data: session } = useSession();
    const inputRef = useRef();

    useEffect(() => {
        setLink(content);
    }, [content])

    function isValidFacebookUrl(url) {
        const regex = new RegExp("^https:\/\/(?:www\.)?facebook\.com\/[^\\s]+$");
        const match = url.match(regex);
        return !!match;
    }

    function isValidTwitterUsername(url) {
        const regex = new RegExp("^@[a-zA-Z0-9_]{3,16}$");
        const match = url.match(regex);
        return !!match;
    }

    function isValidTiktokUsername(url) {
        const regex = new RegExp("^@[A-Za-z0-9._]{1,24}$");
        const match = url.match(regex);
        return !!match;
    }

    function changeLink() {
        switch (type) {
            case 1:
                if (social.length <= 1 || social.length > 31 || social[0] !== '@')
                    return toastDisplayError("Veuillez fournir un username valide.");
                UpdateLinksProfilAuthor(type, social.replace(/\s/g, ""))
                    .then(() => setLink(social.replace(/\s/g, "")))
                    .catch(() => toastDisplayError("Une erreur s'est produite."))
                setChange(false);
                break;

            case 2:
                if (isValidTiktokUsername(social) === false)
                    return toastDisplayError("Veuillez fournir un username valide.");
                UpdateLinksProfilAuthor(type, social)
                    .then(() => setLink(social))
                    .catch(() => toastDisplayError("Une erreur s'est produite."))
                setChange(false);
                break;

            case 3:
                if (isValidTwitterUsername(social) === false)
                    return toastDisplayError("Veuillez fournir un username valide.");
                UpdateLinksProfilAuthor(type, social)
                    .then(() => setLink(social))
                    .catch(() => toastDisplayError("Une erreur c'est produite."))
                setChange(false);
                break;

            case 4:
                if (isValidFacebookUrl(social) === false)
                    return toastDisplayError("Veuillez fournir un lien valide.");
                UpdateLinksProfilAuthor(type, social)
                    .then(() => setLink(social))
                    .catch(() => toastDisplayError("Une erreur s'est produite."))
                setChange(false);
                break;

            default:
                toastDisplayError("Ce réseau n'est pas géré par Ogla.");
        }
    }

    function supprLink() {
        deleteLink(type, session.user.id)
        .then(() => setLink(""))
        .catch(() => toastDisplayError("Une erreur s'est produite."));
    }

    useEffect(() => {
        if (change)
            inputRef.current.focus()
        console.log(content)
    }, [change])

    return (
        <div className={styles.container}>
            {
                type === 1 &&
                <div className={styles.Social}>
                    <label>Instagram <Instagram /></label>
                    {
                        link.length > 0 && !change &&
                        <div className={styles.isNotEmpty}>
                            <a title={link} href={"https://www.instagram.com/" + (link.substr(1))} rel={'noreferrer'} target="_blank" style={{ color: "#fb3958" }}>
                                {link}
                            </a>
                            <div className={styles.options}>
                                <ArrowPathIcon className={styles.leftOption} onClick={() => setChange(true)} />
                                <TrashIcon className={styles.rightOption} onClick={supprLink} />
                            </div>
                        </div>
                    }
                    {
                        change &&
                        <div className={styles.changed + ' ' + anim.fadeIn}>
                            <input className={anim.fadeIn} ref={inputRef} onChange={(e) => setSocial(e.target.value)} type={"text"} placeholder={"@username"} defaultValue={"@" + link.substr(1)} />
                            <div className={styles.options} >
                                <CheckCircleIcon className={styles.leftOption} onClick={changeLink} />
                                <ArrowUturnLeftIcon className={styles.rightOption} onClick={() => setChange(false)} />
                            </div>
                        </div>
                    }
                </div>
            }
            {
                type === 2 &&
                <div className={styles.Social}>
                    <label>
                        Tiktok
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M16 8.24537V15.5C16 19.0899 13.0899 22 9.5 22C5.91015 22 3 19.0899 3 15.5C3 11.9101 5.91015 9 9.5 9C10.0163 9 10.5185 9.06019 11 9.17393V12.3368C10.5454 12.1208 10.0368 12 9.5 12C7.567 12 6 13.567 6 15.5C6 17.433 7.567 19 9.5 19C11.433 19 13 17.433 13 15.5V2H16C16 4.76142 18.2386 7 21 7V10C19.1081 10 17.3696 9.34328 16 8.24537Z"></path>
                        </svg>
                    </label>
                    {
                        link.length > 0 && !change &&
                        <div className={styles.isNotEmpty}>
                            <a title={link} href={"https://www.tiktok.com/" + link} target="_blank" style={{ color: "#3b5998" }}>
                                {link}
                            </a>
                            <div className={styles.options}>
                                <ArrowPathIcon className={styles.leftOption} onClick={() => setChange(true)} />
                                <TrashIcon className={styles.rightOption} onClick={supprLink} />
                            </div>
                        </div>
                    }
                    {
                        change &&
                        <div className={styles.changed + ' ' + anim.fadeIn}>
                            <input className={anim.fadeIn} ref={inputRef} onChange={(e) => setSocial(e.target.value)} type={"text"} placeholder={"@username"} defaultValue="@" />
                            <div className={styles.options} >
                                <CheckCircleIcon className={styles.leftOption} onClick={changeLink} />
                                <ArrowUturnLeftIcon className={styles.rightOption} onClick={() => setChange(false)} />
                            </div>
                        </div>
                    }
                </div>
            }
            {
                type === 3 &&
                <div className={styles.Social}>
                    <label>Twitter <Twitter /></label>
                    {
                        link.length > 0 && !change &&
                        <div className={styles.isNotEmpty}>
                            <a title={link} href={"https://www.twitter.com/" + link} rel={'noreferrer'} target="_blank" style={{ color: "#1Da1f2" }}>
                                {link}
                            </a>
                            <div className={styles.options}>
                                <ArrowPathIcon className={styles.leftOption} onClick={() => setChange(true)} />
                                <TrashIcon className={styles.rightOption} onClick={supprLink} />
                            </div>
                        </div>
                    }
                    {
                        change &&
                        <div className={styles.changed + ' ' + anim.fadeIn}>
                            <input className={anim.fadeIn} ref={inputRef} onChange={(e) => setSocial(e.target.value)} type={"text"} placeholder={"@username"} defaultValue={"@" + link.substr(1)} />
                            <div className={styles.options} >
                                <CheckCircleIcon className={styles.leftOption} onClick={changeLink} />
                                <ArrowUturnLeftIcon className={styles.rightOption} onClick={() => setChange(false)} />
                            </div>
                        </div>
                    }
                </div>
            }
            {
                type === 4 &&
                <div className={styles.Social}>
                    <label>Facebook <Facebook /></label>
                    {
                        link.length > 0 && !change &&
                        <div className={styles.isNotEmpty}>
                            <a title={link} rel={'noreferrer'} href={link} target="_blank" style={{ color: "#3b5998" }}>
                                {link}
                            </a>
                            <div className={styles.options}>
                                <ArrowPathIcon className={styles.leftOption} onClick={() => setChange(true)} />
                                <TrashIcon className={styles.rightOption} onClick={supprLink} />
                            </div>
                        </div>
                    }
                    {
                        change &&
                        <div className={styles.changed + ' ' + anim.fadeIn}>
                            <input className={anim.fadeIn} ref={inputRef} onChange={(e) => setSocial(e.target.value)} type={"text"} placeholder={"url"} defaultValue="https://" />
                            <div className={styles.options} >
                                <CheckCircleIcon className={styles.leftOption} onClick={changeLink} />
                                <ArrowUturnLeftIcon className={styles.rightOption} onClick={() => setChange(false)} />
                            </div>
                        </div>
                    }
                </div>
            }
            {
                link.length === 0 && !change &&
                <div className={styles.empty}>
                    <h4> C&apos;est vide...  </h4>
                        <PlusCircleIcon  onClick={() => setChange(true)}/>
                </div>
            }
        </div>
    )
}

export default ProfilAuthor;