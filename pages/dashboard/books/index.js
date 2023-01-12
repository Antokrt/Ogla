import styles from '../../../styles/Pages/Dashboard/Books.module.scss';
import {useSession} from "next-auth/react";
import {BellAlertIcon, ClockIcon, MagnifyingGlassIcon, PencilIcon} from "@heroicons/react/24/outline";
import CardBook from "../../../Component/Dashboard/Card/CardBook";
import {useEffect, useState} from "react";
import VerticalAuthorMenu from "../../../Component/Menu/VerticalAuthorMenu";
import HeaderDashboard from "../../../Component/Dashboard/HeaderDashboard";
import {getConfigOfProtectedRoute} from "../../api/utils/Config";
import {useRouter} from "next/router";

export async function getServerSideProps({context, req}){
    const config = await getConfigOfProtectedRoute(req);
    const books = await fetch('http://localhost:3008/author/my-books',config);
    const booksErrData = books.ok ? false : books.status;
    const booksJson = await books.json()

    return {
        props:{
            err:{
                books:booksErrData
            },
            data: booksJson,
        }
    }
}

const Books = ({data}) => {
    const {data: session} = useSession();
    const [select,setSelect] = useState('');
    const [books,setBooks] = useState()
const router = useRouter();

useEffect(() => {
    if(router.isReady){
        setBooks(data)
    }
})

    const hasNoBooks = () => {
        return (
            <div className={styles.mainHasNoBooks}>
                <div className={styles.hasNotWriteContainer}>
                    <div>
                        <h3>OUPS <span>...</span></h3>
                        <p>Il n'y a pas encore de livres ici, mais ça ne veut pas dire que vous ne pouvez pas être le prochain Hemingway ou J.K. Rowling ! <br/> Commencez à écrire votre chef-d'œuvre dès maintenant !</p>
                        <h5>Quelques astuces pour bien débuter :</h5>
                        <ul>
                            <li>1. Écrire sur <span>OGLA</span></li>
                            <li>2. Choisir son image</li>
                            <li>3. Fidéliser ses lecteurs</li>

                        </ul>
                        <button>Nouveau livre <PencilIcon/></button>
                    </div>
                    <img src={'assets/chara/chara4.png'}/>

                </div>
            </div>


        )
    }



    return (
        <div className={styles.container}>
            <div className={styles.containerMain}>
                <div className={styles.verticalMenuContainer}>
                    <VerticalAuthorMenu/>
                </div>
                <div className={styles.containerData}>
<HeaderDashboard/>
                                    <div className={styles.headerList}>
                                        <h4>Mes livres <span>(1)</span> </h4>
                                    </div>
                                    <div className={styles.list + ' ' + styles.scrollbar}>
                                       {
                                            books?.map((item, index) => {
                                                return (
                                                    <CardBook id={item._id}
                                                              image={'/assets/livre6.jpg'}
                                                              title={item.title}
                                                              nbChapter={12}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                        {
                            books?.length === 0 &&
                            hasNoBooks()
                        }
            </div>

        </div>


        </div>
    )
}

export default Books;