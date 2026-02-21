import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

type Props = {
  lang: string;
  translations: {
    cod: string;
    fastShipping: string;
    returns: string;
  };
};

export function TrustBadges({ lang, translations }: Props) {
  const isRTL = lang === 'ar';

  const badges = [
    { icon: ShieldCheck, label: translations.cod },
    { icon: Truck, label: translations.fastShipping },
    { icon: RotateCcw, label: translations.returns },
  ];

  return (
    <div className="mt-2 grid grid-cols-1 gap-1 border-t border-b border-neutral-100 py-3 sm:grid-cols-3">
      {badges.map((badge, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <badge.icon className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-medium text-neutral-600">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
