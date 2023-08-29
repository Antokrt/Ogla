import styles from "../../styles/Pages/ProfilPage.module.scss";
import anim from '../../styles/utils/anim.module.scss';
import Header from "../../Component/Header";
import scroll from "../../styles/utils/scrollbar.module.scss";
import {
    BellAlertIcon, CheckBadgeIcon, Cog8ToothIcon, MusicalNoteIcon, UserIcon
} from "@heroicons/react/24/outline";
import React, {useRef, useState} from "react";
import {
    CheckCircleIcon, XCircleIcon
} from "@heroicons/react/20/solid";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {GetPrivateProfilApi} from "../api/user";
import {UpdateUserProfilPictureService} from "../../service/User/Profil.service";
import axios from "axios";
import {ReloadSession} from "../../utils/ReloadSession";
import {
    GetDefaultUserImgWhenError,
    GetImgPathOfAssets,
    renderPrediction
} from "../../utils/ImageUtils";
import {VerifyEmailService} from "../../service/User/Account.service";
import {FormatDateStr} from "../../utils/Date";
import {ChangePasswordService, SendResetPasswordEmailService} from "../../service/User/Password.service";
import {DeleteAccountModal} from "../../Component/Modal/DeleteAccountModal";
import {LockClosedIcon} from "@heroicons/react/24/solid";
import {UpdateAuthorDescriptionService} from "../../service/Author";
import ProfilAuthor from "../../Component/Profil/ProfilAuthor";
import Footer from "../../Component/Footer";
import {useDispatch, useSelector} from "react-redux";
import {selectNotifs, setActiveModalNotif, setOpen} from "../../store/slices/notifSlice";
import {LoaderImg} from "../../Component/layouts/Loader";
import {
    toastDisplayError,
    toastDisplayPromiseSendMail,
    toastDisplaySuccess
} from "../../utils/Toastify";
import {UpdateSettingsService} from "../../service/User/Settings.service";
import {instance} from "../../service/config/Interceptor";
import ScreenSize from "../../utils/Size";
import {useEffect} from "react";
import {OpenAllService} from "../../service/Notifications/NotificationsService";
import Tippy from "@tippyjs/react";
import Head from "next/head";
import {HeaderMain} from "../../Component/HeaderMain";
import {HeaderMainResponsive} from "../../Component/HeaderMainResponsive";
import {ErrMsg} from "../../Component/ErrMsg";
import {stopMusic} from "../../store/slices/musicSlice";

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
    const [activeLink, setActiveLink] = useState("profil");
    const [profil, setProfil] = useState(profilData);
    const [newPresentation, setNewPresentation] = useState(profil?.author?.description);
    const {data: session, status} = useSession();
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
                    console.log('err settings')
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
                    .then((res) => setProfil(prevState => ({
                        ...prevState,
                        settings: {
                            notif: newSettings.notif,
                            music: newSettings.music
                        }
                    })))
                    .then(() => {
                        if(!newSettings.music){
                            dispatch(stopMusic());
                        }
                    })
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
                            .catch((err) => {setLoadingImg(false)});
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
            .then((res) => toastDisplaySuccess('Email envoyé !'))
            .catch((err) => toastDisplayError("Impossible d'envoyer l'email."));
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
            .catch((err) => console.log('err update description'));
    }

    const sendEmailResetPassword = () => {
        toastDisplayPromiseSendMail(SendResetPasswordEmailService(profilData.email)
        )
    }

    const profilComponent = () => {
        return (
            <div className={styles.profil + ' ' + anim.fadeIn}>
                <div className={styles.imgContainer}>
                    {
                        loadingImg && width > 800 &&
                        <div className={styles.loaderImg}>
                            <LoaderImg/>
                        </div>
                    }

                    {
                        localImg && file ?
                            <>
                                <img
                                    onClick={() => imgClick()}
                                    src={localImg} alt={'Nouvelle Image Ogla Profil'}/>
                            </>
                            :
                            <Tippy trigger={'mouseenter'} content={'Modifier'}>
                                <img
                                    onClick={() => imgClick()}
                                    src={profil?.img} onError={(e) => e.target.src = GetDefaultUserImgWhenError()}
                                    alt={'Profil Ogla'}
                                referrerPolicy={'no-referrer'}
                                />

                            </Tippy>
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
                                    {
                                        width < 800 ?

                                            <div className={styles.containerBtnImgPhone}>
                                                {
                                                    loadingImg ?
                                                        <LoaderImg/>
                                                        :
                                                        <>
                                                            <button onClick={() => updatePic()}
                                                            >Modifier
                                                            </button>
                                                            <button onClick={() => {
                                                                setLocalImg(null);
                                                                setFile(null);
                                                            }
                                                            } className={styles.darkBtn}>Annuler
                                                            </button>
                                                        </>

                                                }

                                            </div> :
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

                                </>

                            }

                        </div>
                    </div>
                </div>

                <div className={styles.form}>
                    <label>Pseudo</label>
                    <input disabled={true} type={"text"} value={profilData.pseudo}/>
                    <label className={styles.emailLabel}>Email <span>{profilData.verified ?
                        <CheckBadgeIcon/> :
                        <span className={styles.verify} onClick={() => {
                            if (!profilData.verified) {
                                verifyEmail();
                            }
                        }}>(Vérifier maintenant)</span>}</span></label>
                    <input disabled={true} type={"text"} value={profilData.email}/>
                    {
                        session?.user?.provider !== 'google' ?
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
                                        className={oldPassword !== "" && newPassword !== "" ? styles.active + ' ' + styles.modifyBtn : styles.disabled + ' ' + styles.modifyBtn}>Envoyer
                                </button>
                            </>
                            :
                            <button className={styles.createPassword} onClick={() => sendEmailResetPassword()}>Créer un
                                mot de passe <LockClosedIcon/></button>

                    }


                </div>
            </div>

        )
    }

    const writerComponent = () => {
        return (
            <div className={styles.writer + ' ' + anim.fadeIn}>
                <div className={styles.lContainerWriter}>

                    <div className={styles.containerImg}>
                        <img src={profilData?.img} referrerPolicy={'no-referrer'} onError={(e) => e.target.src = GetDefaultUserImgWhenError()} alt={'Image Profil Ogla'}/>
                        <h5>Ecrivain <span>OGLA</span></h5>
                    </div>

                    <div className={styles.headerWriterStats}>
                        <h5>Devenu écrivain
                            le <span>{FormatDateStr(profilData?.register_date)}</span></h5>

                        <p>{profilData.author.likes} j&apos;aimes</p>
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
                                    placeholder={"Donnez envie aux lecteurs de vous découvrir avec une présentation de vous, brève mais sympathique... "}/>
                                :
                                <textarea
                                    onChange={(e) => setNewPresentation(e.target.value)}
                                    className={scroll.scrollbar}
                                    value={newPresentation}/>
                        }


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
                                <ProfilAuthor type={4} content={profilData?.author.social.tiktok} />
                            </div>
                            <div className={styles.socialImg}>
                                <img src={GetImgPathOfAssets() +"other/manReading2.png"} onError={(e) => e.target.src = '/assets/other/manReading2.png'} alt="Auteur lit un livre ogla"/>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        )
    }

    const becameWriter = () => {
        return (
            <div className={styles.becameWriter + ' ' + anim.fadeIn}>
                <img alt={'Image Castle Ogla'} src={GetImgPathOfAssets() +'diapo/castle.png'} onError={(e) => e.target.src = 'assets/diapo/castle.png'}/>
                <h5>Deviens écrivain <strong>OGLA</strong> dès maintenant !</h5>
                <p>Rejoignez notre communauté d&apos;écrivains aujourd&apos;hui et partagez votre histoire avec le monde entier
                    ! <br/>
                    Avec <strong>OGLA</strong>, chaque personne peut devenir un écrivain et chaque histoire a la chance
                    d&apos;être entendue</p>

                <button onClick={() => router.push('/devenir-ecrivain')}>Je me lance !</button>
            </div>
        )
    }

    const settingComponent = () => {
        return (
            <div className={styles.settings +  ' ' + anim.fadeIn}>
                {
                    width > 800 &&
                    <h5>Réglages</h5>
                }
                <div className={styles.itemSetting}>
                    <div className={styles.fSetting}>
                        <BellAlertIcon/>
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
                        <input  checked={notifState} readOnly={true} type="checkbox" id="toggle1"/>
                        <label htmlFor="toggle1"></label>
                    </div>

                </div>

                <div className={styles.itemSetting} style={{
                    borderBottom: 'solid 1px rgba(84, 89, 95, 0.13)'
                }}>
                    <div className={styles.fSetting}>

                        <MusicalNoteIcon/>
                        <div>
                            <p className={styles.labelSetting}>Musique </p>
                            <p className={styles.valueSetting}>Activer la musique</p>
                        </div>
                    </div>

                    <div className={musicState ? styles.musicToggle + ' ' + styles.activeToggle : styles.musicToggle}
                         onClick={() => {
                             setMusicState(!musicState);
                         }}>
                        <input checked={musicState} readOnly={true} type="checkbox" id="toggle2"/>
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
                    <div className={activeLink === 'profil' ? styles.item + ' ' + styles.activeItem : styles.item}
                         onClick={() => setActiveLink('profil')}>
                        <UserIcon/>
                        <p> Profil </p>
                    </div>
                    <div className={activeLink === 'writer' ? styles.item + ' ' + styles.activeItem : styles.item}
                         onClick={() => setActiveLink('writer')}>
                        <svg fill="white" viewBox="-2.5 -3 24 24" preserveAspectRatio="xMinYMin" >
                            <path
                                d="M5.648 12.276l-1.65 1.1-.415 1.68 1.665-.42 1.104-1.656-.704-.704zM7.1 10.899l.627.627.091-.032c.937-.334 1.88-1.019 2.824-2.089 1.139-1.29 3.061-3.587 5.757-6.879a.211.211 0 0 0-.297-.297c-3.286 2.693-5.583 4.616-6.881 5.758-1.076.946-1.76 1.888-2.088 2.819l-.033.093zm-.615 5.486L.843 17.814l1.4-5.671 3.004-2.004C5.7 8.863 6.583 7.645 7.9 6.486c1.32-1.162 3.632-3.097 6.936-5.804a2.21 2.21 0 0 1 3.111 3.112c-2.71 3.309-4.645 5.62-5.804 6.934-1.156 1.31-2.373 2.193-3.652 2.65l-2.005 3.007z"/>
                        </svg>
                        <p> Ecrivain </p>
                    </div>
                    <div className={activeLink === 'settings' ? styles.item + ' ' + styles.activeItem : styles.item}
                         onClick={() => setActiveLink('settings')}>
                        <Cog8ToothIcon/>
                        <p> Réglages </p>
                    </div>
                    <div
                        className={activeLink === 'notifications' ? styles.item + ' ' + styles.activeItem : styles.item}
                        onClick={() => {
                            if (Notifs.length > 0) {
                                OpenAllService(Notifs[0].date_creation, session.user.id)
                            }
                            dispatch(setActiveModalNotif(true));
                            dispatch(setOpen());
                        }}>
                        <BellAlertIcon/>
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
                                    <img src={session.user.image} referrerPolicy={'no-referrer'} onError={(e) => e.target.src = GetDefaultUserImgWhenError()}/>
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
            <Head>
                <title>Ogla - Profil</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {
                err && session &&
                <div>
                    {
                        width > 950 ?
                            <HeaderMain/> :
                            <HeaderMainResponsive/>
                    }

                    <div className={styles.err}>
                        <ErrMsg text={'Impossible de récupérer votre profil'}/>
                    </div>

                    {
                        width < 800 &&
                        <Footer/>
                    }
                </div>
            }
            {
                !err && profilData && session &&
                <div className={styles.container}>
                    {
                        width > 950 ?
                            <HeaderMain/> :
                            <HeaderMainResponsive/>
                    }
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
                                            className={activeLink === 'writer' ? styles.activeMenu : undefined}>Ecrivain
                                    </button>
                                    <button onClick={() => setActiveLink('settings')}
                                            className={activeLink === 'settings' ? styles.activeMenu : undefined}>Réglages
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
                        <DeleteAccountModal close={() => setOpenModalDeleteAccount(false)}/>
                    }
                </div>
            }
            {
                <>
                    {
                        width >= 800 ?
                        <Footer/>
                            :
                            <>
                                {
                                    err || !session &&
                                    <Footer/>
                                }
                            </>

                    }
                </>
            }


        </>
    )
}

export default Profil;