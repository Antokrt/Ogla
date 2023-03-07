import styles from "../../styles/Component/Post/PreviewHorizontalPostList.module.scss"
import {useState} from "react";
import PreviewHorizontalPost from "./PreviewHorizontalPost";
import {CheckIcon, ChevronDoubleRightIcon, ChevronRightIcon} from "@heroicons/react/24/outline";
import {TitleComponent} from "../layouts/Text";

const PreviewHorizontalPostList = ({title,type}) => {
    const [list, setList] = useState([
        {
            title: "Livre 1",
            author: "Lorem",
            like: 237,
            category: "Drama",
            nbChapter: 679,
            src: "/assets/livre2.jpg"
        },
        {
            title: "Livre 2",
            author: "LauraB",
            like: 2137,
            category: "Comédie",
            nbChapter: 69,
            src: "/assets/livre1.jpg"
        },
        {
            title: "Livre 3",
            author: "Lorem",
            like: 332,
            category: "Action",
            nbChapter: 12,
            src: "/assets/livre3.jpg"
        }
    ])
    return (
        <div className={styles.container}>
            <TitleComponent title={title}/>
            {
                list.map((item, index) => {
                    return(
                        <PreviewHorizontalPost src={item.src} rank={index + 1} nbChapter={item.nbChapter} title={item.title}
                                               category={item.category} author={item.author} nbLikes={item.like}/>
                        )

                })
            }
        </div>
    )

}

export default PreviewHorizontalPostList