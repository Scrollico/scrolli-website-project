import { cookies } from "next/headers";

const dictionaries = {
  en: {
    common: {
      search: "Search...",
      signIn: "Sign in",
      subscribe: "Subscribe",
      logoAlt: "Scrolli Logo",
      all: "All",
      readMore: "Read More",
      loading: "Loading...",
      error: "Error",
      retry: "Retry",
      notFoundTitle: "Page Not Found",
      notFoundDesc: "The page you are looking for does not exist.",
      backHome: "Back to Home",
      backSearch: "Search",
      minRead: "min read",
      share: "Share",
      premium: "Premium",
    },
    nav: {
      menu: "Menu",
      account: "Account",
      profile: "Profile",
      membership: "Membership",
      upgrade: "Upgrade to Premium",
      preferences: "Preferences",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      system: "System",
      logout: "Sign Out",
      business: "Business",
      alaraAi: "Alara AI",
      discover: "Discover",
      exploreContent: "Explore Content",
      latestArticles: "Latest Articles",
      trendingTopics: "Trending Topics",
      aiFeatures: "AI Features",
      smartAssistant: "Smart Assistant",
      integration: "Integration",
      solutions: "Solutions",
      enterprise: "Enterprise",
      contactSales: "Contact Sales",
      newsletter: "Newsletter",
      about: "About",
      contact: "Contact",
    },
    footer: {
      tagline: "In-depth media experience",
      categories: "CATEGORIES",
      info: "INFO",
      copyright: "©2025 Scrolli. All Rights Reserved. Scrolli Media Inc.",
      links: {
        archive: "Archive",
        categories: "Categories",
        about: "About Us",
        author: "Author",
        contact: "Contact",
        terms: "Terms of Use",
        imprint: "Imprint",
      }
    },
    home: {
      editorsPicks: "Editor's Picks",
      exclusiveStories: "Exclusive Stories for Subscribers",
      exclusiveDesc: "Our premium journalism works consisting of special files include interactive stories",
      latestStories: "Latest Stories",
    },
    article: {
      minRead: "min read",
      share: "Share",
    },
    paywall: {
      subscribeTitle: "Subscribe to continue reading",
      subscribeDesc: "Support independent journalism and get unlimited access.",
      freeLeft: "free articles left",
      upgradeNow: "Upgrade Now",
      remaining: "remaining",
      loginRequired: "Please sign in or create an account first.",
      preparingPayment: "Payment system is initializing... Please wait a few seconds and try again.",
      purchaseCancelled: "Purchase cancelled.",
      purchaseError: "An error occurred during purchase. Please try again.",
      monthly: "Monthly",
      yearly: "Yearly",
      lifetime: "Lifetime",
      mostPopular: "MOST POPULAR",
      bestValue: "BEST VALUE",
      unlockUnlimited: "Unlock Unlimited Access",
      limitReached: "You have read all {articlesRead} free articles this month.",
      subscribeNow: "Subscribe Now",
      cancelAnytime: "Cancel anytime.",
      benefitsTitle: "What you get with Premium:",
      benefits: [
        "Unlimited article access",
        "Ad-free experience",
        "Exclusive content and analysis",
        "Early access and archive"
      ]
    },
    gift: {
      received: "{senderName} gifted you this article!",
      enjoy: "Enjoy reading",
      invalid: "This gift link is invalid or expired."
    }
  },
  tr: {
    common: {
      search: "Ara...",
      signIn: "Giriş Yap",
      subscribe: "Abone Ol",
      logoAlt: "Scrolli Logosu",
      all: "Tümü",
      readMore: "Devamını Oku",
      loading: "Yükleniyor...",
      error: "Hata",
      retry: "Tekrar Dene",
      notFoundTitle: "Sayfa Bulunamadı",
      notFoundDesc: "Aradığınız sayfa mevcut değil.",
      backHome: "Ana Sayfaya Dön",
      backSearch: "Arama Yap",
      minRead: "dk okuma",
      share: "Paylaş",
      premium: "Premium",
    },
    nav: {
      menu: "Menü",
      account: "Hesap",
      profile: "Profilim",
      membership: "Üyelik Yönetimi",
      upgrade: "Premium'a Geç",
      preferences: "Tercihler",
      theme: "Tema",
      light: "Aydınlık",
      dark: "Karanlık",
      system: "Sistem",
      logout: "Çıkış Yap",
      business: "İş Dünyası",
      alaraAi: "Alara AI",
      discover: "Keşfet",
      exploreContent: "İçerikleri Keşfet",
      latestArticles: "Son Makaleler",
      trendingTopics: "Trend Konular",
      aiFeatures: "Yapay Zeka Özellikleri",
      smartAssistant: "Akıllı Asistan",
      integration: "Entegrasyon",
      solutions: "Çözümler",
      enterprise: "Kurumsal",
      contactSales: "Satışla İletişim",
      newsletter: "Bülten",
      about: "Hakkında",
      contact: "İletişim",
    },
    footer: {
      tagline: "Derinlemesine medya deneyimi",
      categories: "KATEGORİLER",
      info: "BİLGİ",
      copyright: "©2025 Scrolli. Tüm Hakları Saklıdır. Scrolli Medya A.Ş.",
      links: {
        archive: "Arşiv",
        categories: "Kategoriler",
        about: "Hakkımızda",
        author: "Yazarlar",
        contact: "İletişim",
        terms: "Kullanım Koşulları",
        imprint: "Künye",
      }
    },
    home: {
      editorsPicks: "Editörün Seçtikleri",
      exclusiveStories: "Abonelere özel hikâyeler",
      exclusiveDesc: "Özel dosyalardan oluşan, birinci sınıf gazetecilik çalışmalarımız etkileşimli hikâyeleri içeriyor",
      latestStories: "Son Hikayeler",
    },
    article: {
      minRead: "dk okuma",
      share: "Paylaş",
    },
    paywall: {
      subscribeTitle: "Okumaya devam etmek için abone olun",
      subscribeDesc: "Bağımsız gazeteciliği destekleyin ve sınırsız erişim elde edin.",
      freeLeft: "ücretsiz makale kaldı",
      upgradeNow: "Premium'a Geç",
      remaining: "kaldı",
      loginRequired: "Lütfen önce giriş yapın veya hesap oluşturun.",
      preparingPayment: "Ödeme sistemi hazırlanıyor... Lütfen birkaç saniye bekleyin ve tekrar deneyin.",
      purchaseCancelled: "Satın alma iptal edildi.",
      purchaseError: "Satın alma sırasında bir hata oluştu. Lütfen tekrar deneyin.",
      monthly: "Aylık",
      yearly: "Yıllık",
      lifetime: "Ömür Boyu",
      mostPopular: "EN POPÜLER",
      bestValue: "EN İYİ DEĞER",
      unlockUnlimited: "Sınırsız Erişimin Kilidini Aç",
      limitReached: "Bu ay {articlesRead} ücretsiz makalenin tamamını okudun.",
      subscribeNow: "Şimdi Abone Ol",
      cancelAnytime: "İstediğiniz zaman iptal edebilirsiniz.",
      benefitsTitle: "Premium ile neler kazanırsın:",
      benefits: [
        "Sınırsız makale erişimi",
        "Reklamsız deneyim",
        "Özel içerikler ve analizler",
        "Erken erişim ve arşiv"
      ]
    },
    gift: {
      received: "{senderName} sana bu makaleyi hediye etti!",
      enjoy: "İyi okumalar",
      invalid: "Bu hediye linki geçersiz veya süresi dolmuş."
    }
  }
};

export type Locale = "en" | "tr";
export type Dictionary = typeof dictionaries.en;

export async function getLocale(): Promise<Locale> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    return (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "tr";
  } catch (error) {
    return "tr";
  }
}

export async function getDictionary(): Promise<Dictionary> {
  const locale = await getLocale();
  return dictionaries[locale] || dictionaries.tr;
}
