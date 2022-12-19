import styles from '../../styles/Component/Category/CategoryCard.module.scss';
const CategoryCard = (props) =>{
return (
    <div className={styles.container}
    >
        <img src={'assets/category/'+ props.category + '.png'}/>
        <h5>{props.title}</h5>
    </div>
)
}
export default CategoryCard;