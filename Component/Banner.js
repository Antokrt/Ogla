import styles from "../styles/Component/Banner.module.scss";
import SimpleImageSlider from "react-simple-image-slider";
import {useState, useEffect} from "react";
import ScreenSize from "../utils/Size";
import useScrollbarSize from "react-scrollbar-size";
import Card from "./Card";
import LogCard from "./layouts/LogCard";
import {ChevronDoubleUpIcon} from "@heroicons/react/20/solid";
import axios from "axios";


export default function Banner() {

    useEffect(() => {
        axios.get("http://localhost:3000/api/test")
            .then((res) => console.log(res.data))
    })

    const [width, height] = ScreenSize();
    const slideImages = [
        {
            url: '/assets/diapo/image.png'
        },
        {
            url: '/assets/diapo/image2.png'
        }, {
            url: '/assets/diapo/image3.png'
        }
    ];
    const name = process.env.NEXT_PUBLIC_TEST;
    console.log(name)

    return (
        <div className={styles.container}>
            <h1>Cette semaine</h1>

            <div className={styles.cardContainer}>

                <div className={styles.containerImg}>
<img src={"/assets/livre7.jpg"}/>
                </div>
                <div className={styles.contentContainer}>

                    <div className={styles.hADescription}>
                        <div className={styles.thumbnail}>
                            <p># 1</p>
                        </div>
                        <div className={styles.header}>
                            <h4>Cette semaine sur OGLA : {name}</h4>
                            <h3>The walking dead</h3>
                            <p>Horreur | Huang Liok | 120 chapitres | 785 j'aime(s)</p>
                        </div>

                        <div className={styles.descriptionContainer}>
                            <p>
                                She was pushed to a mysterious man and choose to run away. 6 years later, she brought back a little boy! The little boy is looking for a perfect man for his little fairy mommy : tall, 6 packs muscles and richest man!
                                “Mommy, how is this man?” The little boy pointed his finger to his magnified version of himself.
                                Bo Qingyue : “You ran away with my genes for so long. it’s time to admit you were wrong!
                            </p>
                        </div>
                    </div>


                    <button>Découvrir</button>
                </div>

            </div>

         {/*       <SimpleImageSlider
                    width={width - useScrollbarSize().width}
                    height={height / 1.2}
                    images={slideImages}
                    showBullets={false}
                    showNavs={false}
                    autoPlay={true}
                    autoPlayDelay={7.0}
                />
*/}
        </div>
    )
}