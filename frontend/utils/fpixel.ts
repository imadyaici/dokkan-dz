export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

// Initialize the fbq function immediately
if (typeof window !== 'undefined') {
    const fbqFunction = function (...args: any[]) {
        if ((window as any).fbq.callMethod) {
            (window as any).fbq.callMethod.apply((window as any).fbq, args);
        } else {
            (window as any).fbq.queue.push(args);
        }
    };

    if (!(window as any).fbq) {
        (window as any).fbq = fbqFunction;
        (window as any).fbq.push = fbqFunction;
        (window as any).fbq.loaded = true;
        (window as any).fbq.version = '2.0';
        (window as any).fbq.queue = [];
    }
}

export const pageview = () => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'PageView');
    }
};

// https://developers.facebook.com/docs/facebook-pixel/reference
export const event = (name: string, options = {}) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', name, options);
    }
};
