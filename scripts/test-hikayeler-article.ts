/**
 * Test script to verify hikayeler article data and rendering logic
 * Run with: npx tsx scripts/test-hikayeler-article.ts [slug]
 * 
 * Example: npx tsx scripts/test-hikayeler-article.ts icine-dogdugumuz-dunyanin-sonu
 */

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

async function testHikayelerArticle() {
  // Get slug from command line args, or use default
  const testSlug = process.argv[2] || 'icine-dogdugumuz-dunyanin-sonu';
  
  console.log('🔍 Testing Hikayeler Article:', testSlug);
  console.log('=====================================\n');

  try {
    const { getArticleBySlug } = await import('../lib/payload/client');
    const { mapHikayelerToArticle } = await import('../lib/payload/types');
    
    // 1. Fetch article
    console.log('1️⃣ Fetching article from API...');
    const payloadArticle = await getArticleBySlug(testSlug);
    
    if (!payloadArticle) {
      console.error('❌ Article not found!');
      console.log('\n💡 Try running with a different slug:');
      console.log('   npx tsx scripts/test-hikayeler-article.ts [your-slug-here]');
      process.exit(1);
    }
    
    console.log('✅ Article fetched successfully');
    console.log(`   Source: ${payloadArticle.source}`);
    console.log(`   Title: ${payloadArticle.title}`);
    console.log(`   Slug: ${payloadArticle.slug}`);
    
    // 2. Check inlineScriptHtml
    console.log('\n2️⃣ Checking inlineScriptHtml field...');
    const rawInlineScript = (payloadArticle as any).inlineScriptHtml;
    console.log(`   Type: ${typeof rawInlineScript}`);
    
    if (typeof rawInlineScript === 'object' && rawInlineScript !== null) {
      console.log(`   ✅ Localized object detected`);
      console.log(`   Has 'tr': ${!!rawInlineScript.tr}`);
      console.log(`   Has 'en': ${!!rawInlineScript.en}`);
      
      if (rawInlineScript.tr) {
        console.log(`   Turkish content length: ${rawInlineScript.tr.length} chars`);
        console.log(`   Preview: ${rawInlineScript.tr.substring(0, 200).replace(/\n/g, ' ')}...`);
        
        // Extract script ID and URL
        const scriptMatch = rawInlineScript.tr.match(/id="(i[^"]+)"/);
        const srcMatch = rawInlineScript.tr.match(/src="([^"]+)"/);
        if (scriptMatch) {
          console.log(`   ✅ Script ID found: ${scriptMatch[1]}`);
        } else {
          console.log(`   ⚠️ No script ID found in HTML`);
        }
        if (srcMatch) {
          console.log(`   ✅ Script URL found: ${srcMatch[1]}`);
        } else {
          console.log(`   ⚠️ No script URL found in HTML`);
        }
      }
    } else if (typeof rawInlineScript === 'string') {
      console.log(`   ✅ Direct string content`);
      console.log(`   Length: ${rawInlineScript.length} chars`);
      console.log(`   Preview: ${rawInlineScript.substring(0, 200).replace(/\n/g, ' ')}...`);
      
      // Extract script ID and URL
      const scriptMatch = rawInlineScript.match(/id="(i[^"]+)"/);
      const srcMatch = rawInlineScript.match(/src="([^"]+)"/);
      if (scriptMatch) {
        console.log(`   ✅ Script ID found: ${scriptMatch[1]}`);
      }
      if (srcMatch) {
        console.log(`   ✅ Script URL found: ${srcMatch[1]}`);
      }
    } else {
      console.log(`   ⚠️ No inlineScriptHtml found!`);
    }
    
    // 3. Map to Article type
    console.log('\n3️⃣ Mapping to Article interface...');
    if (payloadArticle.source === 'Hikayeler') {
      const article = mapHikayelerToArticle(payloadArticle as any);
      console.log(`✅ Mapped successfully`);
      console.log(`   ID: ${article.id}`);
      console.log(`   Category: ${article.category}`);
      console.log(`   Has inlineScriptHtml: ${!!article.inlineScriptHtml}`);
      console.log(`   Has regular content: ${!!article.content}`);
      console.log(`   Has featured image: ${!!article.image}`);
      console.log(`   Has mobile image: ${!!article.mobileImage}`);
      
      if (article.inlineScriptHtml) {
        console.log(`   inlineScriptHtml length: ${article.inlineScriptHtml.length} chars`);
      }
      
      // 4. Rendering decision
      console.log('\n4️⃣ Determining render path...');
      const isHikayelerWithScript = 
        article.category === 'hikayeler' && 
        !!article.inlineScriptHtml && 
        article.inlineScriptHtml.trim().length > 0;
      
      if (isHikayelerWithScript) {
        console.log(`✅ Will use HikayelerMinimal component`);
        console.log(`   This article will show ONLY the Instorier story`);
        console.log(`   No header, no related articles, no comments`);
      } else {
        console.log(`⚠️ Will use Section1 (full view) component`);
        if (!article.inlineScriptHtml) {
          console.log(`   Reason: No inlineScriptHtml field`);
        } else if (article.inlineScriptHtml.trim().length === 0) {
          console.log(`   Reason: inlineScriptHtml is empty string`);
        } else {
          console.log(`   Reason: Unknown (check mapping logic)`);
        }
      }
      
      // 5. URL prediction
      console.log('\n5️⃣ Article URL...');
      console.log(`   Visit: http://localhost:3000/${article.id}`);
      console.log(`   Or: http://localhost:3000/${payloadArticle.slug}`);
      
    } else {
      console.log(`⚠️ This is a Gündem article, not Hikayeler`);
      console.log(`   Source: ${payloadArticle.source}`);
      console.log(`   Gündem articles always use Section1 component`);
    }
    
    console.log('\n✅ Test completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Start dev server: npm run dev');
    console.log(`   2. Visit: http://localhost:3000/${testSlug}`);
    console.log('   3. Check browser console for Instorier logs');
    console.log('   4. Verify story loads without CSP errors');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    if (error instanceof Error) {
      console.error('   Error message:', error.message);
      console.error('   Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

testHikayelerArticle().then(() => process.exit(0));
