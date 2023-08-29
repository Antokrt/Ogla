import Script from "next/script";
import React, {useEffect} from "react";
import {pageview} from "../utils/gtagHelper";
import {usePathname, useSearchParams} from "next/dist/client/components/hooks-client";

export const GoogleAnalytics = () => {
    const id = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = pathname + searchParams
        pageview(id, url);

    }, [pathname, searchParams, id]);
    return (
        <>
            <Script strategy="afterInteractive"
                    src={`https://www.googletagmanager.com/gtag/js?id=${id}`}/>
            <Script id='google-analytics' strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('consent', 'default', {
                    'analytics_storage': 'denied'
                });
                
                gtag('config', '${id}', {
                    page_path: window.location.pathname,
                });
                `,
                    }}
            />
        </>
    )
}