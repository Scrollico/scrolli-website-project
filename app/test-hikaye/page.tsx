import Layout from "@/components/layout/Layout";
import InlineScriptRenderer from '@/components/sections/single/InlineScriptRenderer';
import { getNavigation } from "@/lib/payload/client";

export default async function TestHikayePage() {
    // Fetch real navigation data for the Header
    const navigation = await getNavigation();

    // Use the INLINE script version to avoid viewport hijacking
    const scriptHtml = '<script src="https://stories.instorier-cdn.com/stories/2283/ctowf5f/inline.js" id="ictowf5f" async></script>';

    return (
        <Layout classList="single" navigation={navigation}>
            <div className="w-full overflow-visible">
                <InlineScriptRenderer html={scriptHtml} className="w-full overflow-visible" />
            </div>
        </Layout>
    );
}
