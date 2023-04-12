import styles from '../../styles/Component/Category/BannerCategory.module.scss';

export const BannerCategory = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h4>Drama</h4>
                <p>Plongez dans l'action effrénée de nos histoires captivantes et embarquez pour des aventures
                    palpitantes remplies de combats épiques, de poursuites haletantes et de rebondissements inattendus
                    !</p>
            </div>
            <img src={'/assets/category/banner/fantaisie.png'}/>
        </div>
    )
}