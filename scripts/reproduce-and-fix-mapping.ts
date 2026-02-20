
import { mapHikayelerToArticle } from "../lib/payload/types";
import { PayloadHikayeler } from "../lib/payload/types";

// Mock the raw data structure we found
const mockRawData = {
    "id": "6959a3186e78df8e5ae7b789",
    "slug": "yap-islet-devret-modeli-bir-servet-transferi-1767482136257",
    "title": "'Yap-İşlet-Devret modeli bir servet transferi'",
    "source": "Hikayeler",
    "publishedAt": "2026-01-03T23:15:36.257Z",
    "createdAt": "2026-01-03T23:15:36.258Z",
    "updatedAt": "2026-01-13T19:49:52.013Z",
    "collection": "hikayeler",
    "content": {
        "tr": {
            "root": {
                "children": [
                    {
                        "children": [
                            {
                                "text": "  @font-face {font-family: 'Body';font-style: normal; ... (LOTS OF CSS) ... }",
                                "type": "text",
                                "version": 1
                            }
                        ],
                        "type": "paragraph",
                        "version": 1
                    },
                    {
                        "children": [
                            {
                                "text": "327 milyar liralık yük",
                                "type": "text",
                                "version": 1
                            }
                        ],
                        "type": "paragraph",
                        "version": 1
                    },
                    {
                        "children": [
                            {
                                "text": "Valid content paragraph 2.",
                                "type": "text",
                                "version": 1
                            }
                        ],
                        "type": "paragraph",
                        "version": 1
                    }
                ],
                "type": "root",
                "version": 1
            }
        }
    }
};

console.log("--- Current Behavior ---");
// We need to cast because we are mocking a partial object
const currentResult = mapHikayelerToArticle(mockRawData as unknown as PayloadHikayeler);
console.log("Has content?", !!currentResult.content);
console.log("Content length:", currentResult.content?.length);


console.log("\n--- Proposed Fix Behavior ---");

// Proposed fix logic
function cleanMessyContent(contentObj: any) {
    if (!contentObj || !contentObj.root || !contentObj.root.children) return contentObj;

    const newChildren = contentObj.root.children.filter((child: any) => {
        if (child.children && child.children.length > 0) {
            const text = child.children[0].text;
            if (typeof text === 'string' && (text.trim().startsWith('@font-face') || text.includes('.ibG8wLku-container'))) {
                console.log("Removing CSS node starting with:", text.substring(0, 50) + "...");
                return false;
            }
        }
        return true;
    });

    return {
        ...contentObj,
        root: {
            ...contentObj.root,
            children: newChildren
        }
    };
}

// Simulate applying the fix inside mapHikayelerToArticle
const cleanedData = { ...mockRawData };
if (cleanedData.content && cleanedData.content.tr) {
    cleanedData.content.tr = cleanMessyContent(cleanedData.content.tr);
}

const fixedResult = mapHikayelerToArticle(cleanedData as unknown as PayloadHikayeler);
console.log("Has content?", !!fixedResult.content);
console.log("Content length:", fixedResult.content?.length);
if (fixedResult.content) {
    console.log("Content snippet:", fixedResult.content.substring(0, 100));
}
