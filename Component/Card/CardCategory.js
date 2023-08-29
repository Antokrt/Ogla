import styles from '../../styles/Component/Card/CategoryCard.module.scss';
import {Capitalize} from "../../utils/String";

const CardCategory = ({category}) => {
  return (
      <span className={styles.container + ' ' + styles[category]}>
          {Capitalize(category)}
      </span>
  )
}

export default CardCategory;