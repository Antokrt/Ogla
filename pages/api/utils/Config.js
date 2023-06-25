import {getToken} from "next-auth/jwt";


export const getConfigOfProtectedRoute = async (req) => {
    const accessToken = await getAccessToken(req);
    const config = getBearerConfig(accessToken);
    return config;
}

const getBearerConfig = (accessToken) => {
    if(!accessToken || accessToken === ''){
        return null;
    }
   const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };
    return config;
}

const getAccessToken = async (req) => {
  const token = await getToken({
      req:req,
      secret:process.env.NEXT_AUTH_SECRET
  })
    return token?.accessToken;
}

const getRefreshToken = async (req) => {
    const token = await getToken({
        req:req,
        secret:process.env.NEXT_AUTH_SECRET
    })

    return token.refreshToken;
}

