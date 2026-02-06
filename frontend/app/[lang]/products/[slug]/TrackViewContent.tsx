'use client';

import { useEffect } from 'react';

type Props = {
    product: {
        id: string;
        name: string;
        price: number;
        currency: string;
    };
};

export const TrackViewContent = ({ product }: Props) => {
    useEffect(() => {
        if ((window as any).fbq) {
            (window as any).fbq('track', 'ViewContent', {
                content_ids: [product.id],
                content_name: product.name,
                content_type: 'product',
                value: product.price,
                currency: product.currency,
            });
        }
    }, [product]);

    return null;
};
