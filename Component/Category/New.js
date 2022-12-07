import styles from "../../styles/Component/Category/News.module.scss";

const NewFeatured = ({title,description}) => {
    return(
        <div className={styles.container}>
            <h5>Cette semaine</h5>
            <div className={styles.item}>
                <div className={styles.containerImg}>
                    <img src={"assets/livre4.jpg"}/>
                </div>

                <div className={styles.containerContent}>
                    <h6>{title}</h6>
                    <p className={styles.description}>{description}</p>
                    <div className={styles.statsContainer}>
<div className={styles.authorChapter}>
<p className={styles.author}>Julio Caracass</p>
    <p className={styles.category}>Drama</p>
</div>
                        <button>Découvrir</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewFeatured;