export const runtime = "edge";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { getNavigation } from "@/lib/payload/client";
import { typography, colors, spacing } from "@/lib/design-tokens";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function NotFound() {
    // Fetch navigation data for the header/footer
    const navigation = await getNavigation().catch(() => null);

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
                        Aradığınız sayfa bulunamadı.
                    </h1>

                    <p className={cn(typography.bodyLarge, "mb-10 max-w-lg mx-auto", colors.foreground.secondary)}>
                        Tıkladığınız bağlantı bozulmuş olabilir veya sayfa kaldırılmış olabilir.
                        En güncel içeriklerimize göz atmak için ana sayfaya dönebilirsiniz.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            asChild
                            variant="success"
                            size="lg"
                            className="rounded-full px-10 text-lg"
                        >
                            <Link href="/">
                                Ana Sayfaya Dön
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="rounded-full px-10 text-lg"
                        >
                            <Link href="/search">
                                Arama Yap
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
