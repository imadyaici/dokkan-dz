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
      <div className={`mt-6 flex items-center ${isRTL ? 'justify-end gap-2' : 'gap-2'}`}>
        <XIcon
          className="h-5 w-5 flex-shrink-0 text-red-500"
          aria-hidden="true"
        />
        <p className={`${pClasses} ${isRTL ? 'text-right' : ''} text-red-500`}>
          {messages.outOfStock}
        </p>
      </div>
    );
  }
  return (
    <div className={`mt-2 flex flex-col gap-1 ${isRTL ? 'items-end' : 'items-start'}`}>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <p className="text-sm font-semibold text-green-600">
          {messages.inStock}
        </p>
      </div>
      <p className="text-xs text-neutral-500">
        {messages.readyToShip} • {messages.onlyFewLeft}
      </p>
    </div>
  );
};