import styles from '../../../styles/Pages/Dashboard/New.module.scss';
import scrollbar from '../../../styles/utils/scrollbar.module.scss';
import VerticalAuthorMenu from "../../../Component/Menu/VerticalAuthorMenu";
import HeaderDashboard from "../../../Component/Dashboard/HeaderDashboard";
import {useEffect, useRef, useState} from "react";
import {ArrowDownIcon, CheckBadgeIcon} from "@heroicons/react/24/outline";
import Category from "../../../json/category.json";
import {Capitalize} from "../../../utils/String";
import {newBook} from "../../../service/Dashboard/BooksAuthorService";
import {useRouter} from "next/router";


const New = () => {
    const [step,setStep] = useState(1);
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState('');
    const [category, setCategory] = useState('Action');
    const imageMimeType = /image\/(png|jpg|jpeg)/i;
    const [selectedFile, setSelectedFile] = useState(null);
    const fileRef = useRef(null);
    const [seeErrMsg,setSeeErrMsg] = useState(false);
    const [localImg, setLocalImg] = useState(null);
    const router = useRouter();

    const handleFileSelect = (event) => {
        if(event?.target.files && event.target.files[0]){
            setLocalImg(URL.createObjectURL(event.target.files[0]))
        }
    }

    const openFileUpload = () => {
        fileRef.current.click();
    }

    const sendData = () => {
        const form = {
            title: title,
            summary:summary,
            category:category.toLowerCase(),
            img:'none'
        }
        newBook(form, selectedFile)
            .then((res) => {
                if(res.data._id){
                    router.push('/dashboard/books/'+ res.data._id);
                }
            })
            .catch((err) => setSeeErrMsg(true));

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

    const validSecond = () => {
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
                                <button onClick={() => next()}>Suivant</button> :
                                    <button className={styles.disabledBtn}>Suivant</button>

                            }
                        </>
                    }
                    {
                        step === 2 &&
                        <>
                            <button onClick={() => previous()}>Précédent</button>
                            <button onClick={() => next()}>Suivant</button>
                        </>
                    }
                    {
                        step >= 3 &&
                        <>
                            <button onClick={() => previous()}>Précédent</button>
                            <button className={styles.sendBtn} onClick={() => sendData()}>Enregistrer</button>
                        </>
                    }
                </div>
        )
    }

    const firstStep = () => {

        return (
<>
    <h5>Commençons par les informations de base de votre livre ! <br/> Entrez un titre <span>accrocheur</span>, un résumé <span>concis </span>  pour donner un aperçu de l'histoire et choisir une <span> catégorie </span>  pour aider les lecteurs à trouver votre livre dans la bibliothèque <span className={styles.purple}>OGLA</span></h5>
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
                    id="pet-select" >
                {
                    Category.category.map((item) => {
                        return (
                            <option
                                value={Capitalize(item.name)}>{Capitalize(item.name)}</option>
                        )
                    })
                }
                <option value={"other"}>Autre</option>
            </select>
        </div>
    </div>
</>
        )
    }

    const secondStep = () => {
        return (
            <>
                <h5>
                    Choisissez une image qui mettra en valeur votre livre et attirera l'attention des lecteurs. Cette image sera utilisée pour la couverture de votre livre et pour promouvoir votre livre sur les réseaux sociaux. Assurez-vous que l'image est de haute résolution et représente bien l'ambiance de votre histoire.
                </h5>

                <div className={styles.inputContainer}>
                    <label>Ajoutez une image (Facultatif)</label>
                    {
                        selectedFile && localImg &&
                        <div className={styles.fileContainer}>
                            <img
                                onClick={openFileUpload}
                                src={localImg}
                                 alt={'Selected'}
                                 width={'200px'}
                                 className={styles.fileName}/>
                        </div>
                    }
                    <div className={styles.addFileContainer}>
                        <label className={styles.labelFile} htmlFor={'file'}>Choisir une image</label>

                    </div>
                    <input
                        id={"file"}
                        name={'file'}
                        className={styles.fileInput}
                           accept={"image/png , image/jpeg , image/jpg" }
                           type='file'
                           ref={fileRef}
                           onChange={(e) => {
                               const file = e.target.files[0];
                               if(!file?.type.match(imageMimeType)){
                                   return null;
                               }
                               handleFileSelect(e);
                               setSelectedFile(e.target.files[0]);
                           }}
                    />
                </div>


            </>
            )
    }

    const thirdStep = () => {
        return (
            <div className={styles.finalContainer}>
                    <img src={localImg}/>
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
        switch (step){
            case 1:
                return firstStep();

            case 2:
                return secondStep();

            case 3:
                return thirdStep();
        }
    }

    const titleStep = () => {
        switch (step){
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


    return(
        <div className={styles.container}>
            <div className={styles.verticalMenuContainer}>
                <VerticalAuthorMenu/>
            </div>

            <div className={styles.containerData}>
                <div className={styles.abso}>

                </div>

                <div className={styles.stepperContainer}>
                    <div className={styles.step}>
                        <div className={styles.circle + " " + styles.notCompletedCircle}>
                            <p>1</p>
                        </div>
                        <div className={styles.label}>
                            <h6>Création </h6>
                            {
                                    validFirst()
                                    ?
                                <p className={styles.completed}>Complétée <CheckBadgeIcon/> </p>
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
                                    <p className={styles.completed}>Complétée <CheckBadgeIcon/> </p>
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
                            <h6>C'est parti !</h6>
                        </div>
                    </div>


                </div>

                <div className={styles.newContainer}>
                    { titleStep() }
                    { checkStep() }
                    { btn() }
                    {
                        step === 3 && seeErrMsg &&
                        <p className={styles.errMsg}>Impossible de créer le livre</p>
                    }

                </div>
            </div>
        </div>
    )
}

export default New;