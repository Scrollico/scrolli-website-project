module.exports = {
    ci: {
        collect: {
            // For Cloudflare Pages, the URL is usually provided by the CI environment
            // or we can specify it manually in the GitHub Action.
            numberOfRuns: 3,
            settings: {
                preset: "desktop", // You can also use 'mobile'
                chromeFlags: "--no-sandbox",
                onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
            },
        },
        assert: {
            assertions: {
                "categories:performance": ["warn", { minScore: 0.9 }],
                "categories:accessibility": ["warn", { minScore: 0.9 }],
                "categories:best-practices": ["warn", { minScore: 0.9 }],
                "categories:seo": ["warn", { minScore: 0.9 }],
            },
        },
        upload: {
            target: "temporary-public-storage", // Uploads to a temporary URL for review
        },
    },
};
