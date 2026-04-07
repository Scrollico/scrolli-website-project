export const runtime = "edge";
export const dynamic = "force-dynamic";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { typography, colors, spacing } from "@/lib/design-tokens";
import Link from "next/link";
import { cn } from "@/lib/utils";
import translations from "@/lib/translations";
import { cookies } from "next/headers";
import { NEXT_LOCALE_COOKIE } from "@/lib/locale-config";

export default async function NotFound() {
    const cookieStore = await cookies();
    const locale = (cookieStore.get(NEXT_LOCALE_COOKIE)?.value === 'en' ? 'en' : 'tr') as 'tr' | 'en';
    const dict = translations[locale];

    // Fetch navigation data for the header/footer
    // const navigation = await getNavigation().catch(() => null);
    const navigation = null;

    return (
        <Layout classList="single page-404" navigation={navigation}>
            <div className={cn("container mx-auto px-4 flex flex-col items-center justify-center", spacing('section', 'xl'))}>
                <div className="max-w-2xl mx-auto text-center">
                    {/* Large prominent 404 background text */}
                    <div
                        aria-hidden="true"
                        className={cn(
                            typography.h1,
                            "mb-2 text-[120px] md:text-[180px] leading-none text-green-600/10 dark:text-green-500/10 select-none font-black"
                        )}
                    >
                        404
                    </div>

                    <h1 className={cn(typography.h1, "mb-4 -mt-10 md:-mt-16", colors.foreground.primary)}>
                        {dict["notFound.title"]}
                    </h1>

                    <p className={cn(typography.bodyLarge, "mb-10 max-w-lg mx-auto", colors.foreground.secondary)}>
                        {dict["notFound.description"]}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            asChild
                            variant="success"
                            size="lg"
                            className="rounded-full px-10 text-lg"
                        >
                            <Link href="/">
                                {dict["notFound.goHome"]}
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="rounded-full px-10 text-lg"
                        >
                            <Link href="/search">
                                {dict["notFound.search"]}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
