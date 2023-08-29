import styles from "../../styles/Component/Post/PreviewHorizontalPostList.module.scss"
import {Fragment, useState} from "react";
import PreviewHorizontalPost from "./PreviewHorizontalPost";
import {CheckIcon, ChevronDoubleRightIcon, ChevronRightIcon} from "@heroicons/react/24/outline";
import {TitleComponent} from "../layouts/Text";
import CardCategory from "../Card/CardCategory";

const PreviewHorizontalPostList = ({title,list}) => {

    return (
        <div className={styles.container}>
            <h7 is={'h7'}>{title}</h7>
            {
                list &&
                list.map((item, index) => {
                    return(
                        <Fragment key={item._id}>
                            <PreviewHorizontalPost id={item._id} slug={item.slug} src={item.img} rank={index + 1} nbChapter={item.nbChapters} title={item.title}
                                                   category={item.category} author={item.author_pseudo} nbLikes={item.likes}/>
                        </Fragment>
                              )

                })
            }
        </div>
    )

}

export default PreviewHorizontalPostList