import {createContext, useContext, useState} from "react";

export const LangueContext = createContext(undefined, undefined);

const LangueProvider = ({ children }) => {
const [language,setLanguage] = useState("Francais");

const changeLanguage = () =>{
    if(language === 'Francais'){
        setLanguage("Espagnol")
    }

    else{
        setLanguage('Francais')
    }
}

return (
<LangueContext.Provider value={{language,changeLanguage}} >
    {children}
</LangueContext.Provider>
)

}

export default LangueProvider;