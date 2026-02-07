'use client';

import { useEffect } from 'react';
import * as fpixel from '@/utils/fpixel';

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
        fpixel.event('ViewContent', {
            content_ids: [product.id],
            content_name: product.name,
            content_type: 'product',
            value: product.price,
            currency: 'DZD',
        });
    }, [product]);

    return null;
};
