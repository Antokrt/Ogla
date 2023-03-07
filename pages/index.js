import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Header from "../Component/Header";
import Banner from "../Component/Banner";
import Footer from "../Component/Footer";
import HotPost from "../Component/Post/HotPost";
import {ChevronDoubleRightIcon} from "@heroicons/react/20/solid";
import PreviewHorizontalPostList from "../Component/Post/PreviewHorizontalPostList";
import CategoryHome from "../Component/CategoryHome";
import {useEffect, useState} from "react";
import {ConfigBearer, getAccessToken, GetBearerConfig, getConfigOfProtectedRoute} from "./api/utils/Config";
import {useSession} from "next-auth/react";
import {EventSource } from 'event-source-polyfill'
import axios from "axios";
import {instance} from "../service/config/Interceptor";
import {fetchEventSource} from "@microsoft/fetch-event-source";

/*export async function getServerSideProps({context, req, res}){
    const config = await getConfigOfProtectedRoute(req);
    const bookData = await fetch('http://localhost:3008/book/', config);
    const bookErrData = bookData.ok ? false : bookData.status;
    const json = await bookData.json();


    return {
        props:{
            err: {
                books:bookErrData
            },
            books:json
        }
    }
}*/



export default function Home({err,books}) {

    const {data:session} = useSession();

    return (
        <div className={styles.container}>
            <Head>
                <title>Ogla - Une histoire d'écrivain</title>
                <meta name="description" content="Generated by create next app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <div
               /** style={{
                position: "fixed",
                top: 0,
                zIndex: 2,
                width: "100%"
            }*/>
                <Header/>

            </div>
            <Banner/>
<CategoryHome/>
            <div className={styles.hot}>
                <div className={styles.headerHot}>

                    <h4>Populaires :</h4>
                    <h5>Tout voir <ChevronDoubleRightIcon/></h5>
                </div>
                <div className={styles.hotContainer}>
                    <HotPost className={styles.hotItem}
                             likes={234}
                             top={true}
                             title={"Livre 1"} nbChapter={35} author={"JimmyS"}
                             img={"/assets/livre7.jpg"} category={"Action"}
                             description={"Fu Jiu appears to be a normal lad in high school on the surface. But in fact, she (Yes! She!) is the hacker, Z, a villain-terminator in the online world of an alternate world. Having reincarnated into the body of a woman and being forced to disguise herself as a young man, she reigns over the game world, fights for justice, and puts a spell on all the girls around with her innate charm. However, her flirting comes across as gay to the rich Almighty Qin and his inner circle. Over time, the Almighty Qin falls for him… her. Has he turned gay for him… her? Now, that's confusing!"}
                    />
                    <HotPost className={styles.hotItem}
                             likes={9784}
                             title={"Livre 2"} nbChapter={205} author={"ThomasK"}
                             img={"/assets/livre1.jpg"} category={"Horreur"}
                             description={"She was pushed to a mysterious man and choose to run away. 6 years later, she brought back a little boy! The little boy is looking for a perfect man for his little fairy mommy : tall, 6 packs muscles and richest man!\n" +
                                 "“Mommy, how is this man?” The little boy pointed his finger to his magnified version of himself.\n" +
                                 "Bo Qingyue : “You ran away with my genes for so long. it’s time to admit you were wrong!"}
                    />

                </div>

                <div className={styles.previewPostListContainer}>
                    <PreviewHorizontalPostList title={"Populaire Horreur"} type={"Horreur"}/>
                    <PreviewHorizontalPostList title={"Populaire Horreur"} type={"Horreur"}/>


                </div>

            </div>
            <Footer></Footer>
        </div>
    )
}
