import styles from "../../styles/Pages/ProfilPage.module.scss";
import Header from "../../Component/Header";
import scroll from "../../styles/utils/scrollbar.module.scss";
import {
    BellAlertIcon, CheckBadgeIcon, Cog8ToothIcon, MusicalNoteIcon, UserIcon, WrenchIcon,
} from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import {
    ChartBarIcon, CheckCircleIcon, HeartIcon, XCircleIcon
} from "@heroicons/react/20/solid";
import { Capitalize } from "../../utils/String";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetPrivateProfilApi } from "../api/user";
import { DeleteUserProfilPictureService, UpdateUserProfilPictureService } from "../../service/User/Profil.service";
import axios from "axios";
import { ReloadSession } from "../../utils/ReloadSession";
import {GetDefaultUserImg, GetDefaultUserImgWhenError, renderPrediction} from "../../utils/ImageUtils";
import { DeleteAccountService, VerifyEmailService } from "../../service/User/Account.service";
import { FormatDateNb, FormatDateStr } from "../../utils/Date";
import { ChangePasswordService, SendResetPasswordEmailService } from "../../service/User/Password.service";
import { DeleteAccountModal } from "../../Component/Modal/DeleteAccountModal";
import { BookmarkIcon, EyeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { UpdateAuthorDescriptionService, UpdateUserDescriptionService } from "../../service/Author";
import ProfilAuthor from "../../Component/Profil/ProfilAuthor";
import Footer from "../../Component/Footer";
import { useDispatch, useSelector } from "react-redux";
import { selectNotifs, setActiveModalNotif, setOpen } from "../../store/slices/notifSlice";
import { LoaderImg } from "../../Component/layouts/Loader";
import { toastDisplayError, toastDisplayPromiseSendMail } from "../../utils/Toastify";
import { UpdateSettings, UpdateSettingsService } from "../../service/User/Settings.service";
import { instance } from "../../service/config/Interceptor";
import ScreenSize from "../../utils/Size";
import { openAll } from "../../service/Notifications/NotificationsService";
import { useEffect } from "react";
import { OpenAllService } from "../../service/Notifications/NotificationsService";
import Tippy from "@tippyjs/react";

export async function getServerSideProps({ req }) {
    const data = await GetPrivateProfilApi(req);
    return {
        props: {
            err: data.err,
            profilData: data.profilJson
        }
    }
}

const Profil = ({ profilData, err }) => {
    const router = useRouter();
    const [activeLink, setActiveLink] = useState("profil");
    const [profil, setProfil] = useState(profilData);
    const [newPresentation, setNewPresentation] = useState(profil?.author?.description);
    const { data: session, status } = useSession();
    const [openModalDeleteAccount, setOpenModalDeleteAccount] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassowrd] = useState('');
    const [loadingImg, setLoadingImg] = useState(false);
    const [errMsgModifyPassword, setErrMsgModifyPassword] = useState({
        msg: '',
        show: false
    })
    const [localImg, setLocalImg] = useState(null);
    const [file, setFile] = useState(false);
    const imageMimeType = /image\/(png|jpg|jpeg)/i;
    const [notifState, setNotifState] = useState(profil?.settings?.notif);
    const [musicState, setMusicState] = useState(profil?.settings?.music);
    const imgRef = useRef();
    const dispatch = useDispatch()
    const [width, height] = ScreenSize();
    const Notifs = useSelector(selectNotifs)
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        var nb = 0;
        Notifs.forEach((elem) => {
            if (elem.open === false) {
                setIsOpen(true);
                nb++;
            }
        })
        if (nb === 0)
            setIsOpen(false);
    }, [Notifs])

    useEffect(() => {
        if (localStorage.getItem('side')) {
            setActiveLink(localStorage.getItem('side'));
            localStorage.removeItem('side');
            checkSide();
        }
    }, []);

    const handleFileSelect = (event) => {
        if (event?.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setLocalImg(URL.createObjectURL(event.target.files[0]));
        }
    }

    const imgClick = () => {
        imgRef.current.click();
    }

    const updateSettingsOfSession = () => {
        return new Promise((resolve, reject) => {
            instance.get('http://localhost:3000/api/auth/session?new-settings')
                .then(() => resolve())
                .catch((err) => {
                    console.log(err)
                    reject()
                })
        })
    }

    const updateSettings = () => {
        if (musicState !== profil?.settings?.music || notifState !== profil?.settings?.notif) {
            const newSettings = {
                music: musicState,
                notif: notifState
            }

            UpdateSettingsService(newSettings)
                .then(() => updateSettingsOfSession()
                    .then((res) => setProfil( prevState => ({
                        ...prevState,
                        settings: {
                            notif: newSettings.notif,
                            music: newSettings.music
                        }
                    })))
                    .then(() => ReloadSession())
                    .catch(() => toastDisplayError('Impossible de modifier les réglages'))
                )
                .catch(() => toastDisplayError('Impossible de modifier les réglages'))
        }
    }

    const updatePic = async () => {
        if (file) {
            setLoadingImg(true);
            const data = await renderPrediction(file, 'user');
            if (data) {
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
                            .then(() => {
                                ReloadSession();
                                setLoadingImg(false)
                            })
                            .catch((err) => {
                                setLoadingImg(false);
                            });
                    })
                    .catch((err) => {
                        setLoadingImg(false);
                        toastDisplayError("Impossible de modifier l'image.");
                    })
            } else {
                setLoadingImg(false);
                toastDisplayError('Image non conforme.')
            }

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
                        ...prevState.author,
                        description: res
                    }
                }));
                setNewPresentation(res);
            })
            .catch((err) => console.log(err));
    }

    const sendEmailResetPassword = () => {
        toastDisplayPromiseSendMail(SendResetPasswordEmailService(profilData.email)
        )
    }

    const profilComponent = () => {
        return (
            <div className={styles.profil}>
                <div className={styles.imgContainer}>
                    {
                        loadingImg &&
                        <div className={styles.loaderImg}>
                            <LoaderImg />
                        </div>
                    }

                    {
                        localImg && file ?
                            <>
                                <img
                                    onClick={() => imgClick()}
                                    src={localImg} alt={'Profil Pic'} />
                            </>
                            :
                            <Tippy trigger={'mouseenter'} content={'Modifier'}>
                                <img
                                    onClick={() => imgClick()}
                                    src={profil?.img} onError={(e) => e.target.src = GetDefaultUserImgWhenError()} alt={'Profil Pic'} />

                            </Tippy>
                                         }
                    <input
                        style={{ display: 'none' }}
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
                    {

                        width > 800 &&
                        <div className={styles.labelImg}>
                            <h5>Avatar</h5>
                            <p>.png .jpg jpeg </p>

                            <div className={styles.imgCheck}>
                                {
                                    localImg && file &&
                                    <>
                                        <CheckCircleIcon
                                            onClick={() => updatePic()}
                                            className={styles.check} />
                                        <XCircleIcon
                                            onClick={() => {
                                                setLocalImg(null);
                                                setFile(null);
                                            }
                                            }
                                            className={styles.off} />
                                    </>

                                }

                            </div>
                        </div>
                    }
                </div>

                <div className={styles.form}>
                    <label>Pseudo</label>
                    <input disabled={true} type={"text"} value={profilData.pseudo} />
                    <label className={styles.emailLabel}>Email <span>{profilData.verified ?
                        <CheckBadgeIcon /> :
                        <span className={styles.verify} onClick={() => {
                            if (!profilData.verified) {
                                verifyEmail();
                            }
                        }}>Vérifier maintenant</span>}</span></label>
                    <input disabled={true} type={"text"} value={profilData.email} />
                    {
                        session?.user?.provider !== 'google' ?
                        <>
                            <label>Modifier votre mot de passe</label>
                            <input value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                type={"password"} placeholder={'Ancien mot de passe'} />
                            <input value={newPassword}
                                onChange={(e) => setNewPassowrd(e.target.value)}
                                type={"password"} placeholder={'Nouveau mot de passe'} />
                            {
                                errMsgModifyPassword.show &&
                                <p className={styles.errMsg}>{errMsgModifyPassword.msg}</p>
                            }

                            <button onClick={(e) => changePassword(e)}
                                className={oldPassword !== "" && newPassword !== "" ? styles.active + ' ' + styles.modifyBtn : styles.disabled + ' ' + styles.modifyBtn}>Envoyer
                            </button>
                        </>
                            :
                            <button className={styles.createPassword} onClick={() => sendEmailResetPassword()}>Créer un mot de passe <LockClosedIcon/></button>

                    }


                </div>
                {/* <div className={styles.imgContainer}>
                    <img src={'/assets/diapo/WalkRead.png'}/>
                </div> */}
            </div>

        )
    }

    const writerComponent = () => {
        return (
            <div className={styles.writer}>
                <div className={styles.lContainerWriter}>

                    <div className={styles.containerImg}>
                        <img src={profilData?.img}/>
                        <h5>Ecrivain <span>OGLA</span></h5>
                    </div>

                    <div className={styles.headerWriterStats}>
                        <h5>Devenu écrivain
                            le <span>{FormatDateStr(profilData?.register_date)}</span></h5>

                        <p>{profilData.author.likes} j'aimes</p>
                    </div>

                    <div className={styles.containerPresentation}>
                        <div className={styles.headerPresentation}>
                            <h6>Présentation
                            </h6>
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
                                    placeholder={"Donnez envie aux lecteurs de vous découvrir avec une présentation de vous, brève mais sympathique... "} />
                                :
                                <textarea
                                    onChange={(e) => setNewPresentation(e.target.value)}
                                    className={scroll.scrollbar}
                                    value={newPresentation} />
                        }


                    </div>

                    <div className={styles.formWriter}>

             {/*           {
                            width > 1150 &&
                            <div className={styles.headerWriter}>
                                <div className={styles.itemWriter}>
                                    <p>{profil?.author?.stats?.nbBooks}</p>
                                    <h6>livre(s)</h6>

                                </div>
                                <div className={styles.itemWriter}>
                                    <p>{profil?.author?.stats?.nbChapters}</p>
                                    <h6>chapitre(s)</h6>
                                </div>
                                <div className={styles.itemWriter}>
                                    <p>{profil?.author?.stats?.totalLikes}</p>
                                    <h6>like(s) reçus</h6>
                                </div>

                            </div>
                        }*/}
                  {/*      {
                            width <= 1150 &&
                            <div className={styles.phoneHeaderAuthor}>
                                <img src={profil.img} />
                                <div className={styles.phoneHeaderStats}>
                                    <div className={styles.phonehWriter}>
                                        <h5>Quelques statistiques</h5>
                                    </div>
                                    <div className={styles.headerWriter}>
                                        <div className={styles.itemWriter}>
                                            <p>{profil?.author?.stats?.nbBooks}</p>
                                            <h6>livre(s)</h6>

                                        </div>
                                        <div className={styles.itemWriter}>
                                            <p>{profil?.author?.stats?.nbChapters}</p>
                                            <h6>chapitre(s)</h6>
                                        </div>
                                        <div className={styles.itemWriter}>
                                            <p>{profil?.author?.stats?.totalLikes}</p>
                                            <h6>like(s) reçus</h6>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        }*/}

     {/*                   <div className={styles.stats}>
                            <div className={styles.writerItem}>
                                <p className={styles.label}>Livre le plus liké <HeartIcon /></p>
                                <p className={styles.value}>La quete du maitre <span>21201</span></p>
                            </div>

                            <div className={styles.writerItem}>
                                <p className={styles.label}>Chapitre le plus liké <ChartBarIcon /></p>
                                <p className={styles.value}>Pouliche liche moi la babine <span>21201</span></p>
                            </div>

                            <div className={styles.writerItem}>
                                <p className={styles.label}>Chapitre le plus vue <EyeIcon /> </p>
                                <p className={styles.value}>Pouliche liche moi la babine <span>21201</span></p>
                            </div>
                        </div>*/}
                    </div>
                </div>
                <div className={styles.rContainerWriter}>


                    <div className={styles.containerSocial}>
                        <div className={styles.headSocial}>
                            <h5>Réseaux sociaux</h5>
                            <p>Ne manquez plus jamais une occasion de vous connecter avec vos lecteurs en ajoutant vos
                                réseaux sociaux à votre profil.</p>
                        </div>

                        <div className={styles.socialForm}>
                            <div className={styles.socialLinks}>
                                <ProfilAuthor type={1} content={profilData?.author.social.instagram} />
                                <ProfilAuthor type={2} content={profilData?.author.social.twitter} />
                                <ProfilAuthor type={3} content={profilData?.author.social.facebook} />
                            </div>
                            <div className={styles.socialImg}>
                                <img src={"/assets/other/manReading2.png"} alt="author reading" />
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        )
    }

    const becameWriter = () => {
        return (
            <div className={styles.becameWriter}>
                <img src={'/assets/jim/smile8.png'} />
                <h5>Deviens écrivain <strong>OGLA</strong> dès maintenant !</h5>
                <p>"Rejoignez notre communauté d'écrivains aujourd'hui et partagez votre histoire avec le monde entier
                    ! <br />
                    Avec <strong>OGLA</strong>, chaque personne peut devenir un écrivain et chaque histoire a la chance
                    d'être entendue"</p>

                <button onClick={() => router.push('/devenir-auteur')}>Je me lance !</button>
            </div>
        )
    }

    const settingComponent = () => {
        return (
            <div className={styles.settings}>
                {
                    width > 800 &&
                    <h5>Réglages</h5>
                }
                <div className={styles.itemSetting}>
                    <div className={styles.fSetting}>
                        <BellAlertIcon />
                        <div>
                            <p className={styles.labelSetting}>Notifications </p>
                            {
                                width > 420 &&
                                <p className={styles.valueSetting}>Activer les notifications en temps réelle </p>
                            }
                            {
                                width <= 420 &&
                                <p className={styles.valueSetting}>Notifications en temps réelle </p>
                            }
                        </div>
                    </div>

                    <div className={notifState ? styles.toggleBtn + ' ' + styles.activeToggle : styles.toggleBtn}
                        onClick={() => setNotifState(!notifState)}>
                        <input checked={notifState} type="checkbox" id="toggle1" />
                        <label htmlFor="toggle1"></label>
                    </div>

                </div>

                <div className={styles.itemSetting} style={{
                    borderBottom: 'solid 1px rgba(84, 89, 95, 0.13)'
                }}>
                    <div className={styles.fSetting}>

                        <MusicalNoteIcon />
                        <div>
                            <p className={styles.labelSetting}>Musique </p>
                            <p className={styles.valueSetting}>Activer la musique</p>
                        </div>
                    </div>

                    <div className={musicState ? styles.musicToggle + ' ' + styles.activeToggle : styles.musicToggle}
                        onClick={() => {
                            setMusicState(!musicState)
                        }}>
                        <input checked={musicState} type="checkbox" id="toggle2" />
                        <label htmlFor="toggle2"></label>
                    </div>
                </div>
                <div className={styles.modifySettingsBtn}>
                    <button
                        onClick={() => updateSettings()}
                        className={musicState !== profil?.settings?.music || notifState !== profil?.settings?.notif ? styles.active + ' ' + styles.modifyBtn : styles.disabled + ' ' + styles.modifyBtn}>Modifier
                    </button>
                </div>
                <button className={styles.deleteAccount}
                    onClick={() => setOpenModalDeleteAccount(true)}>Supprimer mon compte
                </button>
            </div>
        )
    }

    const checkSide = () => {
        switch (activeLink) {
            case 'profil':
                return profilComponent();

            case 'writer':
                if (profil.is_author) {
                    return writerComponent();
                } else {
                    return becameWriter();
                }

            case 'settings':
                return settingComponent();
            default:
                return profilComponent();
        }
    }

    const phoneMenu = () => {
        return (
            <div className={styles.menuContainer}>
                <div className={styles.containerMain}>
                    <div className={activeLink === 'profil' ? styles.item + ' ' + styles.activeItem : styles.item} onClick={() => setActiveLink('profil')}>
                        <UserIcon />
                        <p> Profil </p>
                    </div>
                    <div className={activeLink === 'writer' ? styles.item + ' ' + styles.activeItem : styles.item} onClick={() => setActiveLink('writer')}>
                        <svg fill="white" viewBox="-2.5 -3 24 24" preserveAspectRatio="xMinYMin" class="jam jam-pen">
                            <path d="M5.648 12.276l-1.65 1.1-.415 1.68 1.665-.42 1.104-1.656-.704-.704zM7.1 10.899l.627.627.091-.032c.937-.334 1.88-1.019 2.824-2.089 1.139-1.29 3.061-3.587 5.757-6.879a.211.211 0 0 0-.297-.297c-3.286 2.693-5.583 4.616-6.881 5.758-1.076.946-1.76 1.888-2.088 2.819l-.033.093zm-.615 5.486L.843 17.814l1.4-5.671 3.004-2.004C5.7 8.863 6.583 7.645 7.9 6.486c1.32-1.162 3.632-3.097 6.936-5.804a2.21 2.21 0 0 1 3.111 3.112c-2.71 3.309-4.645 5.62-5.804 6.934-1.156 1.31-2.373 2.193-3.652 2.65l-2.005 3.007z" />
                        </svg>
                        <p> Ecrivain </p>
                    </div>
                    <div className={activeLink === 'settings' ? styles.item + ' ' + styles.activeItem : styles.item} onClick={() => setActiveLink('settings')}>
                        <Cog8ToothIcon />
                        <p> Réglages </p>
                    </div>
                    <div className={activeLink === 'notifications' ? styles.item + ' ' + styles.activeItem : styles.item} onClick={() => {
                        if (Notifs.length > 0) {
                            OpenAllService(Notifs[0].date_creation, session.user.id)
                        }
                        dispatch(setActiveModalNotif(true));
                        dispatch(setOpen());
                    }}>
                        <BellAlertIcon />
                        <p> Notifications </p>
                        {
                            isOpen &&
                            <div className={styles.haveNotif}></div>
                        }
                    </div>
                    {
                        width > 380 &&
                        <div className={styles.item}>
                            {
                                session && session.user.image &&
                                <>
                                    <img src={session.user.image} />
                                    <span className={styles.circle}></span>
                                </>
                            }
                        </div>
                    }
                </div>
            </div>
        )
    }

    return (
        <>
            {
                err &&
                <div>
                    <Header />
                    <p>Impossible de récupérer le profil</p>
                </div>
            }
            {
                !err && profilData && session &&
                <div className={styles.container}>
                    <Header />
                    <div className={styles.containerF}>
                        <div className={styles.containerM}>
                            {
                                width > 800 &&
                                <div className={styles.headerTitle}>
                                    <h1>Bonjour {session.user.pseudo} !</h1>
                                    <p>Gérer vos informations personnelles et personnaliser votre profil ici </p>
                                </div>
                            }
                            {
                                width > 800 &&
                                <div className={styles.menuLink}>
                                    <button onClick={() => setActiveLink('profil')}
                                        className={activeLink === 'profil' ? styles.activeMenu + ' ' + styles.borderL : styles.borderL}>Profil
                                    </button>
                                    <button onClick={() => setActiveLink('writer')}
                                        className={activeLink === 'writer' && styles.activeMenu}>Ecrivain
                                    </button>
                                    <button onClick={() => setActiveLink('settings')}
                                        className={activeLink === 'settings' && styles.activeMenu}>Réglages
                                    </button>
                                    <button onClick={() => {
                                        if (Notifs.length > 0) {
                                            OpenAllService(Notifs[0].date_creation, session.user.id)
                                        }
                                        dispatch(setActiveModalNotif(true));
                                        dispatch(setOpen());
                                    }}
                                        className={activeLink === 'notifications' ? styles.activeMenu + ' ' + styles.borderR : styles.borderR}>
                                        Notifications
                                        {isOpen && <span></span>}
                                    </button>
                                </div>
                            }
                            {
                                width <= 800 && activeLink === 'settings' &&
                                <div className={styles.headerTitlePhone}>
                                        <h2> Réglages </h2>
                                </div>
                            }
                            <div className={styles.containerItem}>
                                {
                                    checkSide()
                                }
                            </div>
                        </div>
                    </div>
                    {
                        width <= 800 &&
                        phoneMenu()
                    }
                    {
                        openModalDeleteAccount && session &&
                        <DeleteAccountModal close={() => setOpenModalDeleteAccount(false)} />
                    }
                </div>
            }

        </>
    )
}

export default Profil;