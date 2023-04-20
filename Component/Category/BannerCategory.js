import styles from '../../styles/Component/Category/BannerCategory.module.scss';

export const BannerCategory = ({category,presentation}) => {


    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {
                    category === 'Sf' ?
                        <h4 data-after={'Science-F'}>SF</h4> :
                        <h4 data-after={category}>{category}</h4>
                }
                <p>{/*Plongez dans l'action effrénée de nos histoires captivantes et embarquez pour des aventures
                    palpitantes remplies de combats épiques, de poursuites haletantes et de rebondissements inattendus
                    !*/} {presentation}</p>
            </div>
            <img className={styles.image} src={'/assets/category/banner/'+  category+ '.png'}/>
        </div>
    )
}