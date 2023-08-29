import {CookieConsent} from "react-cookie-consent";

export const CookieAccept = () => {
    return (
        <CookieConsent
            buttonWrapperClasses={'btn-consent-container'}
            enableDeclineButton
            declineButtonText={'Je refuse'}
            location="bottom"
            buttonText="J'accepte"
            cookieName="cons_cookie"
            style={{
                display:'flex',
                justifyContent:'align-center',
                alignItems:'align-center',
                background: '#9844AD',
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                fontFamily: 'Poppins',
                fontSize: '12px'
            }}
            buttonStyle={{
                color: '#9844AD',
                fontFamily: 'Poppins',
                background: 'white',
                borderRadius: '4px',
                fontSize: '12px',
            }}
            declineButtonStyle={{
                color: '#9844AD',
                borderRadius: '4px',
                fontFamily: 'Poppins',
                background: 'white',
                fontSize: '12px',
            }}
            expires={450}
        >

            Nous souhaitons améliorer votre expérience sur Ogla et rendre votre visite encore plus agréable. <br/> En
            acceptant l'utilisation des cookies, vous nous permettez d'analyser les données et de vous offrir un service
            personnalisé.
        </CookieConsent>
    );
}