import { CheckCircleIcon } from 'lucide-react';
import Link from 'next/link';

export default async function ThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    tracking?: string;
    deliveryPrice?: string;
    productPrice?: string;
    deliveryOption?: string;
  }>;
}) {
  const { lang } = await params;
  const { tracking, deliveryPrice, productPrice, deliveryOption } = await searchParams;
  const dictionary = (await import(`@/public/locales/${lang}/common.json`)).default;
  const isRTL = lang === 'ar';
  const { formatMoney } = await import('@/utils/utils');

  const totalPrice = Number(productPrice || 0) + Number(deliveryPrice || 0);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className={`text-center ${isRTL ? 'text-right' : ''}`}>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {dictionary.common.thankYou.title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">{dictionary.common.thankYou.subtitle}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className={`space-y-4 ${isRTL ? 'text-right' : ''}`}>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-sm font-medium text-gray-700">
                {dictionary.common.thankYou.orderNumber}:
              </p>
              <p className="text-lg font-semibold text-gray-900 font-mono">{tracking}</p>
            </div>

            <div className="space-y-2 py-2 border-b">
              {productPrice && (
                <div className="flex justify-between items-center text-sm">
                  <p className="text-gray-600">{dictionary.common.product.price}:</p>
                  <p className="font-medium text-gray-900">
                    {formatMoney(Number(productPrice), 'DZD', lang)}
                  </p>
                </div>
              )}
              {deliveryPrice && (
                <div className="flex justify-between items-center text-sm">
                  <p className="text-gray-600">
                    {dictionary.common.thankYou.deliveryPrice} (
                    {deliveryOption
                      ? dictionary.common.orderForm[deliveryOption] || deliveryOption
                      : ''}
                    ):
                  </p>
                  <p className="font-medium text-gray-900">
                    {formatMoney(Number(deliveryPrice), 'DZD', lang)}
                  </p>
                </div>
              )}
            </div>

            {totalPrice > 0 && (
              <div className="flex justify-between items-center py-2">
                <p className="text-base font-bold text-gray-900">
                  {dictionary.common.thankYou.totalPrice || 'Total'}:
                </p>
                <p className="text-xl font-bold text-blue-600">
                  {formatMoney(totalPrice, 'DZD', lang)}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600">{dictionary.common.thankYou.message}</p>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                {dictionary.common.product.description}:
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {dictionary.common.messages.success}</li>
                <li>• {dictionary.common.orderForm.orderSubmittedSuccess}</li>
                <li>• {dictionary.common.product.inStock}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Link
            href={`/${lang}`}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-center hover:bg-blue-700 transition-colors"
          >
            {dictionary.common.thankYou.backToHome}
          </Link>
          <Link
            href={`/${lang}/products`}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-center hover:bg-gray-300 transition-colors"
          >
            {dictionary.common.thankYou.continueShopping}
          </Link>
        </div>
      </div>
    </div>
  );
}
