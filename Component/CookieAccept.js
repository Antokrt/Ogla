import {CookieConsent} from "react-cookie-consent";

export const CookieAccept = () => {
    return (
        <CookieConsent
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