import styles from '../../styles/Component/Modal/PaymentModal.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {selectPaymentModalState, setActivePaymentModalState} from "../../store/slices/subscriptionPaymentSlice";

export const PaymentModal = () => {

    const seeModal = useSelector(selectPaymentModalState);
    const dispatch = useDispatch();

    if(seeModal){
        return (
            <div className={styles.container}>
                <h1>Payment</h1>
                <p onClick={() => dispatch(setActivePaymentModalState(false))}>Close</p>
            </div>
        )
    }

}