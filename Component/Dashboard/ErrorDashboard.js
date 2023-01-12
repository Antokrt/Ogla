import styles from '../../styles/Component/Dashboard/ErrorDashboard.module.scss';

const ErrorDashboard = ({img, title, subTitle, btn, link}) => {
return (
    <div className={styles.container}>
        <img src={img}/>
        <h5>{title}</h5>
        <p>{subTitle}</p>
        <button onClick={link}>{btn}</button>
    </div>
)
}
export default ErrorDashboard;