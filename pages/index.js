import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Header from "../Component/Header";
import Banner from "../Component/Banner";
import Footer from "../Component/Footer";
import  {HotPostPhone, HotPost} from "../Component/Post/HotPost";
import { ChevronDoubleRightIcon } from "@heroicons/react/20/solid";
import PreviewHorizontalPostList from "../Component/Post/PreviewHorizontalPostList";
import CategoryHome from "../Component/CategoryHome";
import React, {useContext, useEffect, useState} from "react";
import {ConfigBearer, getAccessToken, GetBearerConfig, getConfigOfProtectedRoute} from "./api/utils/Config";
import {useSession} from "next-auth/react";
import {LoginModal} from "../Component/Modal/LoginModal";
import {GetTopBooksOnHomeApi} from "./api/book";
import {GetActiveMonthlyCateoryApi} from "./api/Category";
import {Capitalize} from "../utils/String";
import {useRouter} from "next/router";
import {BannerBecameWriter} from "../Component/BannerBecameWriter";
import { useDispatch, useSelector } from "react-redux";
import { activeOrDisable, selectLoginModalStatus, setActiveModalState } from "../store/slices/modalSlice";
import HeaderResponsive from '../Component/HeaderResponsive';
import MusicHome from '../Component/MusicHome';
import ScreenSize from "../utils/Size";
import {ReCAPTCHA} from "react-google-recaptcha";

export async function getServerSideProps() {
    const cat = await GetActiveMonthlyCateoryApi();
    let data;
    if (!cat.err) {
        data = await GetTopBooksOnHomeApi(cat.data.fCat, cat.data.sCat);
    }
    else {
        data.err = true;
        return {
            props: {
                err: true,
            }
        }
    }


    console.log(cat.data)
    return {
        props: {
            err: data.err,
            tops: data.tops,
            firstTopBooks: data.firstTop,
            secondTopBooks: data.secondTop,
            cat1: cat.data.fCat,
            cat2: cat.data.sCat
        }
    }
}


export default function Home({tops, firstTopBooks, secondTopBooks, cat1, cat2, err}) {

    const {data: session} = useSession();
    const [width, height] = ScreenSize();

    const router = useRouter();
useEffect(() => {
    console.log(width)
},[width])

    return (

        <div className={styles.container}>
            <Head>
                <title>Ogla - Une histoire d'écrivain</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div>
                <Header/>
            </div>
            <Banner/>
            <CategoryHome/>
            {
                !err && tops &&
                <div className={styles.hot}>
                    <div className={styles.headerHot}>
                        <h4>Populaires :</h4>
                        <h5 onClick={() => router.push({pathname:'/cat'})}>Tout voir <ChevronDoubleRightIcon/></h5>
                    </div>

                    <div className={styles.hotContainer}>
                        {
                            width > 450 ?
                                <>
                                    <HotPost className={styles.hotItem}
                                             id={tops[0]._id}
                                             slug={tops[0].slug}
                                             likes={tops[0].likes}
                                             top={true}
                                             title={tops[0].title} nbChapter={tops[0].nbChapters} author={tops[0].author_pseudo}
                                             img={tops[0].img} category={tops[0].category}
                                             description={tops[0].summary}
                                    />
                                    <HotPost
                                        className={styles.hotItem}
                                        id={tops[1]._id}
                                        slug={tops[1].slug}
                                        likes={tops[1].likes}
                                        top={false}
                                        title={tops[1].title} nbChapter={tops[1].nbChapters} author={tops[1].author_pseudo}
                                        img={tops[1].img} category={tops[1].category}
                                        description={tops[1].summary}
                                    />
                                </>


                                :
                                <>
                                    <HotPostPhone className={styles.hotItem}
                                                  id={tops[0]._id}
                                                  slug={tops[0].slug}
                                                  likes={tops[0].likes}
                                                  top={true}
                                                  title={tops[0].title} nbChapter={tops[0].nbChapters} author={tops[0].author_pseudo}
                                                  img={tops[0].img} category={tops[0].category}
                                                  description={tops[0].summary}
                                    />
                                    <HotPostPhone
                                        className={styles.hotItem}
                                        id={tops[1]._id}
                                        slug={tops[1].slug}
                                        likes={tops[1].likes}
                                        top={false}
                                        title={tops[1].title} nbChapter={tops[1].nbChapters} author={tops[1].author_pseudo}
                                        img={tops[1].img} category={tops[1].category}
                                        description={tops[1].summary}
                                    />
                                </>
                        }


                    </div>

                    <h7 className={styles.trendTitle}>Qu'est ce qu'on lit chez <strong>OGLA</strong> ?</h7>


                    <div className={styles.previewPostListContainer}>
                        <PreviewHorizontalPostList list={firstTopBooks} title={'Tendance '+ cat1}/>
                        <div className={styles.sep}>

                        </div>
                        <PreviewHorizontalPostList list={secondTopBooks} title={'Tendance ' +cat2}/>
                    </div>



                </div>
            }
            <BannerBecameWriter/>
            <MusicHome />

            <Footer></Footer>
        </div>
    )
}
