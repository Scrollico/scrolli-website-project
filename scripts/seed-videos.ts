/**
 * Seed script: Inserts the 7 existing hardcoded videos into the Payload CMS 'videos' collection.
 *
 * Usage:
 *   npx ts-node scripts/seed-videos.ts
 *
 * Requires:
 *   PAYLOAD_CMS_URL (default: https://cms.scrolli.co/api)
 *   PAYLOAD_API_KEY  (your API key)
 */

const PAYLOAD_CMS_URL = process.env.PAYLOAD_CMS_URL || "https://cms.scrolli.co/api";
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY || "";

interface VideoSeed {
    title: string;
    slug: string;
    videoUrl: string;
    ordering: number;
    isFeatured: boolean;
    publishedAt: string;
}

const videos: VideoSeed[] = [
    {
        title: "Türkiye'de yasa dışı bahis piyasasında dönen paranın 40 milyar dolar olduğu tahmin ediliyor.",
        slug: "yasa-disi-bahis-piyasasi",
        videoUrl: "/assets/videos/scrolli1.mp4",
        ordering: 7,
        isFeatured: true,
        publishedAt: new Date().toISOString(),
    },
    {
        title: "2021'den bu yana Marmaray hattında en az 29 kişi hayatına son verdi ya da girişimde bulundu.",
        slug: "marmaray-hatti-olaylari",
        videoUrl: "/assets/videos/scrolli2.mp4",
        ordering: 6,
        isFeatured: true,
        publishedAt: new Date().toISOString(),
    },
    {
        title: "Anna Wintour, Vogue US'te 37 yılın ardından tarihi bir dönem kapatıyor.",
        slug: "anna-wintour-vogue",
        videoUrl: "/assets/videos/scrolli3.mp4",
        ordering: 5,
        isFeatured: true,
        publishedAt: new Date().toISOString(),
    },
    {
        title: "Çin'in dikkati, Pakistan'ın endişeleri ve Taliban'ın hedefleri Wakhan'da buluşuyor.",
        slug: "cin-pakistan-taliban-wakhan",
        videoUrl: "/assets/videos/scrolli4.mp4",
        ordering: 4,
        isFeatured: true,
        publishedAt: new Date().toISOString(),
    },
    {
        title: "Bir yıldır 'derinlik' sunuyoruz. Destek veren tüm abonelerimize teşekkürler.",
        slug: "bir-yil-derinlik",
        videoUrl: "/assets/videos/scrolli5.mp4",
        ordering: 3,
        isFeatured: true,
        publishedAt: new Date().toISOString(),
    },
    {
        title: "Türkiye ile Birleşik Krallık arasında Eurofighter Typhoon süreci resmen başladı.",
        slug: "eurofighter-typhoon-sureci",
        videoUrl: "/assets/videos/scrolli6.mp4",
        ordering: 2,
        isFeatured: true,
        publishedAt: new Date().toISOString(),
    },
    {
        title: "Yapay zeka ile yalnızlık arasındaki ince çizgi: Seran Demiral ve Ayhan Asar değerlendiriyor.",
        slug: "yapay-zeka-yalnizlik",
        videoUrl: "/assets/videos/scrolli7.mp4",
        ordering: 1,
        isFeatured: true,
        publishedAt: new Date().toISOString(),
    },
];

async function seedVideos() {
    if (!PAYLOAD_API_KEY) {
        console.error("ERROR: Set PAYLOAD_API_KEY environment variable");
        process.exit(1);
    }

    console.log(`Seeding ${videos.length} videos to ${PAYLOAD_CMS_URL}/videos...`);

    for (const video of videos) {
        try {
            const response = await fetch(`${PAYLOAD_CMS_URL}/videos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${PAYLOAD_API_KEY}`,
                },
                body: JSON.stringify(video),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`  ✅ Created: ${video.slug} (id: ${data.doc?.id || data.id})`);
            } else {
                const errorText = await response.text();
                console.error(`  ❌ Failed: ${video.slug} — ${response.status}: ${errorText.substring(0, 200)}`);
            }
        } catch (error) {
            console.error(`  ❌ Error: ${video.slug} —`, (error as Error).message);
        }
    }

    console.log("\nDone.");
}

seedVideos();
