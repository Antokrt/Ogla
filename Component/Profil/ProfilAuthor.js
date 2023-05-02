import styles from "../../styles/Component/Profil/ProfilAuthor.module.scss"
import { useEffect, useState } from "react";

import Instagram from "../layouts/Icons/Social/instagram";
import { ArrowPathIcon, ArrowUturnLeftIcon, CheckIcon, PlusIcon, PlusSmallIcon, TrashIcon } from "@heroicons/react/24/outline";
import Twitter from "../layouts/Icons/Social/twitter";
import Facebook from "../layouts/Icons/Social/facebook";
import { UpdateLinksProfilAuthor, deleteLink } from "../../service/Dashboard/BooksAuthorService";
import { useSession } from "next-auth/react";
import { toastDisplayError } from "../../utils/Toastify";

const ProfilAuthor = ({ type, content }) => {

    const [change, setChange] = useState(false);
    const [social, setSocial] = useState("");
    const [link, setLink] = useState("");;
    const {data: session} = useSession();

    useEffect(() => {
        setLink(content);
        console.log(type);
        console.log(content);
        console.log(session.user.id)
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

    function changeLink() {
        switch (type) {
            case 1:
                if (social.length <= 1 || social.length > 31 || social[0] !== '@')
                    return toastDisplayError("Votre nom d'utilisateur instagram doit être valide et commencer par un '@'.");
                UpdateLinksProfilAuthor(type, social.replace(/\s/g, ""))
                    .then(() => setLink(social.replace(/\s/g, "")))
                    .catch(() => toastDisplayError("Une erreur c'est produite."))
                setChange(false);
                break;

            case 2:
                if (isValidTwitterUsername(social) === false)
                    return toastDisplayError("Votre pseudonyme twitter doit commencer par '@'. Il doit également être un pseudonyme valide.");
                UpdateLinksProfilAuthor(type, social)
                    .then(() => setLink(social))
                    .catch(() => toastDisplayError("Une erreur c'est produite."))
                setChange(false);
                break;

            case 3:
                if (isValidFacebookUrl(social) === false)
                    return toastDisplayError("Veuillez fournir un lien valide.");
                UpdateLinksProfilAuthor(type, social)
                    .then(() => setLink(social))
                    .catch(() => toastDisplayError("Une erreur c'est produite."))
                setChange(false);
                break;

            default:
                toastDisplayError("Ce réseau n'est pas géré par Ogla.");
        }
    }

    function supprLink() {
        deleteLink(type, session.user.id)
        .then(() => setLink(""))
        .catch(() => toastDisplayError("Une erreur c'est produite."));
    }

    return (
        <div className={styles.container}>
            {
                type === 1 &&
                <div className={styles.Social}>
                    <label>Instagram <Instagram /></label>
                    {
                        link.length > 0 && !change &&
                        <div className={styles.isNotEmpty}>
                            <a href={"https://www.instagram.com/" + (link.substr(1))} target="_blank" style={{ color: "#fb3958" }}>
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
                        <div className={styles.changed}>
                            <input onChange={(e) => setSocial(e.target.value)} type={"text"} placeholder={"@"} defaultValue={"@" + link.substr(1)} />
                            <div className={styles.options} >
                                <CheckIcon className={styles.leftOption} onClick={changeLink}/>
                                <ArrowUturnLeftIcon className={styles.rightOption} onClick={() => setChange(false)} />
                            </div>
                        </div>
                    }
                </div>
            }
            {
                type === 2 &&
                <div className={styles.Social}>
                    <label>Twitter <Twitter /></label>
                    {
                        link.length > 0 && !change &&
                        <div className={styles.isNotEmpty}>
                            <a href={"https://www.twitter.com/" + link} target="_blank" style={{ color: "#1Da1f2" }}>
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
                        <div className={styles.changed}>
                            <input onChange={(e) => setSocial(e.target.value)} type={"text"} placeholder={"@"} defaultValue={"@" + link.substr(1)} />
                            <div className={styles.options} >
                                <CheckIcon className={styles.leftOption} onClick={changeLink} />
                                <ArrowUturnLeftIcon className={styles.rightOption} onClick={() => setChange(false)} />
                            </div>
                        </div>
                    }
                </div>
            }
            {
                type === 3 &&
                <div className={styles.Social}>
                    <label>Facebook <Facebook /></label>
                    {
                        link.length > 0 && !change &&
                        <div className={styles.isNotEmpty}>
                            <a href={link} target="_blank" style={{ color: "#3b5998" }}>
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
                        <div className={styles.changed}>
                            <input onChange={(e) => setSocial(e.target.value)} type={"text"} placeholder={"url"} defaultValue="https://" />
                            <div className={styles.options} >
                                <CheckIcon className={styles.leftOption} onClick={changeLink} />
                                <ArrowUturnLeftIcon className={styles.rightOption} onClick={() => setChange(false)} />
                            </div>
                        </div>
                    }
                </div>
            }
            {
                link.length === 0 && !change &&
                <div className={styles.empty}>
                    <h4> C'est vide...  </h4>
                    <div className={styles.add} onClick={() => setChange(true)}>
                        <PlusSmallIcon />
                    </div>
                </div>
            }
        </div>
    )
}

export default ProfilAuthor;