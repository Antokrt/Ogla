import { useEffect, useState } from "react";
import Style from "../../../styles/Pages/Dashboard/ProfilAuthor.module.scss";
import { GetPrivateProfilApi } from "../../api/user";
import Facebook from "../../../Component/layouts/Icons/Social/facebook";
import Instagram from "../../../Component/layouts/Icons/Social/instagram";
import Twitter from "../../../Component/layouts/Icons/Social/twitter";
import { BookOpenIcon, CheckIcon, HomeIcon, ListBulletIcon, PencilIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { toastDisplayError, toastDisplaySuccess, toastDisplayInfo } from "../../../utils/Toastify";
import { UpdateLinksProfilAuthor } from "../../../service/Dashboard/BooksAuthorService"

export async function getServerSideProps({req}) {

    const data = await GetPrivateProfilApi(req);
    return {
        props:{
            err: data.err,
            profilData: data.profilJson
        }
    }
}

const DashboardProfil = ({ profilData, err }) => {
    const [modifLinkTwitter, setModifLinkTwitter] = useState(false);
    const [modifLinkInstagram, setModifLinkInstagram] = useState(false);
    const [modifLinkFacebook, setModifLinkFacebook] = useState(false);
    const [FacebookLink, setFacebookLink] = useState(profilData.author.social.facebook);
    const [InstagramLink, setInstagramLink] = useState(profilData.author.social.instagram);
    const [TwitterLink, setTwitterLink] = useState(profilData.author.social.twitter);
    const [tampFb, setTampFb] = useState("");
    const [tampIs, setTampIs] = useState("");
    const [tampTw, setTampTw] = useState("");

    function isValidFacebookUrl(url) {
        const regex = new RegExp("^https:\/\/(?:www\.)?facebook\.com\/[^\\s]+$");
        const match = url.match(regex);
        return !!match;
    }

    function isValidTwitterUsername(url) {
        const regex = new RegExp("^@[a-zA-Z0-9]{1,31}$");
        const match = url.match(regex);
        return !!match;
    }
    
    function changeLink(type) {
        switch (type) {
            case 'facebook':
                if (isValidFacebookUrl(tampFb) === false)
                    return toastDisplayError("Veuillez fournir un lien valide.");
                UpdateLinksProfilAuthor(type, tampFb)
                .then((res) => {
                    setFacebookLink(res.author.social.facebook)
                    toastDisplaySuccess("Le lien vers votre " + type + " à bien été modifié.");
                })
                .catch(() => toastDisplayError("Une erreur c'est produite."))
                setTampFb("");
                setModifLinkFacebook(false);
                break;

            case 'instagram':
                if (tampIs.length <= 1 || tampIs.length > 31 || tampIs[0] !== '@')
                    return toastDisplayError("Votre nom d'utilisateur instagram doit être valide et commencer par un '@'.");
                console.log(tampIs);
                UpdateLinksProfilAuthor(type, tampIs.replace(/\s/g, ""))
                .then((res) => {
                    setInstagramLink(res.author.social.instagram)
                    toastDisplaySuccess("Le lien vers votre " + type + " à bien été modifié.");
                })
                .catch(() => toastDisplayError("Une erreur c'est produite."))
                setTampIs("");
                setModifLinkInstagram(false);
                break;

            case 'twitter':
                if (isValidTwitterUsername(tampTw) === false)
                    return toastDisplayError("Votre pseudonyme twitter doit commencer par '@'. Il doit également être un pseudonyme valide.");
                UpdateLinksProfilAuthor(type, tampTw)
                .then((res) => {
                    setTwitterLink(res.author.social.twitter)
                    toastDisplaySuccess("Le lien vers votre " + type + " à bien été modifié.");
                })
                .catch(() => toastDisplayError("Une erreur c'est produite."))
                setTampTw("");
                setModifLinkTwitter(false);
                break;

            default:
                toastDisplayError("Ce réseau n'est pas géré par Ogla.");
        }
    }

    function AnnulationModificationLink(type) {
        switch (type) {
            case 'facebook':
                setTampFb("");
                setModifLinkFacebook(false);
                break;
            case 'instagram':
                setTampIs("");
                setModifLinkInstagram(false);
                break;
            case 'twitter':
                setTampTw("");
                setModifLinkTwitter(false);
                break;
            default:
                break;
        }
        toastDisplayInfo("Annulation des modifications");
    }

    return (
        <div className={Style.ProfilAuthorPage}>
            <div className={Style.backgroundAuthorProfil}> </div>
            <div className={Style.dataInProfilAuthor}>
                <div className={Style.LeftBlockProfilAuthor}>
                <h1> OGLA </h1>
                <img src={profilData.img} alt="Photos de profil" />
                <h3> Welcome back </h3>
                <h2>  {profilData.author.firstName} {profilData.author.lastName}</h2>
                <div className={Style.RevenuMensuelAuthor}>
                    <h1> 15 125$ </h1>
                    <p> Revenu mensuel </p>
                </div>
                <div className={Style.MenuProfilAuthor}>
                    <div className={Style.itemMenuProfilAuthor} > <HomeIcon /> <p> Accueil </p> </div>
                    <div className={Style.itemMenuProfilAuthor} > <UserIcon /> <p> Profil </p> </div>
                    <div className={Style.itemMenuProfilAuthor} > <BookOpenIcon /> <p> Mes livres </p> </div>
                    <div className={Style.itemMenuProfilAuthor} > <PencilIcon /> <p> Écrire </p> </div>
                    <div className={Style.itemMenuProfilAuthor} > <ListBulletIcon /> <p> Catégories </p> </div>
                </div>
                <h4> Déconnection </h4>
                </div>
                <div className={Style.otherblock}>
                    <div className={Style.ProfilAuthorCenterBlock}>
                        <h1> Dashboard </h1>
                        <div className={Style.lastsNotificationsAuthorsProfil}>
                            <h2> Dernières notifications</h2>
                        </div>
                        <div className={Style.StatsGeneralesAuthorsProfil}>
                            <h2> Statistiques génerales </h2>
                        </div>
                    </div>
                    <div className={Style.ProfilAuthorRightBlock}>
                        <div className={Style.ReseauxSociauxAuthor}>
                            <h2> Réseaux sociaux </h2>
                            <form>
                                <div /*className={styles.form}*/>
                                    <label> Facebook <Facebook/> </label>
                                    <div className={Style.InputAndButtonProfilAuthor}>
                                    {
                                        !modifLinkFacebook && profilData.author.social.facebook !== "" &&
                                        <>
                                            <a href={FacebookLink}  target="_blank" > {FacebookLink} </a>
                                            <button onClick={() => setModifLinkFacebook(true)}> Modifier </button>
                                        </>
                                    }
                                    {
                                        (modifLinkFacebook || profilData.author.social.facebook === "") &&
                                        <>
                                            <input onChange={(e) => setTampFb(e.target.value)} type={"text"} placeholder={"Lien Facebook"} />
                                            <div className={Style.svgModifLinksProfilAuthor} >
                                                <CheckIcon onClick={() => changeLink("facebook")} />
                                                <XMarkIcon onClick={() => AnnulationModificationLink("facebook")} />
                                            </div>
                                        </>
                                    }
                                    </div>
                                    <label>Instagram <Instagram/></label>
                                    <div className={Style.InputAndButtonProfilAuthor}>
                                    {
                                        !modifLinkInstagram && profilData.author.social.instagram !== "" &&
                                        <>
                                            <a href={"https://www.instagram.com/" + (InstagramLink.substr(1))} target="_blank" style={{color:"#fb3958"}} > {InstagramLink} </a>
                                            <button onClick={() => setModifLinkInstagram(true)} style={{color:"#fb3958", border:"1px solid #fb3958"}}> Modifier </button>
                                        </>
                                    }
                                    {
                                        (modifLinkInstagram || profilData.author.social.instagram === "") &&
                                        <>
                                                <input onChange={(e) => setTampIs(e.target.value)} type={"text"} placeholder={"@"} />
                                                <div className={Style.svgModifLinksProfilAuthor} >
                                                    <CheckIcon onClick={() => changeLink("instagram")} />
                                                    <XMarkIcon onClick={() => AnnulationModificationLink("instagram")} />
                                                </div>
                                        </>
                                    }
                                    </div>
                                    <label> Twitter <Twitter/> </label>
                                    <div className={Style.InputAndButtonProfilAuthor}>
                                    {
                                        !modifLinkTwitter && profilData.author.social.twitter !== "" &&
                                        <>
                                            {/* <input type={"text"} value={TwitterLink} readOnly placeholder={"@"} style={{cursor:"default", backgroundColor:"rgb(172, 172, 172)"}} /> */}
                                            <a href={"https://www.twitter.com/" + TwitterLink} target="_blank" style={{color:"#1Da1f2"}} > {TwitterLink} </a>
                                            <button onClick={() => setModifLinkTwitter(true)} style={{color:"#1Da1f2", border:"1px solid #1da1f2"}} > Modifier </button>
                                        </>
                                    }
                                    {
                                        (modifLinkTwitter || profilData.author.social.twitter === "") &&
                                        <>
                                            <input onChange={(e) => setTampTw(e.target.value)} type={"text"} placeholder={"@"} />
                                            <div className={Style.svgModifLinksProfilAuthor} >
                                                <CheckIcon onClick={() => changeLink("twitter")} />
                                                <XMarkIcon onClick={() => AnnulationModificationLink("twitter")} />
                                            </div>
                                        </>
                                    }
                                    </div>
                                    <p /*className={styles.errMsg}*/></p>
                                </div>
                            </form>
                        </div>
                        <div> D'autres idées </div>
                        <div> D'autres idées </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default DashboardProfil;