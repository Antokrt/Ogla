import styles from '../../styles/Component/Category/CategoryCard.module.scss';
import {useRouter} from "next/router";
const CategoryCard = (props) =>{
    const router = useRouter();
return (
    <div className={styles.container}
         onClick={() => {
             if(props.title === 'Science Fiction'){
                 return router.push('/cat/sf');
             }
             router.push({
                 pathname: '/cat/' + props.title.toLowerCase()
             })
         }}
    >
        <img src={'assets/category/'+ props.category + '.png'}/>
        <h5>{props.title}</h5>
    </div>
)
}
export default CategoryCard;