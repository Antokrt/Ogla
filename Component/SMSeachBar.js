import styles from "../styles/Component/SMSearchbar.module.scss";

const SMSeachBar = (props) => {
    return (
        <form className={styles.container} style={{
            width:props.width+"%"
        }}>
            <input type="text" placeholder="Cherchez un livre"/>
        </form>

    )
}

export default SMSeachBar;