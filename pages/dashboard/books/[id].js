import styles from '../../../styles/Pages/Dashboard/OneBook.module.scss';
import { useEffect, useState} from "react";
import {getOneBook} from "../../../service/Dashboard/BooksAuthorService";
import ErrorDashboard from "../../../Component/Dashboard/ErrorDashboard";
import VerticalAuthorMenu from "../../../Component/Menu/VerticalAuthorMenu";
import HeaderDashboard from "../../../Component/Dashboard/HeaderDashboard";
import {useRouter} from "next/router";
import {getConfigOfProtectedRoute} from "../../api/utils/Config";


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
    const router = useRouter();

    useEffect(() => {
        if(router.isReady){
            setLoading(false);
        }
    },[router.isReady])


    return (
        <div className={styles.container}>
            <div className={styles.containerMain}>
                <div className={styles.verticalMenuContainer}>
                    <VerticalAuthorMenu/>
                </div>

                <div className={styles.containerData}>
                    <HeaderDashboard/>
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
                        <div className={styles.container}>
                            <div className={styles.labelContainer}>
                                <h4>{book.title}</h4>
                            </div>
                            <div className={styles.selectContainer}>
                            </div>
                        </div>
                    }
                </div>
            </div>

        </div>



    )
}

export default OneBook;