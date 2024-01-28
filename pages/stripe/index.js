import {GetIntentService} from "../../service/Payment/PaymentsService";
import {useState} from "react";
import {loadStripe} from "@stripe/stripe-js";
import {Elements, PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";
import success from "../email-verification/success";
import {useSession} from "next-auth/react";

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsProcessing(true);

        const { error,paymentIntent, } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/`,
            },
            redirect:'if_required'
        });

        if (error) {
            alert('Error of payment!')
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            alert('Payment success !')
        } else {
            console.log("Payment failed");
            // handleOther();
        }



        setIsProcessing(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <button disabled={isProcessing || !stripe || !elements} id="submit">
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
            </button>
            {/* Show any error or success messages */}
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
}

const Stripe = () => {

    const [intent,setIntent] = useState(null);
    const [clientSecret,setClientSecret] = useState(null);
    const pk = 'pk_test_51NNdxbJuETVotPlVeK3txdq5KhGFIgCEZLcjfmOkUNxcWmQ2hGcGHI8kZEgDshKHvwEUGwpj043jb9HlK3zfQMDf00tDdZLo0R';
    const stripePromise = loadStripe(pk);
    const {data: session} = useSession();

    const getIntent = async () => {
        if(!session){
           return;
        }
        const data = {
            authorId:'649ee3b35bc74f49078c7113',
            month_duration:3
        }
      const newIntent = await GetIntentService(data);
      setClientSecret(newIntent.client_secret);
      setIntent(newIntent);
    }

    const success = () => {
        return alert('Payment success !')
    }

    return (
        <div style={{
            height:'100vh',
            width:'100vw',
            display:'flex',
            justifyContent:'center',
            flexDirection:'column',
            alignItems:'center',
            gap:'20px'
        }}>
            <h1 style={{
                fontSize:'40px'
            }}>Stripe Test</h1>

<button onClick={() => getIntent()}>Get intent !</button>
            {
                intent &&
                <Elements stripe={stripePromise} options={{clientSecret}}>
<CheckoutForm/>
                </Elements>
            }

            {
                intent &&
                <p>{intent.client_secret}</p>
            }
        </div>
    )
}

export default Stripe;