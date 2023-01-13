import styles from '../../../styles/Pages/Dashboard/OneBook.module.scss';
import { useEffect, useState} from "react";
import {getOneBook} from "../../../service/Dashboard/BooksAuthorService";
import ErrorDashboard from "../../../Component/Dashboard/ErrorDashboard";
import VerticalAuthorMenu from "../../../Component/Menu/VerticalAuthorMenu";
import HeaderDashboard from "../../../Component/Dashboard/HeaderDashboard";
import {useRouter} from "next/router";
import {getConfigOfProtectedRoute} from "../../api/utils/Config";
import {UserCircleIcon} from "@heroicons/react/24/solid";
import {useSession} from "next-auth/react";
import {BookOpenIcon} from "@heroicons/react/24/solid";
import {ChatBubbleLeftRightIcon} from "@heroicons/react/24/solid";
import {ArrowTrendingUpIcon, TagIcon} from "@heroicons/react/20/solid";


export async function getServerSideProps({req,params}){
    const id = params.id;
    const config = await getConfigOfProtectedRoute(req);
    const book = await fetch('http://localhost:3008/author/book/'+ id,config);
    const bookErrData = !book.ok;
    const booksJson = await book.json();
    return {
        props:{
            err:{
                book:bookErrData
            },
            book: booksJson,
        }
    }
}

const OneBook = ({book, err}) => {
    const [loading,setLoading] = useState(true);
    const  {data:session} = useSession();
    const [active,setActive] = useState('chapter');

    const [newSummary,setNewSummary] = useState(book.summary);
    const router = useRouter();

    useEffect(() => {
        if(router.isReady){
            setLoading(false);
        }
    },[router.isReady])

    useEffect(() => {
        console.log(newSummary === book.summary)
    },[newSummary])


    return (
        <div className={styles.container}>
                <div className={styles.verticalMenuContainer}>
                    <VerticalAuthorMenu/>
                </div>

                <div className={styles.containerData}>
                    <div className={styles.containerHeader}>
                        <HeaderDashboard/>
                    </div>
                    {
                        loading &&
                        <p>Loading...</p>
                    }
                    {
                        !loading && err.book &&
                        <ErrorDashboard
                            title={'Impossible de récupérer les données du livre !'}
                            subTitle={"Réessayer ou contacter le support pour obtenir de l'aide..."}
                            btn={'Retour à la liste'}
                            link={() => {
                            router.push('/dashboard/books')
                            }
                            }
                            img={'/assets/chara/chara5.png'}
                        />
                    }
                    {
                        !loading && !err.book && book.length !== 0 &&
                        <>
                            <div className={styles.menuContainer}>
                                <p onClick={() => setActive('chapter')} className={active === 'chapter' ? styles.active : ''}>Chapitres</p>
                                <p onClick={() => setActive('commentary')} className={active === 'commentary' ? styles.active : ''}>Commentaires</p>
                            </div>

                            <div className={styles.containerOneBook}>
                                <div className={styles.labelContainer}>
                                    <div className={styles.containerTitle}>
                                        <h2>{book.title}</h2>
                                        <span></span>
                                    </div>
                                    <div className={styles.imgADescription}>
                                        <div className={styles.containerImg}>
                                            <img src={'/assets/livre1.jpg'}/>
                                        </div>
                                        <div className={styles.description}>
                                            <div className={styles.headerTextarea}>
                                                <h5>Résumé</h5>
                                                <button
                                                    className={newSummary !== book.summary && newSummary.length > 20 ? styles.activeBtn : ''}
                                                >Modifier</button>
                                            </div>
                                            {
                                                book.summary.length !== 0 ?
                                                <textarea onChange={(e) => setNewSummary(e.target.value)}>
                                                    {newSummary}
                                            </textarea>
                                                    :
                                                    <textarea
                                                        onChange={(e) => setNewSummary(e.target.value)}
                                                    >
                                                        Ajoutez un résumé pour donnez envie à vos lecteurs.
                                                    </textarea>
                                            }

                                        </div>
                                    </div>

                                    <div className={styles.presentationContainer}>
                                        <div className={styles.statsLabelContainer}>
                                            <div className={styles.chapterNbLabel}>
                                                <p className={styles.length}>239</p>
                                                <h6>like(s)</h6>
                                            </div>
                                            <div className={styles.chapterNbLabel}>
                                                <p className={styles.length}>67{book.chapter_list.length}</p>
                                                <h6>chapitre(s)</h6>
                                            </div>
                                            <div className={styles.dateLabel}>
                                                <p>17/02/2022</p>
                                                <h6>depuis le</h6>
                                            </div>
                                        </div>
                                        <div className={styles.contentContainer}>
                                            <div>
                                                <TagIcon className={styles.tag}/>
                                                <p className={styles.category}>{book.category}</p>
                                            </div>
                                            <div>
                                                <BookOpenIcon/>
                                                <p className={styles.last}>Dernier chapitre - 18/09/23 </p>
                                            </div>
                                            <div>
                                                <ArrowTrendingUpIcon/>
                                                <p className={styles.last}>178 <br/>commentaires </p>
                                            </div>
                                            <p className={styles.delete}>Supprimer le livre</p>

                                        </div>
                                    </div>

                                </div>
                                <div className={styles.selectContainer}>
                                </div>
                            </div>
                        </>

                    }
            </div>
        </div>



    )
}

export default OneBook;