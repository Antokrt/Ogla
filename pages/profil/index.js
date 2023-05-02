import styles from "../../styles/Pages/ProfilPage.module.scss";
import Header from "../../Component/Header";
import scroll from "../../styles/utils/scrollbar.module.scss";
import {
    BellAlertIcon,CheckBadgeIcon, MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import {
    ChartBarIcon, CheckCircleIcon, HeartIcon,XCircleIcon
} from "@heroicons/react/20/solid";
import { Capitalize } from "../../utils/String";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetPrivateProfilApi } from "../api/user";
import { DeleteUserProfilPictureService, UpdateUserProfilPictureService } from "../../service/User/Profil.service";
import axios from "axios";
import { ReloadSession } from "../../utils/ReloadSession";
import { GetDefaultUserImg, renderPrediction } from "../../utils/ImageUtils";
import { DeleteAccountService, VerifyEmailService } from "../../service/User/Account.service";
import { FormatDateNb, FormatDateStr } from "../../utils/Date";
import { ChangePasswordService } from "../../service/User/Password.service";
import { DeleteAccountModal } from "../../Component/Modal/DeleteAccountModal";
import { BookmarkIcon } from "@heroicons/react/24/solid";
import { UpdateAuthorDescriptionService, UpdateUserDescriptionService } from "../../service/Author";
import ProfilAuthor from "../../Component/Profil/ProfilAuthor";
import Footer from "../../Component/Footer";
import {useDispatch} from "react-redux";
import {setActiveModalNotif} from "../../store/slices/notifSlice";
import {LoaderImg} from "../../Component/layouts/Loader";
import {toastDisplayError} from "../../utils/Toastify";

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
    const [isCreator, setIsCreator] = useState(true);
    const [activeLink, setActiveLink] = useState('profil');
    const [hasChanged, setHasChanged] = useState(false);
    const [wantToDelete, setWantToDelete] = useState(false);
    const [profil, setProfil] = useState(profilData);
    const [newProfil, setNewProfil] = useState(profil);
    const [newPresentation, setNewPresentation] = useState(profil?.author?.description);
    const { data: session, status } = useSession();
    const [password, setPassword] = useState('');
    const [openModalDeleteAccount, setOpenModalDeleteAccount] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassowrd] = useState('');
    const [wrongPasswordErr, setWrongPasswordErr] = useState(false);
    const [loadingImg,setLoadingImg] = useState(false);
    const [errMsgModifyPassword, setErrMsgModifyPassword] = useState({
        msg: '',
        show: false
    })
    const [errMsgPassword, setErrMsgPassword] = useState('Mot de passe incorect');
    const [localImg, setLocalImg] = useState(null);
    const [file, setFile] = useState(false);
    const imageMimeType = /image\/(png|jpg|jpeg)/i;
    const [notifState,setNotifState] = useState(false);
    const [musicState,setMusicState] = useState(false);
    const imgRef = useRef();
    const dispatch = useDispatch()

    const handleFileSelect = (event) => {
        if (event?.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setLocalImg(URL.createObjectURL(event.target.files[0]));
        }
    }

    const imgClick = () => {
        imgRef.current.click();
    }

    const updatePic = async () => {
        if (file) {
            setLoadingImg(true);
            const data = await renderPrediction(file,'user');
            if(data){
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
            }
            else {
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
                console.log(profil)
                setNewPresentation(res);
            })
            .catch((err) => console.log(err));
    }

    const profilComponent = () => {
        return (
            <div className={styles.profil}>
                <div className={styles.imgContainer}>
                    {
                        loadingImg &&
                        <div className={styles.loaderImg}>
                            <LoaderImg/>
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
                            <img
                                onClick={() => imgClick()}
                                src={profil.img} alt={'Profil Pic'} />
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
                        }}>Vérifier maintenant</span>}</span></label>
                    <input disabled={true} type={"text"} value={profilData.email} />
                    {
                        session.user.provider === 'ogla' &&
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
                                className={oldPassword !== "" && newPassword !== "" ? styles.active + ' ' + styles.modifyBtn : styles.disabled + ' ' + styles.modifyBtn}>Modifier
                            </button>
                        </>

                    }



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
                            <img src={'/assets/jim/cool2.png'} />
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


                        <div className={styles.writerItem}>
                            <p className={styles.label}>Livre le plus liké <HeartIcon /></p>
                            <p className={styles.value}>La quete du maitre <span>21201</span></p>
                        </div>

                        <div className={styles.writerItem}>
                            <p className={styles.label}>Chapitre le plus liké <ChartBarIcon /></p>
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
                                    placeholder={"Donnez envie aux lecteurs de vous découvrir avec une présentation de vous, brève mais sympathique... "} />
                                :
                                <textarea
                                    onChange={(e) => setNewPresentation(e.target.value)}
                                    className={scroll.scrollbar}
                                    value={newPresentation} />
                        }


                    </div>

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
                                <img src={"/assets/other/manReading2.png"} alt="author reading"/>
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
                    ! <br/>
                    Avec <strong>OGLA</strong>, chaque personne peut devenir un écrivain et chaque histoire a la chance
                    d'être entendue"</p>

                <button onClick={() => router.push('/devenir-auteur')}>Je me lance !</button>
            </div>
        )
    }

    const settingComponent = () => {
        return (
            <div className={styles.settings}>
                <h5>Réglages</h5>
                <div className={styles.itemSetting}>
                    <div className={styles.fSetting}>
                        <BellAlertIcon/>
                        <div>
                            <p className={styles.labelSetting}>Notifications </p>
                            <p className={styles.valueSetting}>Désactiver les notifications en temps réelle </p>
                        </div>


                    </div>

                    <div className={notifState ? styles.toggleBtn + ' ' + styles.activeToggle : styles.toggleBtn} onClick={() => setNotifState(!notifState)}>
                        <input checked={notifState}  type="checkbox" id="toggle1"/>
                            <label htmlFor="toggle1"></label>
                    </div>

                </div>

                <div className={styles.itemSetting} style={{
                    borderBottom:'solid 1px rgba(84, 89, 95, 0.13)'
                }}>
                    <div className={styles.fSetting}>

                        <MusicalNoteIcon/>
                        <div>
                            <p className={styles.labelSetting}>Musique </p>
                            <p className={styles.valueSetting}>Désactiver la musique</p>
                        </div>
                    </div>

                    <div className={musicState ? styles.musicToggle + ' ' + styles.activeToggle : styles.musicToggle} onClick={() => {
                        console.log('click music')
                        setMusicState(!musicState)
                    }}>
                        <input checked={musicState}  type="checkbox" id="toggle2"/>
                        <label htmlFor="toggle2"></label>
                    </div>


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
                                <button onClick={() => setActiveLink('settings')}
                                        className={activeLink === 'settings' && styles.activeMenu}>Réglages
                                </button>
                                <button onClick={() => dispatch(setActiveModalNotif(true))}
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
                        {/* <Footer></Footer> */}
                        
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





