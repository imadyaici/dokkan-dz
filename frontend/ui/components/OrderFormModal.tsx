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
import communes from "@/communes.json";

export const OrderFormModal = ({
  onClose,
  product,
  quantity,
}: {
  onClose: () => void;
  product: ProductQueryResult;
  quantity: number;
}) => {
  const isValidPhoneNumber = usePhoneNumberValidator();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-xl font-semibold">Order Form</h2>
        <Formik
          initialValues={{ name: "", address: "", phone: "", city: "" }}
          validate={(values) => {
            const errors: Record<string, string> = {};
            const phoneError = isValidPhoneNumber(values.phone);
            if (phoneError) errors.phone = phoneError;
            return errors;
          }}
          onSubmit={async (values) => {
            // Handle order submission logic here
            const res = await fetch("/api/order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ...values, product, quantity }),
            });

            console.log("Order response:", res);

            if (res.ok) {
              toast.success("Order submitted successfully!", {
                position: "bottom-center",
              });
            } else {
              console.error("Error submitting order");
              toast.error("Error submitting order", {
                position: "bottom-center",
              });
            }

            onClose();
          }}
        >
          {({
            values,
            handleChange,
            setFieldValue,
            errors,
            touched,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Fieldset className="space-y-4">
                <div>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-neutral-700">Name</span>
                    <Input
                      name="name"
                      required
                      value={values.name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-neutral-300 px-2 py-2 shadow-sm focus:border-neutral-300 focus:ring focus:ring-neutral-200 focus:ring-opacity-50"
                    />
                  </label>
                </div>
                <div>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-neutral-700">Address</span>
                    <Input
                      name="address"
                      required
                      value={values.address}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-neutral-300 px-2 py-2 shadow-sm focus:border-neutral-300 focus:ring focus:ring-neutral-200 focus:ring-opacity-50"
                    />
                  </label>
                </div>
                <div>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-neutral-700">Phone</span>
                    <Input
                      name="phone"
                      required
                      value={values.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-neutral-300 px-2 py-2 shadow-sm focus:border-neutral-300 focus:ring focus:ring-neutral-200 focus:ring-opacity-50"
                    />
                    {touched.phone && errors.phone && (
                      <span className="mt-1 text-sm text-red-500">
                        {errors.phone}
                      </span>
                    )}
                  </label>
                </div>
                <div>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-neutral-700">City</span>
                    <Combobox
                      value={values.city}
                      onChange={(val) => setFieldValue("city", val)}
                      name="city"
                    >
                      <div className="relative">
                        <ComboboxInput
                          className="mt-1 block w-full rounded-md border-neutral-300 px-2 py-2 shadow-sm focus:border-neutral-300 focus:ring focus:ring-neutral-200 focus:ring-opacity-50"
                          displayValue={(val: string) => {
                            const selected = communes.find(
                              (c: any) => c.pk === val
                            );
                            return selected ? selected.fields.name : val;
                          }}
                          onChange={(e) =>
                            setFieldValue("city", e.target.value)
                          }
                          required
                          autoComplete="off"
                        />
                        {values.city?.length >= 2 && (
                          <ComboboxOptions className="absolute left-0 top-full z-10 max-h-60 w-full overflow-auto rounded border border-neutral-200 bg-white shadow">
                            {communes
                              .filter((c: any) =>
                                c.fields.name
                                  .toLowerCase()
                                  .includes(values.city.toLowerCase())
                              )
                              .slice(0, 10)
                              .map((c: any) => (
                                <ComboboxOption
                                  key={c.pk}
                                  value={c.pk}
                                  className={({ active }) =>
                                    `cursor-pointer px-4 py-2 ${active ? "bg-blue-100" : ""}`
                                  }
                                >
                                  {c.fields.name}
                                </ComboboxOption>
                              ))}
                          </ComboboxOptions>
                        )}
                      </div>
                    </Combobox>
                  </label>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    className="rounded bg-gray-200 px-4 py-2"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-white"
                  >
                    Submit
                  </button>
                </div>
              </Fieldset>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};
