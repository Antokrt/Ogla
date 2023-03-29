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
    ArrowTrendingUpIcon, ChartBarIcon,
    ChatBubbleLeftIcon,
    CheckCircleIcon, HeartIcon,
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
import {BookmarkIcon} from "@heroicons/react/24/solid";
import {UpdateAuthorDescriptionService, UpdateUserDescriptionService} from "../../service/Author";


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
    const [newPresentation, setNewPresentation] = useState(profil?.author?.description);
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

    const updateDescription = () => {
        UpdateAuthorDescriptionService(newPresentation)
            .then((res) => {
                setProfil((prevState) => ({
                    ...prevState,
                    author: {
                        description: res
                    }
                }));
                setNewPresentation(res);
            })
            .catch((err) => console.log(err));
    }

    const profilComponent = () => {
        return (
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
                        }}>Vérifier maintenant</span>}</span></label>
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

        )
    }

    const writerComponent = () => {
        return (
            <div className={styles.writer}>
                <div className={styles.lContainerWriter}>

                    <h5 className={styles.title}>Devenu écrivain
                        le <span>{FormatDateStr(profilData.register_date)}</span></h5>


                    <div className={styles.formWriter}>
                        <div className={styles.hWriter}>
                            <img src={'/assets/jim/cool2.png'}/>
                            <h5>Quelques statistiques</h5>

                        </div>

                        <div className={styles.headerWriter}>
                            <div className={styles.itemWriter}>
                                <p>{profil.author.stats.nbBooks}</p>
                                <h6>livre(s)</h6>

                            </div>
                            <div className={styles.itemWriter}>
                                <p>{profil.author.stats.nbChapters}</p>
                                <h6>chapitre(s)</h6>
                            </div>
                            <div className={styles.itemWriter}>
                                <p>{profil.author.stats.totalLikes}</p>
                                <h6>like(s) reçus</h6>
                            </div>

                        </div>


                        <div className={styles.writerItem}>
                            <p className={styles.label}>Livre le plus liké <HeartIcon/></p>
                            <p className={styles.value}>La quete du maitre <span>21201</span></p>
                        </div>

                        <div className={styles.writerItem}>
                            <p className={styles.label}>Chapitre le plus liké <ChartBarIcon/></p>
                            <p className={styles.value}>Pouliche liche moi la babine <span>21201</span></p>
                        </div>

                    </div>
                </div>
                <div className={styles.rContainerWriter}>
                    <h5 className={styles.title}>Éditer le profil</h5>

                    <div className={styles.containerPresentation}>
                        <div className={styles.headerPresentation}>
                            <h6>Présentation</h6>
                            <button onClick={() => {
                                if (profil.author.description !== newPresentation) {
                                    updateDescription();
                                }
                            }}
                                    className={profil.author.description !== newPresentation ? styles.active : styles.disabled}>Modifier
                            </button>
                        </div>


                        {
                            profil.author.description === "" || !profil.author.description ?
                                <textarea
                                    onChange={(e) => setNewPresentation(e.target.value)}
                                    className={scroll.scrollbar}
                                    placeholder={"Donnez envie aux lecteurs de vous découvrir avec une présentation de vous, brève mais sympathique... "}/>
                                :
                                <textarea
                                    onChange={(e) => setNewPresentation(e.target.value)}
                                    className={scroll.scrollbar}
                                    value={newPresentation}/>
                        }


                    </div>

                    <div className={styles.containerSocial}>
                        <div className={styles.headSocial}>
                            <h5>Réseaux sociaux</h5>
                            <p>Ne manquez plus jamais une occasion de vous connecter avec vos lecteurs en ajoutant vos
                                réseaux sociaux à votre profil.</p>
                        </div>

                        <div className={styles.socialForm}>
                            <label>Instagram <Instagram/></label>
                            <input type={"text"} placeholder={'Instagram'}/>
                            <label>Twitter <Twitter/></label>
                            <input type={"text"} placeholder={'Twitter'}/>
                            <label>Facebook <Facebook/></label>
                            <input type={"text"} placeholder={'Facebook'}/>
                        </div>
                    </div>


                </div>

            </div>
        )
    }

    const becameWriter = () => {
        return (
            <div className={styles.becameWriter}>
                <img src={'/assets/jim/smile8.png'}/>
                <h5>Deviens écrivain <strong>OGLA</strong> dès maintenant !</h5>
                <p>"Rejoignez notre communauté d'écrivains aujourd'hui et partagez votre histoire avec le monde entier ! <br/>
                    Avec <strong>OGLA</strong>, chaque personne peut devenir un écrivain et chaque histoire a la chance
                    d'être entendue"</p>

                <button onClick={() => router.push('/devenir-auteur')}>Je me lance !</button>
            </div>
        )
    }

    const checkSide = () => {
        switch (activeLink) {
            case 'profil':
                return profilComponent();

            case 'writer' :
                if (profil.is_author) {
                    return writerComponent();
                } else {
                    return becameWriter();
                }

            case 'notif':
                return (
                    <p>notifs</p>
                )

            default:
                return profilComponent();
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
                                <p>Gérer vos informations personnelles et personnaliser votre profil ici </p>
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
                                {
                                    checkSide()
                                }
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





