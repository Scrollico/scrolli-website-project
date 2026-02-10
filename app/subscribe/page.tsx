import { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import { SubscribePageContent } from "./SubscribePageContent";

export const metadata: Metadata = {
    title: "Premium Üyelik - Scrolli",
    description: "Scrolli Premium ile sınırsız makale erişimi, reklamsız deneyim ve özel içeriklere ulaşın.",
};

export default function SubscribePage() {
    return (
        <Layout>
            <SubscribePageContent />
        </Layout>
    );
}
