import { findArticleById } from "@/lib/content";
import { notFound, redirect } from "next/navigation";
import GiftRedemptionClient from "./GiftRedemptionClient";

interface GiftPageProps {
    params: {
        token: string;
    };
}

export default async function GiftPage({ params }: GiftPageProps) {
    const { token } = await params;

    // Use service role to read gift without authentication
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceRoleKey || !supabaseUrl) {
        return notFound();
    }

    const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
    const serviceSupabase = createSupabaseClient(supabaseUrl, serviceRoleKey);

    // Fetch gift details
    const { data: gift, error } = await serviceSupabase
        .from("article_gifts")
        .select("id, article_id, from_user_id, read_at, expires_at, to_email")
        .eq("gift_token", token)
        .single();

    if (error || !gift) {
        return notFound();
    }

    // Check if already redeemed - if yes, redirect to article
    if (gift.read_at) {
        redirect(`/${gift.article_id}`);
    }

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(gift.expires_at);
    const isExpired = now > expiresAt;

    // Fetch sender details FIRST (before using it)
    let senderName = "Bir arkadaşın";
    if (gift.from_user_id) {
        const { data: sender } = await serviceSupabase
            .from("profiles")
            .select("full_name, email")
            .eq("id", gift.from_user_id)
            .maybeSingle();

        if (sender) {
            senderName = sender.full_name || sender.email || "Bir arkadaşın";
        }
    }

    // Fetch article details
    const article = await findArticleById(gift.article_id);
    if (!article) {
        console.log('Article not found for ID:', gift.article_id, '- creating mock article for testing');
        // Create a mock article for testing
        const mockArticle = {
            id: gift.article_id,
            title: "Test Article (Article not found in CMS)",
            excerpt: "This is a test article created because the real article couldn't be found.",
            content: "<p>This is test content because the article couldn't be loaded from CMS.</p>",
            category: "test",
            image: "",
            seoTitle: "Test Article",
            seoDescription: "Test article description",
            author: "test-author",
            readTime: "1 min read",
            date: new Date().toISOString(),
            slug: gift.article_id,
            tags: [],
            isPremium: false,
            source: "Test"
        };
        return <GiftRedemptionClient
            token={token}
            article={mockArticle}
            senderName={senderName}
            recipientEmail={gift.to_email}
            expiresAt={gift.expires_at}
            isExpired={isExpired}
        />;
    }

    return (
        <GiftRedemptionClient
            token={token}
            article={article}
            senderName={senderName}
            recipientEmail={gift.to_email}
            expiresAt={gift.expires_at}
            isExpired={isExpired}
        />
    );
}
