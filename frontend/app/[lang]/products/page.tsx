import { redirect } from "next/navigation";

export default async function EmptyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  redirect(`/${lang}`);
}
