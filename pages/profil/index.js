import styles from "../../styles/Pages/ProfilPage.module.scss";
import Header from "../../Component/Header";
import scroll from "../../styles/utils/scrollbar.module.scss";
import {
    ArrowDownIcon,
    CalendarIcon,
    ChatBubbleBottomCenterIcon, ChatBubbleOvalLeftEllipsisIcon, CheckBadgeIcon, CheckIcon,
} from "@heroicons/react/24/outline";

import {useEffect, useRef, useState} from "react";
import {
    ArrowTrendingUpIcon,
    ChatBubbleLeftIcon,
    CheckCircleIcon,
    PencilIcon,
    StarIcon, XCircleIcon
} from "@heroicons/react/20/solid";
import Category from "../../json/category.json";
import {Capitalize} from "../../utils/String";
import Facebook from "../../Component/layouts/Icons/Social/facebook";
import Instagram from "../../Component/layouts/Icons/Social/instagram";
import Twitter from "../../Component/layouts/Icons/Social/twitter";
import {signOut, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {GetPrivateProfilApi} from "../api/user";
import {DeleteUserProfilPictureService, UpdateUserProfilPictureService} from "../../service/User/Profil.service";
import axios from "axios";
import {ReloadSession} from "../../utils/ReloadSession";
import {GetDefaultUserImg} from "../../utils/ImageUtils";
import {DeleteAccountService, VerifyEmailService} from "../../service/User/Account.service";
import {FormatDateNb, FormatDateStr} from "../../utils/Date";
import {ChangePasswordService} from "../../service/User/Password.service";
import {DeleteAccountModal} from "../../Component/Modal/DeleteAccountModal";


export async function getServerSideProps({req}) {

    const data = await GetPrivateProfilApi(req);
    return {
        props: {
            err: data.err,
            profilData: data.profilJson
        }
    }
}

const Profil = ({profilData, err}) => {
    const router = useRouter();
    const [isCreator, setIsCreator] = useState(true);
    const [activeLink, setActiveLink] = useState('profil');
    const [hasChanged, setHasChanged] = useState(false);
    const [wantToDelete, setWantToDelete] = useState(false);
    const [profil, setProfil] = useState(profilData);
    const [newProfil, setNewProfil] = useState(profil);
    const {data: session, status} = useSession();
    const [password, setPassword] = useState('');
    const [openModalDeleteAccount, setOpenModalDeleteAccount] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassowrd] = useState('');
    const [wrongPasswordErr, setWrongPasswordErr] = useState(false);
    const [errMsgModifyPassword, setErrMsgModifyPassword] = useState({
        msg: '',
        show: false
    })
    const [errMsgPassword, setErrMsgPassword] = useState('Mot de passe incorect');
    const [localImg, setLocalImg] = useState(null);
    const [file, setFile] = useState(false);
    const imageMimeType = /image\/(png|jpg|jpeg)/i;
    const imgRef = useRef();

    useEffect(() => {
        if (Object.is(profil.email, newProfil.email) === false) {
            setHasChanged(true);
        } else {
            setHasChanged(false);
        }
    }, [newProfil])


    const handleFileSelect = (event) => {
        if (event?.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setLocalImg(URL.createObjectURL(event.target.files[0]));
        }
    }

    const imgClick = () => {
        imgRef.current.click();
    }

    const updatePic = () => {
        if (file) {
            UpdateUserProfilPictureService(file)
                .then((res) => {
                    setProfil((prevState) => ({
                        ...prevState,
                        img: res.data
                    }))
                    setLocalImg(null);
                    setFile(null);
                })
                .then(() => {
                    axios.get('/api/auth/session?update-picture')
                        .then(() => ReloadSession())
                        .catch((err) => console.log(err));
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    const deletePic = () => {
        DeleteUserProfilPictureService()
            .then((res) => {
                setProfil((prevState) => ({
                    ...prevState,
                    img: res.data
                }))
                setLocalImg(null);
                setFile(null);
            })
            .then(() => {
                axios.get('/api/auth/session?update-picture')
                    .then(() => ReloadSession())
                    .catch((err) => console.log(err));
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const deleteAccount = () => {
        if (password.length > 3) {
            DeleteAccountService(session.user.email, password)
                .then((res) => signOut())
                .catch((err) => {
                    const statusCode = err.response.data.statusCode;
                    if (statusCode === 401) {
                        setErrMsgPassword('Mot de passe incorrect');
                        setWrongPasswordErr(true);
                    } else {
                        setErrMsgPassword('Impossible de supprimer le compte');
                        setWrongPasswordErr(true);
                    }
                })
        }
    }

    const verifyEmail = () => {
        VerifyEmailService()
            .then((res) => console.log('send'))
            .catch((err) => console.log('err to send email'));
    }

    const changePassword = (e) => {
        e.preventDefault();
        if (oldPassword !== '' && newPassword !== '' && session) {
            ChangePasswordService(profilData.email, oldPassword, newPassword)
                .then((res) => {
                    setNewPassowrd('');
                    setOldPassword('');
                    setErrMsgModifyPassword({
                        show: false
                    })
                })
                .catch((err) => {
                    setErrMsgModifyPassword({
                        msg: 'Mot de passe incorrect',
                        show: true
                    })
                });
        }
    }

    return (
        <>
            {
                err &&
                <div>
                    <Header/>
                    <p>Impossible de récupérer le profil</p>
                </div>
            }

            {
                !err && profilData && session &&
                <div className={styles.container}>
                    <Header/>
                    <div className={styles.containerF}>
                        <div className={styles.containerM}>
                            <div className={styles.headerTitle}>
                                <h1>Bonjour {session.user.pseudo} !</h1>
                                <p>Gérez vos informations personnelles et personnalisez votre profil ici </p>
                            </div>
                            <div className={styles.menuLink}>
                                <button onClick={() => setActiveLink('profil')}
                                        className={activeLink === 'profil' ? styles.activeMenu + ' ' + styles.borderL : styles.borderL}>Profil
                                </button>
                                <button onClick={() => setActiveLink('writer')}
                                        className={activeLink === 'writer' && styles.activeMenu}>Ecrivain
                                </button>
                                <button onClick={() => setActiveLink('notifications')}
                                        className={activeLink === 'notifications' ? styles.activeMenu + ' ' + styles.borderR : styles.borderR}>Notifications
                                </button>

                            </div>

                            <div className={styles.containerItem}>
                                <div className={styles.profil}>
                                    <div className={styles.imgContainer}>
                                        {
                                            localImg && file ?
                                                <>
                                                    <img
                                                        onClick={() => imgClick()}
                                                        src={localImg} alt={'Profil Pic'}/>
                                                </>
                                                :
                                                <img
                                                    onClick={() => imgClick()}
                                                    src={profil.img} alt={'Profil Pic'}/>
                                        }
                                        <input
                                            style={{display: 'none'}}
                                            type={'file'}
                                            ref={imgRef}
                                            accept={"image/png , image/jpeg , image/jpg"}
                                            id={'file'}
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (!file?.type.match(imageMimeType)) {
                                                    return null;
                                                }
                                                handleFileSelect(e);
                                            }}
                                        />
                                        <div className={styles.labelImg}>
                                            <h5>Avatar</h5>
                                            <p>.png .jpg jpeg </p>

                                            <div className={styles.imgCheck}>
                                                {
                                                    localImg && file &&
                                                    <>
                                                        <CheckCircleIcon
                                                            onClick={() => updatePic()}
                                                            className={styles.check}/>
                                                        <XCircleIcon
                                                            onClick={() => {
                                                                setLocalImg(null);
                                                                setFile(null);
                                                            }
                                                            }
                                                            className={styles.off}/>
                                                    </>

                                                }

                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.form}>
                                        <label>Pseudo</label>
                                        <input disabled={true} type={"text"} value={profilData.pseudo}/>
                                        <label className={styles.emailLabel}>Email <span>{session.user.verified ?
                                            <CheckBadgeIcon/> :
                                            <span className={styles.verify} onClick={() => {
                                                if (!session.user?.verified) {
                                                    verifyEmail();
                                                }
                                            }}>Vérifiez maintenant</span>}</span></label>
                                        <input disabled={true} type={"text"} value={profilData.email}/>
                                        {
                                            session.user.provider === 'ogla' &&
                                            <>
                                                <label>Modifier votre mot de passe</label>
                                                <input value={oldPassword}
                                                       onChange={(e) => setOldPassword(e.target.value)}
                                                       type={"password"} placeholder={'Ancien mot de passe'}/>
                                                <input value={newPassword}
                                                       onChange={(e) => setNewPassowrd(e.target.value)}
                                                       type={"password"} placeholder={'Nouveau mot de passe'}/>
                                                {
                                                    errMsgModifyPassword.show &&
                                                    <p className={styles.errMsg}>{errMsgModifyPassword.msg}</p>
                                                }

                                                <button onClick={(e) => changePassword(e)}
                                                        className={oldPassword !== "" && newPassword !== "" ? styles.active + ' ' + styles.modifyBtn : styles.disabled + ' ' + styles.modifyBtn}>Modifier
                                                </button>
                                            </>

                                        }


                                        <button className={styles.deleteAccount}
                                                onClick={() => setOpenModalDeleteAccount(true)}>Supprimer mon compte
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        openModalDeleteAccount && session &&
                        <DeleteAccountModal close={() => setOpenModalDeleteAccount(false)}/>
                    }
                </div>
            }
        </>

    )


}


export default Profil;


/*
<div className={styles.container}>
    {
        err &&
        <p> {err} </p>
    }
    {
        profilData &&
        <>
            <Header/>
            <div className={styles.containerM}>
                <div className={styles.containerLeft}>
                    <div className={styles.firstCard}>
                        <div className={styles.headerFirstCard}>
                            <img src={session?.user.image}/>
                            <p>{session?.user.pseudo}</p>
                        </div>
                        <div className={styles.listFirstCard}>
                            <p className={styles.dateInscription}><AcademicCapIcon
                                className={styles.commentarySvg}/> Inscrit le {FormatDateStr(profilData?.register_date)} </p>

                            {/!*        <div className={styles.verifyEmail}>
                                {
                                    session.user.verified ?
                                        <div className={styles.msgVerify}><EnvelopeIcon/> <CheckBadgeIcon className={styles.env}/></div> :
                                        <button>Vérifier mon email</button>
                                }
                            </div>*!/}

                        </div>

                    </div>

                    {
                        profilData.is_author ?
                            <div className={styles.secondCard}>
                                <div className={styles.fItemSecondCard}>
                                    <StarIcon className={styles.svgStar}/>
                                    <div className={styles.contentStar}>
                                        <p className={styles.labelStar}>Livres</p>
                                        <p className={styles.nbStar}>1</p>
                                    </div>
                                </div>

                                <div className={styles.sItemSecondCard}>
                                    <PencilIcon className={styles.svgPenn}/>
                                    <div className={styles.contentStar}>
                                        <p className={styles.labelStar}>Chapitres</p>
                                        <p className={styles.nbStar}>12</p>
                                    </div>
                                </div>

                                <div className={styles.sItemSecondCard}>
                                    <ArrowTrendingUpIcon className={styles.svgPenn}/>
                                    <div className={styles.contentStar}>
                                        <p className={styles.labelStar}>Tendance</p>
                                        <p className={styles.category}>Comédie</p>
                                    </div>
                                </div>

                                <h6>Il faut savoir se lancer bravo et n'abandonnez pas !</h6>
                            </div>
                            :
                            <div className={styles.secondCardBecameWriter}>
                                <h5>Deviens écrivain</h5>
                                <p>Rejoins une communauté grandissante d'écrivains et lance ta carrière</p>
                                <button onClick={() => router.push("/devenir-auteur")}>C'est parti !</button>
                            </div>
                    }

                </div>

                <div className={styles.containerRight}>

                    <div className={styles.thumbnail}>
                        <UserCircleIcon/>
                    </div>

                    <div className={styles.headerContainerRight}>
                        <p onClick={() => setActiveLink("profil")}
                           className={activeLink === "profil" ? styles.activeLink : ""}>Profil</p>
                        <p onClick={() => setActiveLink("writer")}
                           className={activeLink === "writer" ? styles.activeLink : ""}>Écrivain</p>
                    </div>

                    {
                        activeLink === "profil" &&
                        <div>
                            <div className={styles.subTitleType}>
                                <h5 className={styles.typeActive}>Mon profil</h5>
                                <p className={styles.subTitle}>Gérez votre profil OGLA</p>
                            </div>
                            <div className={styles.containerSide}>
                                <div className={styles.picMain}>
                                    <div className={styles.picContainer}>
                                        {
                                            localImg && file ?
                                                <>
                                                    <img
                                                        onClick={() => imgClick()}
                                                        src={localImg} alt={'Profil Pic'}/>

                                                    <div className={styles.imgCheck}>
                                                        <CheckCircleIcon
                                                            onClick={() => updatePic()}
                                                            className={styles.check}/>
                                                        <XCircleIcon
                                                            onClick={() => {
                                                                setLocalImg(null);
                                                                setFile(null);
                                                            }
                                                            }
                                                            className={styles.off}/>
                                                    </div>
                                                </>

                                                :
                                                <img
                                                    onClick={() => imgClick()}
                                                    src={profil.img} alt={'Profil Pic'}/>
                                        }
                                        <div className={styles.btnModifyAndDelete}>
                                            <input
                                                type={'file'}
                                                ref={imgRef}
                                                accept={"image/png , image/jpeg , image/jpg" }
                                                id={'file'}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if(!file?.type.match(imageMimeType)){
                                                        return null;
                                                    }
                                                    handleFileSelect(e);
                                                }}
                                            />
                                            <button
                                                onClick={() => imgClick()}
                                                className={styles.btnBg}>Modifier</button>
                                            <button
                                                onClick={() => {
                                                    if(!localImg && !file && session.user.image !== GetDefaultUserImg()){
                                                        deletePic();
                                                    }
                                                }}
                                            >Supprimer</button>
                                        </div>
                                    </div>
                                    <p className={styles.conditionImg}>Votre photo doit valider les standards OGLA</p>
                                </div>
                                <div className={styles.infoMain}>
                                    <form className={styles.formContainer}>
                                        <div className={styles.form}>
                                            <label>Pseudo</label>
                                            <input disabled={true} type={"text"} value={profilData.pseudo}/>
                                            <label>Email</label>
                                            <input disabled={true} type={"text"} value={profilData.email}/>
                                            <label>Modifier votre mot de passe</label>
                                            <input value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}  type={"password"} placeholder={'Ancien mot de passe'}/>
                                            <input value={newPassword} onChange={(e) => setNewPassowrd(e.target.value)} type={"password"} placeholder={'Nouveau mot de passe'}/>
                                            {
                                                errMsgModifyPassword.show &&
                                                <p className={styles.errMsg}>{errMsgModifyPassword.msg}</p>
                                            }
                                            {/!*     <label htmlFor={"genres"}>Genre favoris</label>
                                            <div className={styles.selectCategory}>
                                                <ArrowDownIcon/>
                                                <select name="genres" id="pet-select">
                                                    {
                                                        Category.category.map((item) => {
                                                            return (
                                                                <option
                                                                    value={Capitalize(item.name)}>{Capitalize(item.name)}</option>
                                                            )
                                                        })
                                                    }
                                                    <option value={"none"}>Pas de préférence</option>
                                                </select>
                                            </div>*!/}

                                            {   <button onClick={(e) => changePassword(e)}
                                                        className={oldPassword !== "" && newPassword !== "" ? styles.active : styles.disabled}>Modifier
                                            </button>}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        activeLink === "writer" &&
                        <div className={styles.containerWriter}>
                            <div className={styles.subTitleType}>
                                <h5 className={styles.author}>{profil.name} <span>Inscrit le 17/02/2022 </span></h5>
                            </div>
                            <textarea className={scroll.scrollbar}>{newProfil.description}</textarea>
                            <div className={styles.containerSocialStats}>
                                <div className={styles.containerSt}>
                                    <h5 className={styles.bestTitle}>Statistiques</h5>

                                    <div className={styles.containerStats}>
                                        <div className={styles.item}>
                                            <div className={styles.lItem}>
                                                <SparklesIcon/>
                                                <div>
                                                    <p className={styles.valueStats}>Le crime de Mr Cizlac</p>
                                                    <p className={styles.labelStats}>Meilleur Livre</p>
                                                </div>
                                            </div>
                                            <p className={styles.nbStats}><span>+120</span>j'aime(s)</p>
                                        </div>

                                        <div className={styles.item}>
                                            <div className={styles.lItem}>
                                                <StarIcon/>
                                                <div>
                                                    <p className={styles.valueStats}>Le crime de Mr Cizlac et la buche
                                                        de normandie</p>
                                                    <p className={styles.labelStats}>Meilleur chapitre</p>
                                                </div>
                                            </div>
                                            <p className={styles.nbStats}><span>+820</span>j'aime(s)</p>
                                        </div>

                                        <div className={styles.item}>
                                            <div className={styles.lItem}>
                                                <ChatBubbleLeftIcon/>
                                                <div>
                                                    <p className={styles.valueStats}>Le crime de Mr Cizlac</p>
                                                    <p className={styles.labelStats}>Le plus commenté</p>
                                                </div>
                                            </div>
                                            <p className={styles.nbStats}><span>+12210</span>commentaire(s)</p>
                                        </div>
                                    </div>
                                </div>


                                <div className={styles.containerSocial}>
                                    <h5 className={styles.bestTitle}>Réseaux sociaux 1/3</h5>
                                    <form>
                                        <div className={styles.form}>
                                            <label>Facebook <Facebook/></label>
                                            <input type={"text"} value={""} placeholder={"Profil Facebook"}/>
                                            <label>Instagram <Instagram/></label>
                                            <input type={"text"} value={""} placeholder={"Profil Instagram"}/>
                                            <label htmlFor={"genres"}>Twitter <Twitter/></label>
                                            <input type={"text"} value={""} placeholder={"Profil Twitter"}/>


                                            <p className={styles.errMsg}></p>
                                            <button disabled={true}
                                                    className={hasChanged === true ? styles.active : styles.disabled}>Modifier
                                            </button>
                                        </div>

                                    </form>

                                </div>
                            </div>

                        </div>
                    }


                </div>
            </div>
        </>
    }
</div>
*/



