import {createContext, useContext, useMemo, useState} from "react";

export const LangueContext = createContext(undefined, undefined);

    function LangueProvider({children}) {
        const [langue, setLangue] = useState('fr');

        const value = useMemo(() => {
            return {
                langue,
                setLangue,
            };
        }, [langue]);

        return (
            <LangueContext.Provider value={value}>
                {children}
            </LangueContext.Provider>
        );
    }

    export default LangueProvider;