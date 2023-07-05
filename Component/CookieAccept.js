import {CookieConsent} from "react-cookie-consent";
import {useEffect, useState} from "react";
import {getLocalStorage, setLocalStorage} from "../utils/storageHelper";

'use client'
export const CookieAccept = () => {

    const [cookieConsent, setCookieConsent] = useState(false);


    useEffect(() => {
        const storedCookieConsent = getLocalStorage("cookie_consent", null)
        setCookieConsent(storedCookieConsent)
    }, [setCookieConsent])

    useEffect(() => {
        const newValue = cookieConsent ? 'granted' : 'denied'

        if(typeof window !== 'undefined'){
            window.gtag("consent", 'update', {
                'analytics_storage': newValue
            });
        }


        setLocalStorage("cookie_consent", cookieConsent)

        //For Testing
        console.log("Cookie Consent: ", cookieConsent)

    }, [cookieConsent]);


    return (
        <CookieConsent
            onAccept={() => setCookieConsent(true)}
            onDecline={() => setCookieConsent(false)}
            enableDeclineButton
            flipButtons
            location="bottom"
            buttonText="I understand"
            cookieName="YourCoockieName"
            style={{ background: 'blue' }}
            buttonStyle={{
                color: '#000',
                fontSize: '15px',
            }}
            declineButtonStyle={{
                margin: '10px 10px 10px 0',
            }}
            expires={450}
        >
            This website uses cookies
        </CookieConsent>
    );
}