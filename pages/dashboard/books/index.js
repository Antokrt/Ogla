import styles from '../../../styles/Pages/Dashboard/Books.module.scss';
import anim from '../../../styles/utils/anim.module.scss';
import {useSession} from "next-auth/react";
import {
    ArrowDownCircleIcon,
    BellAlertIcon, BookmarkSquareIcon,
    ClockIcon, CursorArrowRaysIcon,
    MagnifyingGlassIcon,
    PencilIcon, QueueListIcon, Square3Stack3DIcon
} from "@heroicons/react/24/outline";
import CardBook, {CardBookDashboard} from "../../../Component/Dashboard/Card/CardBook";
import {Fragment, useEffect, useRef, useState} from "react";
import VerticalAuthorMenu from "../../../Component/Menu/VerticalAuthorMenu";
import HeaderDashboard from "../../../Component/Dashboard/HeaderDashboard";
import {getConfigOfProtectedRoute} from "../../api/utils/Config";
import {useRouter} from "next/router";
import {GetMoreBookService} from "../../../service/Dashboard/BooksAuthorService";
import {CardBookPublic} from "../../../Component/Card/CardBook";
import {FilterBtn, FilterBtn3, SeeMoreBtn, TextSeeMore} from "../../../Component/layouts/Btn/ActionBtn";
import {ConfirmModal} from "../../../Component/Modal/ConfirmModal";
import {DateNow} from "../../../utils/Date";
import {LoaderCommentary} from "../../../Component/layouts/Loader";
import {GetBooksWithCategoryService} from "../../../service/Book/BookService";
import {ErrMsg} from "../../../Component/ErrMsg";
import SmHeaderDashboard from "../../../Component/Dashboard/SmHeaderDashboard";
import VerticalPhoneMenu from "../../../Component/Menu/VerticalPhoneMenu";
import VerticalTabMenu from "../../../Component/Menu/VerticalTabMenu";
import ScreenSize from "../../../utils/Size";
import useOrientation from "../../../utils/Orientation";
import {ArrowSmallDownIcon, Bars4Icon} from "@heroicons/react/24/solid";
import {CardBookDashboardTab} from "../../../Component/Dashboard/Card/CardBookTab";
import {CardBookPhone} from "../../../Component/Dashboard/Card/CardBookPhone";
import Head from "next/head";
import {GetFetchPath} from "../../api/utils/Instance";
import {GetImgPathOfAssets} from "../../../utils/ImageUtils";

export async function getServerSideProps({context, req}) {
    const config = await getConfigOfProtectedRoute(req);
    const books = await fetch(GetFetchPath()+ 'author/my-books/popular/1', config);
    const nbBooks = await fetch(GetFetchPath() + 'author/books-number', config)
    const booksErrData = !books.ok;
    const booksJson = await books.json();

    const nbBooksJson = await nbBooks.json();
    const nbBooksErrData = !nbBooks.ok;

    if(nbBooksErrData || booksErrData){
        return {
            props:{
                err: true,
                nbErr:true,
                booksData: null,
                nbBooks: null
            }
        }
    }

    return {
        props: {
            err: booksErrData,
            nbErr:nbBooksErrData,
            booksData: booksJson,
            nbBooks: nbBooksJson
        }
    }
}

const Books = ({booksData, err, errNb, nbBooks}) => {

    const {data: session} = useSession();
    const [page, setPage] = useState(2);
    const [books, setBooks] = useState(booksData);
    const [seeMore, setSeeMore] = useState(true);
    const [loadingScroll, setLoadingScroll] = useState(false);
    const [activeFilter, setActiveFilter] = useState('popular');
    const [width, height] = ScreenSize();
    const orientation = useOrientation();
    const divRef = useRef(null);
    const router = useRouter();

    const scrollBottom = () => {
        divRef.current.scrollTop = divRef.current.scrollHeight
    }

    const getMoreBooks = () => {
        setSeeMore(false);
        setLoadingScroll(true);
        GetMoreBookService(activeFilter, page)
            .then((res) => {
                if (res.length <= 0) {
                    setSeeMore(false);
                } else {
                    setBooks(prevState => [...prevState, ...res]);
                    setPage(page + 1);
                    setSeeMore(true);
                }
            })
            .then(() => setLoadingScroll(false))
            .then(() => setTimeout(() => scrollBottom()), 20)
            .catch((err) => setLoadingScroll(false));
    }

    const getBooksWithNewFilter = (filter) => {
        setLoadingScroll(true);
        setSeeMore(true);
        GetMoreBookService(filter, 1)
            .then((res) => {
                setBooks(res);
            })
            .then(() => {
                setPage(2);
                setLoadingScroll(false);
            })
            .catch((err) => setLoadingScroll(false));
    }


    const hasNoBooks = () => {
        return (
            <div className={styles.mainHasNoBooks + ' ' + anim.fadeIn}>
                <div className={styles.hasNotWriteContainer}>
                    <div className={styles.contentNoBooks}>
                        <h3>OUPS...</h3>
                        <p>Il n&apos;y a pas encore de livres ici, mais ça ne veut pas dire que vous ne pouvez pas être le
                            prochain Hemingway ou Zadie Smith !
                   </p>
                        <p>       Commencez à écrire votre chef-d&apos;œuvre dès
                            maintenant !</p>

                        <button onClick={() => router.push('/dashboard/nouveau-livre')}>C&apos;est parti ! <CursorArrowRaysIcon/></button>
                    </div>
                    <div className={styles.imgNoBooks}>
                        <img src={GetImgPathOfAssets()+'diapo/book.png'} alt={'Livre Défaut Ogla'} onError={(e) => e.target.src = '/assets/diapo/book.png'}/>
                    </div>

                </div>
            </div>


        )
    }

    if(err || errNb){
        return (
            <div className={styles.container}>
                <Head>
                    <title>Erreur</title>
                    <meta name="description" content="Generated by create next app" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <div className={styles.containerMain}>
                    {
                        width < 700 && orientation === 'portrait' ?
                            <VerticalPhoneMenu/>
                            :
                            <>
                                {
                                    width >= 700 && width <= 1050 ?
                                        <div className={styles.verticalTabContainer}>
                                            <VerticalTabMenu/>
                                        </div>
                                        :
                                        <div className={styles.verticalMenuContainer}>
                                            <VerticalAuthorMenu/>
                                        </div>
                                }
                            </>
                    }
                    <div className={styles.containerData}>
                        <SmHeaderDashboard title={'Mes livres'}/>
                            <div className={styles.errContainer + ' ' + anim.fadeIn}>
                                <ErrMsg click={() => router.back()}
                                        text={'Impossible de récupérer les données de vos livres, veuillez réessayer.'}/>
                            </div>
                            </div>
                </div>
            </div>
        )
    }

    else {

        return (
            <div className={styles.container}>
                <Head>
                    <title>Mes livres</title>
                    <meta name="description" content="Generated by create next app" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className={styles.containerMain}>
                    {
                        width < 700 && orientation === 'portrait' ?
                            <VerticalPhoneMenu/>
                            :
                            <>
                                {
                                    width >= 700 && width <= 1050 ?
                                        <div className={styles.verticalTabContainer}>
                                            <VerticalTabMenu/>
                                        </div>
                                        :
                                        <div className={styles.verticalMenuContainer}>
                                            <VerticalAuthorMenu/>
                                        </div>
                                }
                            </>

                    }

                    <div className={styles.containerData}>
                        <SmHeaderDashboard title={'Mes livres'}/>
                        {
                            err || errNb  &&
                            <div className={styles.errContainer + ' ' + anim.fadeIn}>
                                <ErrMsg textBtn={"Retour"} click={() => router.back()}
                                        text={'Impossible de récupérer les données de vos livres, veuillez réessayer.'}/>
                            </div>

                        }

                        {
                            books && booksData && !err && !errNb && books.length !== 0 &&
                            <div className={styles.listContainer} ref={divRef}>

                                <div className={styles.sortContainer}>
                                    <FilterBtn3 onclick={() => {
                                        activeFilter === 'recent' ? setActiveFilter('popular') : setActiveFilter('recent');
                                        activeFilter === 'recent' ? getBooksWithNewFilter('popular') : getBooksWithNewFilter('recent');
                                    }} filter={activeFilter}/>
                                    <p>{nbBooks} livres</p>
                                </div>
                                <div className={styles.list}>

                                    {
                                        books &&
                                        books.map((item, index) => {
                                            let isTop = false;
                                            if (item.top && nbBooks > 1) {
                                                isTop = true;
                                            }
                                            return (
                                                <Fragment key={item._id}>
                                                    {
                                                        width > 1300 &&
                                                        <CardBookDashboard
                                                            top={isTop}
                                                            nbChapter={item.nbChapter}
                                                            id={item._id}
                                                            img={item.img}
                                                            category={item.category}
                                                            title={item.title + ' ainsi que des autres livres'}
                                                            likes={item.likes}
                                                            date={item.date_creation}
                                                            nbView={item.stats.view}
                                                        />
                                                    }

                                                    {
                                                        width <= 1300 && width > 560 &&
                                                        <CardBookDashboardTab
                                                            top={isTop}
                                                            nbChapter={item.nbChapter}
                                                            id={item._id}
                                                            img={item.img}
                                                            category={item.category}
                                                            title={item.title + ' ainsi que des autres livres'}
                                                            likes={item.likes}
                                                            date={item.date_creation}
                                                            nbView={item.stats.view}
                                                        />
                                                    }

                                                    {
                                                        width <= 560 &&
                                                        <CardBookPhone
                                                            top={isTop}
                                                            nbChapter={item.nbChapter}
                                                            id={item._id}
                                                            img={item.img}
                                                            category={item.category}
                                                            title={item.title + ' ainsi que des autres livres'}
                                                            likes={item.likes}
                                                            date={item.date_creation}
                                                            nbView={item.stats.view}
                                                        />
                                                    }
                                                </Fragment>

                                            )
                                        })
                                    }

                                </div>


                                {
                                    nbBooks > books.length && !errNb &&
                                    <div className={styles.seeMoreContainer}>
                                        {
                                            seeMore && !loadingScroll &&
                                            <button className={styles.seeMoreText} onClick={() => getMoreBooks()}>
                                                Voir plus
                                            </button>
                                            // <TextSeeMore onclick={() => getMoreBooks()}/>
                                        }
                                        {
                                            loadingScroll &&
                                            <LoaderCommentary/>
                                        }
                                    </div>
                                }

                            </div>
                        }


                        {
                            books.length === 0 &&
                            hasNoBooks()
                        }
                    </div>

                </div>


            </div>
        )
    }


}

export default Books;