import {createContext, useState} from "react";

export const ResetDashboard = createContext(null);

function Context({children}) {

    const [reset,setReset] = useState();

    return (
        <ResetDashboard.Provider value={{reset,setReset}}>
            {children}
        </ResetDashboard.Provider>
    )

}

export default Context;