/**
 * appmass — Deploy to Appwrite Sites
 * 
 * This script:
 * 1. Builds the Expo web export
 * 2. Creates/updates an Appwrite Site
 * 3. Deploys the web-build folder to Appwrite Sites
 * 
 * Prerequisites: Appwrite CLI installed
 * Run: npm install -g appwrite-cli && appwrite login
 * Then: node scripts/deploy-appwrite-sites.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = '6a574108002067b4d857';
const SITE_NAME = 'appmass';
const BUILD_DIR = 'web-build';

async function main() {
  console.log('\n========================================');
  console.log('  appmass — Deploy to Appwrite Sites');
  console.log('========================================\n');

  // Step 1: Build Expo for web
  console.log('📦 Building Expo web export...');
  try {
    execSync('npx expo export:web', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
    console.log('   ✅ Build complete\n');
  } catch (err) {
    console.error('   ❌ Build failed:', err.message);
    process.exit(1);
  }

  // Step 2: Check if web-build exists
  if (!fs.existsSync(path.resolve(__dirname, '..', BUILD_DIR))) {
    console.error(`   ❌ ${BUILD_DIR} not found. Build may have failed.`);
    process.exit(1);
  }

  // Step 3: Create or update Appwrite Site
  console.log('🌐 Setting up Appwrite Site...');
  try {
    // Check if site exists
    const sitesOutput = execSync(
      `appwrite sites list --project ${PROJECT_ID}`,
      { encoding: 'utf-8', cwd: path.resolve(__dirname, '..') }
    );
    
    if (sitesOutput.includes(SITE_NAME)) {
      console.log('   ⏩ Site already exists, updating deployment...');
      execSync(
        `appwrite sites createDeployment --siteId ${SITE_NAME} --code ./${BUILD_DIR} --activate true`,
        { stdio: 'inherit', cwd: path.resolve(__dirname, '..') }
      );
    } else {
      console.log('   🆕 Creating new site...');
      execSync(
        `appwrite sites create --siteId ${SITE_NAME} --name "${SITE_NAME}" --framework static`,
        { stdio: 'inherit', cwd: path.resolve(__dirname, '..') }
      );
      execSync(
        `appwrite sites createDeployment --siteId ${SITE_NAME} --code ./${BUILD_DIR} --activate true --entryPoint index.html`,
        { stdio: 'inherit', cwd: path.resolve(__dirname, '..') }
      );
    }
    console.log('   ✅ Site deployed!\n');
  } catch (err) {
    console.error('   ❌ Deployment failed:', err.message);
    console.log('\n   ⚠️  Try manual deployment:');
    console.log('   1. Go to https://cloud.appwrite.io/project/' + PROJECT_ID + '/sites');
    console.log('   2. Click "Create Site"');
    console.log('   3. Upload the web-build/ folder');
    process.exit(1);
  }

  // Step 4: Output URL
  console.log('\n========================================');
  console.log('  ✅ Deployed Successfully!');
  console.log('========================================\n');
  console.log(`   Site URL: https://${SITE_NAME}.appwrite.site`);
  console.log(`   Or check: https://cloud.appwrite.io/project/${PROJECT_ID}/sites\n`);
  console.log('   📝 To set up a custom domain:');
  console.log('      Console → Sites → appmass → Domains → Add Domain\n');
}

main().catch(console.error);
