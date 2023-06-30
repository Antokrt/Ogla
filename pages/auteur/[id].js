import styles from '../../styles/Pages/User/ByUser.module.scss';

import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import Header from "../../Component/Header";

import Instagram from "../../Component/layouts/Icons/Social/instagram";
import Facebook from "../../Component/layouts/Icons/Social/facebook";
import Twitter from "../../Component/layouts/Icons/Social/twitter";
import {GetAuthorProfilAPI} from "../api/Author";
import {FormatDateNb} from "../../utils/Date";
import {GetBooksByAuthorService} from "../../service/Author";
import Footer from "../../Component/Footer";
import {Snippet} from "../../Component/Snippet";
import {ListCard} from "../../Component/Card/ListCard";
import {LoaderCommentary} from "../../Component/layouts/Loader";
import ScreenSize from "../../utils/Size";
import {
    ChevronDoubleUpIcon,
    ClockIcon,
    HeartIcon as HeartSolid,
    HandThumbUpIcon,
    HeartIcon
} from "@heroicons/react/24/solid";
import {HeartIcon as HeartOutline} from "@heroicons/react/24/outline";
import {Capitalize} from "../../utils/String";
import {toastDisplayError} from "../../utils/Toastify";
import {useSession} from "next-auth/react";
import {LikeAuthorService} from "../../service/Like/LikeService";
import {setActiveModalState} from "../../store/slices/modalSlice";
import {useDispatch} from "react-redux";
import {SendNotifService} from "../../service/Notifications/NotificationsService";
import {ErrMsg} from "../../Component/ErrMsg";
import {GetDefaultUserImgWhenError} from "../../utils/ImageUtils";
import {FormatCount} from "../../utils/NbUtils";
import Head from "next/head";
import {HotPost, HotPostPhone} from "../../Component/Post/HotPost";
import {TextSeeMore} from "../../Component/layouts/Btn/ActionBtn";
import {GetTopUtils} from "../../utils/TopUtils";
import {HeaderMain} from "../../Component/HeaderMain";
import {HeaderMainResponsive} from "../../Component/HeaderMainResponsive";


export async function getServerSideProps({params,req}) {

    const pseudo = params.id;
    const profil = await GetAuthorProfilAPI(pseudo,req);


    if(!profil.errProfil && !profil.errBook){
        return {
            props: {
                key:pseudo,
                profilData: profil.profil,
                booksData: profil.books,
                topBookData:profil.profil.topBook,
                hasLikeData: profil.hasLike,
                errProfil: profil.errProfil,
                errBooks: profil.errBook,
            }
        }
    }

    else {
        return {
            props: {
                key:pseudo,
                profilData: null,
                booksData: null,
                topBookData: null,
                hasLikeData: null,
                errProfil: profil.errProfil,
                errBooks: profil.errBook,
            }
        }
    }


}

const AuthorProfil = ({profilData, booksData, topBookData,  hasLikeData,errProfil, errBooks}) => {
    const [profilAuthor, setProfilAuthor] = useState(profilData);
    const [likes,setLikes] = useState(profilAuthor?.author?.likes);
    const social = profilAuthor?.author?.social;
    const router = useRouter();
    const [page, setPage] = useState(2);
    const [activeFilter, setActiveFilter] = useState('popular');
    const [canSeeMore, setCanSeeMore] = useState(true);
    const [canSeeMoreRecent, setCanSeeMoreRecent] = useState(true);
    const [loading,setLoading] = useState(false);
    const [canSeeMorePopular, setCanSeeMorePopular] = useState(true);
    const [pagePopular, setPagePopular] = useState(2);
    const [hasLike,setHasLike] = useState(hasLikeData);
    const [pageRecent, setPageRecent] = useState(1);
    const [popular, setPopular] = useState(booksData);
    const [line,setLine] = useState(12);
    const [recent, setRecent] = useState([]);
    const [maxSize, setMaxSize] = useState(600);
    const [width, height] = ScreenSize();
    const {data:session} = useSession();
    const dispatch = useDispatch();



    const fetchRecentBooks = () => {
        setLoading(true)
        GetBooksByAuthorService(profilAuthor.pseudo, 'recent', 1)
            .then((res) => {
                if (res.length !== 0) {
                    setRecent(res)
                    setPageRecent(2);
                } else {
                    setCanSeeMoreRecent(false);
                }
            })
            .then(() => setLoading(false))
            .catch((err) => {
                setLoading(false);
                setCanSeeMoreRecent(false);
            });
    }


    const fetchMorePopularBooks = () => {
        setLoading(true);
        GetBooksByAuthorService(profilAuthor.pseudo, 'popular', pagePopular)
            .then((res) => {
                if (res.length !== 0) {
                    setPopular(prevState => [...prevState, ...res]);
                    setPagePopular(pagePopular + 1);
                } else {
                    setCanSeeMorePopular(false);
                }
            })
            .then(() => setLoading(false))
            .catch((err) => {
                setLoading(false);
                setCanSeeMorePopular(false);
            });
    }

    const fetchMoreRecentBooks = () => {
        setLoading(true);
        GetBooksByAuthorService(profilAuthor.pseudo, 'recent', pageRecent)
            .then((res) => {
                if (res.length !== 0) {
                    setRecent(prevState => [...prevState, ...res]);
                    setPageRecent(pageRecent + 1);
                } else {
                    setCanSeeMoreRecent(false);
                }
            })
            .then(() => setLoading(false))
            .catch((err) => {
                setLoading(false);
                setCanSeeMoreRecent(false)
            });
    }

    useEffect(() => {
        if(width < 1300){
            setMaxSize(1000);
            setLine(8)
        }
    },[width])

    const likeAuthor = () => {
    if(session){
        LikeAuthorService(profilData._id)
            .then(() => setHasLike(!hasLike))
            .then(() => {
                if(hasLike){
                    setLikes(likes - 1);
                }
                else {
                    setLikes(likes + 1);
                    SendNotifService(profilAuthor._id, 3, profilAuthor._id, "null")
                }
            })
            .catch(() => toastDisplayError("Impossible d'aimer ce profil !"))
    }
    else {
        dispatch(setActiveModalState(true));
    }
    }


    return (
        <div className={styles.container}>
            <Head>
                <title>{'Ogla - ' + (!errProfil && !errBooks ? Capitalize(profilData?.pseudo) : 'Erreur')}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {
                width > 950 ?
                    <HeaderMain/> :
                    <div style={{width:'100%'}}>
                        <HeaderMainResponsive/>
                    </div>
            }

            {
                errProfil || errBooks &&
                <div className={styles.err}>
                <ErrMsg text={'Impossible de récupérer ce profil !'}/>
                </div>
            }
            {
                profilData && !errProfil &&
                <>
                    <div className={styles.containerF}>

                        <div className={styles.chapterContainer}>
                            <div className={styles.infoContainer}>
                                <div className={styles.pseudo_date}>
                                    <div className={styles.imgPseudo}>
                                        <img referrerPolicy={'no-referrer'} src={profilData?.img} onError={(e) => e.target.src = GetDefaultUserImgWhenError()} />
                                        <div>
                                            <h3>{profilAuthor?.pseudo}</h3>
                                            <p>{FormatCount(likes)} <span>j&apos;aimes </span></p>
                                        </div>
                                    </div>

                                    {
                                        hasLike ?
                                            <button onClick={() => {
                                                likeAuthor();
                                            }}>J&apos;aime <HeartSolid/></button> :
                                            <button onClick={() => likeAuthor()}>J&apos;aime <HeartOutline/></button>
                                    }
                                </div>

                                <div className={styles.lab}>
                                    <h6>Écrivain <span>OGLA</span> </h6>
                                    {
                                        profilAuthor?.author.became_author &&
                                        <p>Devenu auteur le {FormatDateNb(profilAuthor?.author.became_author)}</p>
                                    }
                                </div>

                                <div className={styles.social}>
                                    {
                                        social?.instagram && social?.instagram !== '' &&
                                        <a className={styles.itemSocial} href={'https://www.instagram.com/'+social?.instagram.slice(1,social?.instagram.length)} rel={'noreferrer'} target={'_blank'}>
                                            <Instagram/>
                                            <span><span className={styles.dat}>@</span>{Capitalize(social?.instagram.slice(1,social?.instagram.length))}</span>
                                        </a>
                                    }

                                    {
                                        social && social.twitter && social.twitter !== '' &&
                                        <a className={styles.itemSocial} href={'https://twitter.com/'+ social.twitter} rel={'noreferrer'} target={'_blank'}>
                                            <Twitter/>
                                            <span><span className={styles.dat}>@</span>{Capitalize(social.twitter.slice(1,social.twitter.length))}</span>
                                        </a>
                                    }
                                    {
                                      social && social.facebook && social.facebook !== '' &&
                                        <a className={styles.itemSocial} href={social.facebook} rel={'noreferrer'} target={'_blank'}>
                                            <Facebook/>
                                            <span>Facebook</span>
                                        </a>
                                    }

                                </div>

                                {
                                    profilAuthor.author.description !== '' &&
                                    <div className={styles.description}>
                                        <div className={styles.containerD}>
                                            <Snippet line={line} maxSize={maxSize} content={profilAuthor.author.description}/>
                                        </div>
                                    </div>
                                }

                            </div>
                        </div>

                    </div>

                    {
                        profilAuthor.nbBooks <= 0 ?
                            <div className={styles.empty}>
                                <img src={'/assets/jim/smile8.png'}/>
                                <p><span>{Capitalize(profilAuthor.pseudo)}</span> n&apos;a pas encore écrit de livres !</p>
                            </div>
                            :
                            <>
                                {
                                    topBookData &&
                                    <div className={styles.hotContainer}>
                                        {
                                            width > 530 ?
                                                <HotPost className={styles.hotItem}
                                                         likes={topBookData.likes}
                                                         title={topBookData.title} author={topBookData.author_pseudo}
                                                         img={topBookData.img} category={topBookData.category}
                                                         nbChapter={topBookData.nbChapters}
                                                         slug={topBookData.slug}
                                                         id={topBookData._id}
                                                         top={true}
                                                         description={topBookData.summary}
                                                />
                                                :
                                                <>
                                                    <HotPostPhone className={styles.hotItem}
                                                                  likes={topBookData.likes}
                                                                  title={topBookData.title} author={topBookData.author_pseudo}
                                                                  img={topBookData.img} category={topBookData.category}
                                                                  nbChapter={topBookData.nbChapters}
                                                                  slug={topBookData.slug}
                                                                  id={topBookData._id}
                                                                  top={true}
                                                                  description={topBookData.summary}
                                                    />
                                                </>

                                        }

                                    </div>
                                }
                                <div className={styles.containerS}>

                                    <div className={styles.sortContainer}>
                                        <div>
                                            <button
                                                className={activeFilter === 'popular' && styles.activeBtn}
                                                onClick={() => {
                                                    if (activeFilter !== 'popular') {
                                                        setActiveFilter('popular');
                                                    }
                                                }}>Populaires
                                            </button>
                                            <button
                                                className={activeFilter === 'recent' && styles.activeBtn}
                                                onClick={() => {
                                                    if (activeFilter !== 'recent') {
                                                        if (recent.length === 0) {
                                                            fetchRecentBooks();
                                                        }
                                                        setActiveFilter('recent');
                                                        setPage(2);
                                                    }
                                                }}>Récents
                                            </button>
                                        </div>
                                    </div>
                                    {
                                        !errBooks &&
                                        <>
                                            {
                                                activeFilter === 'recent' && recent.length !== 0 &&
                                                <ListCard topId={GetTopUtils(popular)} books={recent}/>
                                            }
                                            {
                                                activeFilter === 'popular' && popular.length !== 0 &&
                                                <ListCard topId={GetTopUtils(popular)} books={popular}/>
                                            }
                                            <div className={styles.seeMore}>

                                                {
                                                    loading &&
                                                    <LoaderCommentary/>
                                                }

                                                {
                                                    profilAuthor.nbBooks > 10 &&
                                                    <>
                                                        {
                                                            activeFilter === 'popular' && canSeeMorePopular && !loading &&
                                                            <TextSeeMore onclick={() => fetchMorePopularBooks()}></TextSeeMore>
                                                        }

                                                        {
                                                            activeFilter === 'recent' && canSeeMoreRecent && !loading &&
                                                            <TextSeeMore onclick={() => fetchMoreRecentBooks()}></TextSeeMore>
                                                        }
                                                    </>
                                                }


                                            </div>


                                        </>
                                    }

                                </div>
                            </>



                    }

                </>
            }

            <Footer/>
        </div>
    )
}

export default AuthorProfil;

