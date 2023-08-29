import styles from "../styles/Component/BannerOnPost.module.scss"

const BannerOnPost = (props) =>{
return (
    <div className={styles.container}
    style={{
        backgroundImage:"url("+ props.imgSrc+")"
    }}
    >
        <h2>{props.category}</h2>
    </div>
)
}

export default BannerOnPost;