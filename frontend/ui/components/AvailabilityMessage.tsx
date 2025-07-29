import { XIcon } from "lucide-react";

type Props = {
  isAvailable: boolean;
  lang: string;
};

const pClasses = "ml-1 text-sm font-semibold text-neutral-500";

export const AvailabilityMessage = async ({
  isAvailable,
  lang,
}: Props) => {
  const isRTL = lang === 'ar';
  const dictionary = (await import(`@/public/locales/${lang}/common.json`)).default;
  const messages = dictionary.common.product;
  
  if (!isAvailable) {
    return (
      <div className={`mt-6 flex items-center ${isRTL ? 'justify-end' : ''}`}>
        <XIcon
          className="h-5 w-5 flex-shrink-0 text-neutral-50"
          aria-hidden="true"
        />
        <p className={`${pClasses} ${isRTL ? 'text-right font-arabic' : ''}`}>
          {messages.outOfStock}
        </p>
      </div>
    );
  }
  return (
    <div className={`mt-6 flex items-center ${isRTL ? 'justify-end' : ''}`}>
      <p className={`${pClasses} ${isRTL ? 'text-right font-arabic' : ''}`}>
        {messages.inStock}
      </p>
    </div>
  );
};