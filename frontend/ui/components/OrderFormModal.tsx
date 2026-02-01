"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Formik } from "formik";
import {
  Combobox,
  Input,
  Fieldset,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { toast } from "sonner";
import { usePhoneNumberValidator } from "@/utils/phoneNumber";
import { ProductQueryResult } from "@/sanity.types";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

type OrderFormTranslations = {
  [key: string]: string;
};

type Props = {
  onClose: () => void;
  product: ProductQueryResult;
  quantity: number;
  translations: OrderFormTranslations;
  messages: {
    loading: string;
    selectWilayaFirst: string;
    [key: string]: string;
  };
};

export const OrderFormModal = ({
  onClose,
  product,
  quantity,
  translations,
  messages,
}: Props) => {
  const isValidPhoneNumber = usePhoneNumberValidator();
  const lang = useCurrentLang();
  const isRTL = lang === "ar";
  const router = useRouter();

  // State for dynamic data
  interface Wilaya {
    code: number;
    name_lt: string; // Latin name
    name_ar: string; // Arabic name
  }

  interface Commune {
    id: number;
    wilaya: number; // Wilaya ID
    name: string; // Commune name
  }

  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [loadingWilayas, setLoadingWilayas] = useState(false);
  const [loadingCommunes, setLoadingCommunes] = useState(false);
  const communesCache = useRef<Record<number, Commune[]>>({});

  const BASE_URL = process.env.NEXT_PUBLIC_MAYSTRO_BASE_URL;

  // Fetch Wilayas on mount
  useEffect(() => {
    const fetchWilayas = async () => {
      if (!BASE_URL) return;
      setLoadingWilayas(true);
      try {
        const res = await fetch(`${BASE_URL}/base/wilayas/`);
        if (res.ok) {
          const data: Wilaya[] = await res.json();
          // Deduplicate wilayas by code to avoid key collisions
          const uniqueWilayas = data.filter(
            (w, index, self) => index === self.findIndex((t) => t.code === w.code)
          );
          setWilayas(uniqueWilayas);
        }
      } catch (error) {
        console.error("Failed to fetch wilayas:", error);
      } finally {
        setLoadingWilayas(false);
      }
    };
    fetchWilayas();
  }, [BASE_URL]);

  // Handle Wilaya change to fetch Communes
  const handleWilayaChange = async (wilayaId: number, setFieldValue: any) => {
    setFieldValue("wilaya", wilayaId);
    setFieldValue("city", ""); // Reset city when wilaya changes

    if (communesCache.current[wilayaId]) {
      setCommunes(communesCache.current[wilayaId]);
      return;
    }

    if (!BASE_URL) return;
    setLoadingCommunes(true);
    try {
      const res = await fetch(`${BASE_URL}/base/communes/?wilaya=${wilayaId}`);
      if (res.ok) {
        const data = await res.json();
        communesCache.current[wilayaId] = data;
        setCommunes(data);
      }
    } catch (error) {
      console.error("Failed to fetch communes:", error);
    } finally {
      setLoadingCommunes(false);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="relative z-50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          className={`min-w-screen md:min-w-md max-w-lg rounded-lg bg-white p-8 shadow-lg ${isRTL ? "text-right" : ""}`}
        >
          <DialogTitle className="mb-6 text-xl font-semibold">
            {translations.title}
          </DialogTitle>
          <Formik
            initialValues={{ name: "", address: "", phone: "", wilaya: "", city: "" }}
            validate={(values) => {
              const errors: Record<string, string> = {};
              const phoneError = isValidPhoneNumber(values.phone);
              if (phoneError) errors.phone = phoneError;
              return errors;
            }}
            onSubmit={async (values) => {
              const res = await fetch("/api/order", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...values, product, quantity }),
              });

              if (res.ok) {
                const data = await res.json();
                toast.success(translations.orderSubmittedSuccess, {
                  position: "top-center",
                });
                onClose();
                router.push(
                  `/${lang}/thank-you?${data.tracking ? `tracking=${data.tracking}` : ""}${data.delivery_price ? `&deliveryPrice=${data.delivery_price}` : ""
                  }`,
                );
              } else {
                toast.error(translations.orderSubmittedError, {
                  position: "top-center",
                });
                onClose();
              }
            }}
          >
            {({
              values,
              handleChange,
              setFieldValue,
              errors,
              touched,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <Fieldset className="space-y-4" disabled={isSubmitting}>
                  <div>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs text-neutral-700">
                        {translations.name}
                      </span>
                      <Input
                        name="name"
                        required
                        value={values.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-neutral-300 px-2 py-2 shadow-sm focus:border-neutral-300 focus:ring focus:ring-neutral-200 focus:ring-opacity-50 disabled:bg-gray-100 placeholder:text-neutral-400"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs text-neutral-700">
                        {translations.address}
                      </span>
                      <Input
                        name="address"
                        required
                        value={values.address}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-neutral-300 px-2 py-2 shadow-sm focus:border-neutral-300 focus:ring focus:ring-neutral-200 focus:ring-opacity-50 disabled:bg-gray-100 placeholder:text-neutral-400"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs text-neutral-700">
                        {translations.phone}
                      </span>
                      <Input
                        name="phone"
                        required
                        value={values.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-neutral-300 px-2 py-2 shadow-sm focus:border-neutral-300 focus:ring focus:ring-neutral-200 focus:ring-opacity-50 disabled:bg-gray-100 placeholder:text-neutral-400"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs text-neutral-700">Wilaya</span>
                      <Combobox
                        immediate
                        value={values.wilaya}
                        onChange={(val) => handleWilayaChange(Number(val), setFieldValue)}
                        name="wilaya"
                      >
                        <div className="relative">
                          <ComboboxInput
                            className="mt-1 block w-full rounded-md border-neutral-300 px-2 py-2 shadow-sm focus:border-neutral-300 focus:ring focus:ring-neutral-200 focus:ring-opacity-50 disabled:bg-gray-100 placeholder:text-neutral-400"
                            displayValue={(val: number | string) => {
                              const selected = wilayas.find((w) => w.code === val);
                              return selected
                                ? isRTL
                                  ? selected.name_ar
                                  : selected.name_lt
                                : typeof val === "string"
                                  ? val
                                  : "";
                            }}
                            onChange={(e) => setFieldValue("wilaya", e.target.value)}
                            placeholder={loadingWilayas ? messages.loading : ""}
                            required
                            autoComplete="off"
                          />
                          <ComboboxOptions className="absolute left-0 top-full z-10 max-h-60 w-full overflow-auto rounded border border-neutral-200 bg-white shadow">
                            {wilayas.length > 0 &&
                              wilayas
                                .filter((w) => {
                                  // Simple local filtering if needed, or just show all
                                  return (
                                    !values.wilaya ||
                                    (isRTL ? w.name_ar : w.name_lt)
                                      .toLowerCase()
                                      .includes(
                                        typeof values.wilaya === "string"
                                          ? values.wilaya.toLowerCase()
                                          : "",
                                      )
                                  );
                                })
                                .map((w) => (
                                  <ComboboxOption
                                    key={w.code}
                                    value={w.code}
                                    className={({ active }) =>
                                      `cursor-pointer px-4 py-2 ${active ? "bg-blue-100" : ""
                                      }`
                                    }
                                  >
                                    {isRTL ? w.name_ar : w.name_lt}
                                  </ComboboxOption>
                                ))}
                          </ComboboxOptions>
                        </div>
                      </Combobox>
                    </label>
                  </div>
                  <div>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs text-neutral-700">
                        {translations.commune}
                      </span>
                      <Combobox
                        immediate
                        value={values.city}
                        onChange={(val) => setFieldValue("city", val)}
                        name="city"
                        disabled={!values.wilaya || isSubmitting}
                      >
                        <div className="relative">
                          <ComboboxInput
                            className="mt-1 block w-full rounded-md border-neutral-300 px-2 py-2 shadow-sm focus:border-neutral-300 focus:ring focus:ring-neutral-200 focus:ring-opacity-50 disabled:bg-gray-100 placeholder:text-neutral-400"
                            displayValue={(val: any) => {
                              const selected = communes.find((c) => c.id === val);
                              return selected ? selected.name : ""; // Assuming name is always latin/available? Docs say "name"
                            }}
                            onChange={(e) =>
                              setFieldValue("city", e.target.value)
                            }
                            required
                            autoComplete="off"
                            placeholder={
                              loadingCommunes
                                ? messages.loading
                                : !values.wilaya
                                  ? messages.selectWilayaFirst
                                  : ""
                            }
                          />
                          <ComboboxOptions className="absolute left-0 top-full z-10 max-h-60 w-full overflow-auto rounded border border-neutral-200 bg-white shadow">
                            {communes
                              .filter((c) =>
                                c.name
                                  .toLowerCase()
                                  .includes(
                                    typeof values.city === "string"
                                      ? values.city.toLowerCase()
                                      : "",
                                  ),
                              )
                              .map((c) => (
                                <ComboboxOption
                                  key={c.id}
                                  value={c.id}
                                  className={({ active }) =>
                                    `cursor-pointer px-4 py-2 ${active ? "bg-blue-100" : ""
                                    }`
                                  }
                                >
                                  {c.name}
                                </ComboboxOption>
                              ))}
                          </ComboboxOptions>
                        </div>
                      </Combobox>
                    </label>
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      type="button"
                      className="rounded bg-gray-200 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={onClose}
                      disabled={isSubmitting}
                    >
                      {translations.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center rounded bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          <span>{messages.loading || "..."}</span>
                        </div>
                      ) : (
                        translations.submit
                      )}
                    </button>
                  </div>
                </Fieldset>
              </form>
            )}
          </Formik>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
