'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import * as fpixel from '@/utils/fpixel';

const FacebookPixelContent = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        fpixel.pageview();
    }, [pathname, searchParams]);

    if (!fpixel.FB_PIXEL_ID) return null;

    return (
        <>
            <Script
                id="fb-pixel"
                src="https://connect.facebook.net/en_US/fbevents.js"
                strategy="afterInteractive"
                onLoad={() => {
                    // Script is loaded, we can initialize it if needed, 
                    // though our utility already handles the shim.
                    if ((window as any).fbq) {
                        (window as any).fbq('init', fpixel.FB_PIXEL_ID);
                        (window as any).fbq('track', 'PageView');
                    }
                }}
            />
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src={`https://www.facebook.com/tr?id=${fpixel.FB_PIXEL_ID}&ev=PageView&noscript=1`}
                    alt=""
                />
            </noscript>
        </>
    );
};

export const FacebookPixel = () => {
    return (
        <Suspense fallback={null}>
            <FacebookPixelContent />
        </Suspense>
    );
};
