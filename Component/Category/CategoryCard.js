import styles from '../../styles/Component/Category/CategoryCard.module.scss';
import {useRouter} from "next/router";
import {ActionSvg} from "./Card/action";
import {HorrorSvg} from "./Card/horror";
import {HeartIcon} from "@heroicons/react/24/solid";
import {useEffect} from "react";
import {MedievalSvg} from "./Card/medieval";
import {SfSvg} from "./Card/sf";
import {DramaSvg} from "./Card/drama";
import {BoltIcon, BookOpenIcon, FireIcon} from "@heroicons/react/24/outline";
const CategoryCard = (props) =>{
    const router = useRouter();

    useEffect(() => console.log(props.category))

    const checkSvg = () => {
        switch (props.category){
            case 'action':
                return <ActionSvg
                />
            case 'horror':
                return <HorrorSvg/>

            case 'drama':
                return <DramaSvg/>

            case 'fantaisie':
                return <MedievalSvg/>

            case 'sf1':
                return <SfSvg/>
        }
    }
return (
    <div className={styles.container + ' ' + styles[props.category]}
         onClick={() => {
             if(props.title === 'Science Fiction'){
                 return router.push('/cat/sf');
             }
             router.push({
                 pathname: '/cat/' + props.title.toLowerCase()
             })
         }}
    >
        {
            checkSvg()
        }
        <h5>{props.title}</h5>
    </div>
)
}
export default CategoryCard;