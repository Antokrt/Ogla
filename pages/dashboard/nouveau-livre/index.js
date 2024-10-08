import styles from '../../../styles/Pages/Dashboard/New.module.scss';
import anim from '../../../styles/utils/anim.module.scss';
import scrollbar from '../../../styles/utils/scrollbar.module.scss';
import VerticalAuthorMenu from "../../../Component/Menu/VerticalAuthorMenu";
import HeaderDashboard from "../../../Component/Dashboard/HeaderDashboard";
import React, {useRef, useState} from "react";
import {
    ArrowDownIcon,
    CheckBadgeIcon,
    CursorArrowRaysIcon
} from "@heroicons/react/24/outline";
import {Capitalize} from "../../../utils/String";
import { NewBookService} from "../../../service/Dashboard/BooksAuthorService";
import {useRouter} from "next/router";
import {GetImgPathOfAssets, renderPrediction} from "../../../utils/ImageUtils";
import {toastDisplayError, toastDisplaySuccess} from "../../../utils/Toastify";
import {LoaderImg} from "../../../Component/layouts/Loader";
import VerticalPhoneMenu from "../../../Component/Menu/VerticalPhoneMenu";
import VerticalTabMenu from "../../../Component/Menu/VerticalTabMenu";
import useOrientation from "../../../utils/Orientation";
import ScreenSize from "../../../utils/Size";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon} from "@heroicons/react/24/solid";
import {PhotoIcon} from "@heroicons/react/20/solid";
import {useSelector} from "react-redux";
import {selectCategories} from "../../../store/slices/categorySlice";
import Head from "next/head";
import { selectTheme } from '../../../store/slices/themeSlice';


const New = () => {
    const [step, setStep] = useState(1);
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState('');
    const [category, setCategory] = useState('Action');
    const imageMimeType = /image\/(png|jpg|jpeg)/i;
    const [selectedFile, setSelectedFile] = useState(null);
    const [disableBtn,setDisableBtn] = useState(false);
    const fileRef = useRef(null);
    const [seeErrMsg, setSeeErrMsg] = useState(false);
    const [errMsg,setErrMsg] = useState('');
    const [localImg, setLocalImg] = useState(null);
    const [loadingImg, setLoadingImg] = useState(false);
    const router = useRouter();
    const orientation = useOrientation();
    const [width, height] = ScreenSize();
    const categories = useSelector(selectCategories);
    const [loadingBtn,setLoadingBtn] = useState(false);
    const theme = useSelector(selectTheme)

    const handleFileSelect = (event) => {
        if (event?.target.files && event.target.files[0]) {
            setLocalImg(URL.createObjectURL(event.target.files[0]));
        }
    }
    const openFileUpload = () => {
        fileRef.current.click();
    }
    const sendData = () => {
        if(disableBtn){
            return null;
        }
        setLoadingBtn(true);
        setDisableBtn(true);
        const form = {
            title: title,
            summary: summary,
            category: category.toLowerCase(),
            img: 'none'
        }
        NewBookService(form, selectedFile)
            .then((res) => {
                setLoadingBtn(false);
                toastDisplaySuccess('Livre publié !');
                if (res.data._id) {
                    router.push('/dashboard/books/' + res.data._id);
                }
                else {
                    router.push('/dashboard/books')
                }
            })
            .catch((err) => {
                setSeeErrMsg(true);
                setLoadingBtn(false);
                setDisableBtn(false);
                if(err.response.data.message === 'Book-120'){
                    setErrMsg('Titre incorrect.');
                }
                else{
                    setErrMsg('Impossible de créer le livre.')
                }
            });

    }
    const previous = () => {
        return setStep(step - 1);
    }
    const next = () => {
        return setStep(step + 1);
    }
    const validFirst = () => {
        return title !== '' &&
            title.length >= 5 &&
            title.length <= 100 &&
            summary !== "" &&
            summary.length <= 2000 &&
            category !== "";
    }

    const btn = () => {
        return (
            <div className={styles.btnContainer}>
                {
                    step <= 1 &&
                    <>
                        {
                            validFirst()
                                ?
                                <button onClick={() => next()}>Suivant <ChevronDoubleRightIcon/></button> :
                                <button className={styles.disabledBtn}>Suivant <ChevronDoubleRightIcon/></button>

                        }
                    </>
                }
                {
                    step === 2 &&
                    <>
                        <button onClick={() => previous()}><ChevronDoubleLeftIcon/> Précédent</button>
                        <button onClick={() => next()}>Suivant <ChevronDoubleRightIcon/></button>
                    </>
                }
                {
                    step >= 3 && !loadingImg &&
                    <>
                        <button onClick={() => previous()}><ChevronDoubleLeftIcon/> Précédent</button>
                        <button className={styles.sendBtn} onClick={() => sendData()}>
                            {
                                !loadingBtn ?
                                    <span>
                                        Enregistrer <CursorArrowRaysIcon/>
                                    </span> :
                                    <span><LoaderImg/></span>
                            }

                        </button>
                    </>
                }
            </div>
        )
    }

    const firstStep = () => {

        return (
            <>
                <h5>Commençons par les informations de base de votre livre ! <br/> Entrez un
                    titre <span>accrocheur</span>, un résumé <span>concis </span> pour donner un aperçu de
                    l&apos;histoire et choisir une <span> catégorie </span> pour aider les lecteurs à trouver votre
                    livre dans la bibliothèque <span className={styles.purple}>OGLA</span></h5>
                <div className={styles.inputContainer}>
                    <label>Titre</label>
                    <input
                        value={title}
                        placeholder={'Entrez le titre de votre livre ici...'}
                        type='text'
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                    />

                    <label>Résumé</label>
                    <textarea
                        placeholder={'Donnez un aperçu de l\'histoire en quelques phrases...'}
                        className={scrollbar.scrollbar}
                        value={summary}
                        type='text'
                        onChange={(e) => {
                            setSummary(e.target.value);
                        }}
                    />
                    <label>Catégorie</label>
                    <div className={styles.selectCategory}>
                        <ArrowDownIcon/>
                        <select
                            value={category}
                            name="genres"
                            onChange={(e) => setCategory(e.target.value)}
                            id="cat-select">
                            {
                                categories.map((item) => {
                                    return (
                                        <option key={item._id}
                                                value={Capitalize(item.name)}>{Capitalize(item.name)}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
            </>
        )
    }

    const secondStep = () => {
        return (
            <>
                <h5 className={styles.titleImg}>
                    Choisissez une image qui mettra en valeur votre livre et attirera l&apos;attention des lecteurs. Cette
                    image sera utilisée pour la couverture de votre livre et pour promouvoir votre livre sur les réseaux
                    sociaux. Assurez-vous que l&apos;image est de haute résolution et représente bien l&apos;ambiance de votre
                    histoire.
                </h5>

                <div className={styles.inputContainer}>
                    <label className={styles.fileLabel}>Ajoutez une image (facultatif)</label>
                    {
                        selectedFile && localImg &&
                        <div className={styles.fileContainer}>
                            {
                                loadingImg &&
                                <div className={styles.loaderImg}>
                                    <LoaderImg/>
                                </div>
                            }
                            <img
                                onClick={openFileUpload}
                                src={localImg}
                                alt={'Nouvelle Image Ogla'}
                                width={'200px'}
                                className={styles.fileName}/>
                        </div>
                    }
                    <div className={styles.addFileContainer}>
                        {
                            loadingImg && !localImg && !selectedFile &&
                            <div className={styles.load}>
                                <LoaderImg/>
                            </div>
                        }
                        <label className={styles.labelFile} htmlFor={'file'}>Choisir une image <PhotoIcon/></label>

                    </div>
                    <input
                        id={"file"}
                        name={'file'}
                        className={styles.fileInput}
                        accept={"image/png , image/jpeg , image/jpg"}
                        type='file'
                        ref={fileRef}
                        onChange={async (e) => {
                            setLoadingImg(true);
                            const file = e.target.files[0];
                            if (!file?.type.match(imageMimeType)) {
                                setLoadingImg(false);
                                return null;
                            }
                            const data = await renderPrediction(file, 'book');
                            if (data) {
                                handleFileSelect(e);
                                setSelectedFile(e.target.files[0]);
                                setLoadingImg(false);
                            } else {
                                setLoadingImg(false);
                                toastDisplayError("Image non conforme");
                            }
                        }}
                    />
                </div>


            </>
        )
    }

    const thirdStep = () => {
        return (
            <div className={styles.finalContainer}>
                {
                    localImg &&
                    <img alt={'Nouvelle Image Ogla'} src={localImg}/>
                }
                <h4>{title}</h4>
                <p>{category}</p>

                <textarea
                    disabled={true}
                    className={scrollbar.scrollbar}
                    value={summary}
                    type='text'
                    onChange={(e) => {
                        setSummary(e.target.value);
                    }}
                />
            </div>
        )
    }

    const checkStep = () => {
        switch (step) {
            case 1:
                return firstStep();

            case 2:
                return secondStep();

            case 3:
                return thirdStep();
        }
    }
    const titleStep = () => {
        switch (step) {
            case 1:
                return <h3>Création</h3>
                break;

            case 2:
                return <h3>Personnalisation</h3>
                break;

            case 3:
                return <h3>Nouveau livre</h3>
                break;

            default:
                return <h3>Nouveau</h3>
        }
    }

    return (
        <div className={theme ? styles.container : styles.container + ' ' + styles.dark}>

            <Head>
                <title>Ogla - Nouveau livre</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            {
                width > 1050 && height > 600 ?
                    <div className={styles.verticalMenuContainer}>
                        <VerticalAuthorMenu/>
                    </div>
                    :
                    <>
                        {
                            width >= 700 && width <= 1050 ?
                                <div className={styles.verticalTabContainer}>
                                    <VerticalTabMenu/>
                                </div>
                                :
                                <VerticalPhoneMenu/>
                        }
                    </>
            }


            <div className={styles.containerData}>
                <div className={styles.abso}>

                </div>

                <div className={styles.stepperContainer}>
                    <div className={styles.step}>
                        <div className={styles.circle + " " + styles.notCompletedCircle}>
                            <p>1</p>
                        </div>
                        <div className={styles.label}>
                            <h6>Création</h6>
                            {
                                validFirst()
                                    ?
                                    <p className={styles.completed}>Complétée <CheckBadgeIcon/></p>
                                    :
                                    <p>En cours...</p>
                            }
                        </div>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.circle}>
                            <p>2</p>
                        </div>
                        <div className={styles.label}>
                            <h6>Personnalisation </h6>
                            {
                                step > 2 ?
                                    <p className={styles.completed}>Complétée <CheckBadgeIcon/></p>
                                    :
                                    <p>En cours</p>
                            }
                        </div>
                    </div>

                    <div className={styles.step}>
                        <div className={styles.circle}>
                            <p>3</p>
                        </div>
                        <div className={styles.label}>
                            <h6>C&apos;est parti !</h6>
                        </div>
                    </div>


                </div>

                <div className={styles.newContainer}>
                    <div className={styles.titleABook}>
                        {titleStep()}
                        <img alt={'Défaut Image Ogla'} onError={(e) => e.target.src = '/assets/diapo/book.png'} src={GetImgPathOfAssets() + 'diapo/book.png'}/>
                    </div>
                    {checkStep()}
                    {btn()}
                    {
                        step === 3 && seeErrMsg &&
                        <p className={styles.errMsg}>{errMsg}</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default New;