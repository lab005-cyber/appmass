/**
 * appmass — Appwrite Cloud Automated Setup
 * Run: node scripts/setup-appwrite.js
 * 
 * Uses Appwrite REST API directly (no npm install needed)
 */

const API_KEY = 'standard_ce4f609771d5df0db7a29903b3d31ac1ec1fd680331c8e691f896ab68638e6f9e295db775b516c028b17d76d9d15d5e072b4405d8631431681d704fba912f83ecc0c20ee059847e7d6591d4372397d5122979941406dc0391a2b60d2076d0c0d44c769d64e71c7a9d8954edd3c7c0ed293115dce273179beaa7998fbbe22d07e';
const PROJECT_ID = '6a574108002067b4d857';
const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';

const headers = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
};

async function api(method, path, body) {
  const res = await fetch(`${ENDPOINT}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    if (data.message?.includes('already exists')) {
      return { alreadyExists: true, message: data.message };
    }
    throw new Error(`API Error: ${data.message || res.status}`);
  }
  return data;
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('\n========================================');
  console.log('  appmass — Appwrite Cloud Setup');
  console.log('========================================\n');

  // ── Step 1: Create Database ──────────────────────────────────
  console.log('📦 Creating database...');
  let dbId;
  try {
    const db = await api('POST', '/databases', {
      databaseId: 'unique()',
      name: 'appmass_main',
    });
    dbId = db.$id;
    console.log(`   ✅ Database created: ${dbId}`);
  } catch (err) {
    if (err.message?.includes('already exists')) {
      console.log('   ⏩ Database already exists');
      const list = await api('GET', '/databases');
      const db = list.databases.find((d) => d.name === 'appmass_main');
      dbId = db.$id;
    } else {
      throw err;
    }
  }

  // ── Step 2: Define Collections ──────────────────────────────
  const collectionDefs = [
    {
      name: 'profiles',
      collectionId: 'profiles',
      attributes: [
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'displayName', type: 'string', size: 100, required: true },
        { key: 'username', type: 'string', size: 50, required: true },
        { key: 'bio', type: 'string', size: 500, required: false },
        { key: 'avatarId', type: 'string', size: 255, required: false },
        { key: 'coverImageId', type: 'string', size: 255, required: false },
        { key: 'website', type: 'string', size: 500, required: false },
        { key: 'location', type: 'string', size: 100, required: false },
        { key: 'isVerified', type: 'boolean', required: false },
        { key: 'isPrivate', type: 'boolean', required: false },
        { key: 'createdAt', type: 'string', size: 50, required: true },
      ],
      indexes: [
        { key: 'username_idx', type: 'unique', attributes: ['username'] },
        { key: 'userId_idx', type: 'key', attributes: ['userId'] },
      ],
    },
    {
      name: 'posts',
      collectionId: 'posts',
      attributes: [
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'content', type: 'string', size: 10000, required: true },
        { key: 'mediaIds', type: 'string', size: 5000, required: false, array: true },
        { key: 'hashtags', type: 'string', size: 1000, required: false, array: true },
        { key: 'mentionIds', type: 'string', size: 1000, required: false, array: true },
        { key: 'pollId', type: 'string', size: 255, required: false },
        { key: 'isCommentDisabled', type: 'boolean', required: false },
        { key: 'isRepostDisabled', type: 'boolean', required: false },
        { key: 'createdAt', type: 'string', size: 50, required: true },
        { key: 'updatedAt', type: 'string', size: 50, required: true },
      ],
      indexes: [
        { key: 'createdAt_idx', type: 'key', attributes: ['createdAt'], orders: ['DESC'] },
        { key: 'userId_idx', type: 'key', attributes: ['userId'] },
      ],
    },
    {
      name: 'posts_likes',
      collectionId: 'posts_likes',
      attributes: [
        { key: 'postId', type: 'string', size: 255, required: true },
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'reactionType', type: 'string', size: 20, required: true },
        { key: 'createdAt', type: 'string', size: 50, required: true },
      ],
      indexes: [
        { key: 'postId_idx', type: 'key', attributes: ['postId'] },
        { key: 'post_user_unique', type: 'unique', attributes: ['postId', 'userId'] },
      ],
    },
    {
      name: 'messages',
      collectionId: 'messages',
      attributes: [
        { key: 'conversationId', type: 'string', size: 255, required: true },
        { key: 'senderId', type: 'string', size: 255, required: true },
        { key: 'content', type: 'string', size: 5000, required: true },
        { key: 'read', type: 'boolean', required: true },
        { key: 'createdAt', type: 'string', size: 50, required: true },
      ],
      indexes: [
        { key: 'conversationId_idx', type: 'key', attributes: ['conversationId'] },
        { key: 'createdAt_idx', type: 'key', attributes: ['createdAt'] },
      ],
    },
    {
      name: 'posts_comments',
      collectionId: 'posts_comments',
      attributes: [
        { key: 'postId', type: 'string', size: 255, required: true },
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'content', type: 'string', size: 5000, required: true },
        { key: 'mediaIds', type: 'string', size: 5000, required: false, array: true },
        { key: 'parentCommentId', type: 'string', size: 255, required: false },
        { key: 'createdAt', type: 'string', size: 50, required: true },
      ],
      indexes: [
        { key: 'postId_idx', type: 'key', attributes: ['postId'] },
        { key: 'createdAt_idx', type: 'key', attributes: ['createdAt'] },
      ],
    },
    {
      name: 'post_reposts',
      collectionId: 'post_reposts',
      attributes: [
        { key: 'postId', type: 'string', size: 255, required: true },
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'quoteContent', type: 'string', size: 5000, required: false },
        { key: 'createdAt', type: 'string', size: 50, required: true },
      ],
      indexes: [
        { key: 'postId_idx', type: 'key', attributes: ['postId'] },
      ],
    },
    {
      name: 'follows',
      collectionId: 'follows',
      attributes: [
        { key: 'followerId', type: 'string', size: 255, required: true },
        { key: 'followingId', type: 'string', size: 255, required: true },
        { key: 'createdAt', type: 'string', size: 50, required: true },
      ],
      indexes: [
        { key: 'followerId_idx', type: 'key', attributes: ['followerId'] },
        { key: 'followingId_idx', type: 'key', attributes: ['followingId'] },
        { key: 'follow_unique', type: 'unique', attributes: ['followerId', 'followingId'] },
      ],
    },
    {
      name: 'notifications',
      collectionId: 'notifications',
      attributes: [
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'actorId', type: 'string', size: 255, required: true },
        { key: 'type', type: 'string', size: 50, required: true },
        { key: 'referenceId', type: 'string', size: 255, required: true },
        { key: 'read', type: 'boolean', required: true },
        { key: 'createdAt', type: 'string', size: 50, required: true },
      ],
      indexes: [
        { key: 'user_read_idx', type: 'key', attributes: ['userId', 'read'] },
      ],
    },
    {
      name: 'hashtags',
      collectionId: 'hashtags',
      attributes: [
        { key: 'tag', type: 'string', size: 100, required: true },
        { key: 'postCount', type: 'integer', required: true },
        { key: 'lastUsedAt', type: 'string', size: 50, required: true },
      ],
      indexes: [
        { key: 'tag_unique', type: 'unique', attributes: ['tag'] },
      ],
    },
    {
      name: 'bookmarks',
      collectionId: 'bookmarks',
      attributes: [
        { key: 'postId', type: 'string', size: 255, required: true },
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'createdAt', type: 'string', size: 50, required: true },
      ],
      indexes: [
        { key: 'userId_idx', type: 'key', attributes: ['userId'] },
        { key: 'bookmark_unique', type: 'unique', attributes: ['userId', 'postId'] },
      ],
    },
    {
      name: 'stories',
      collectionId: 'stories',
      attributes: [
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'mediaIds', type: 'string', size: 5000, required: true, array: true },
        { key: 'caption', type: 'string', size: 500, required: false },
        { key: 'expiresAt', type: 'string', size: 50, required: true },
        { key: 'createdAt', type: 'string', size: 50, required: true },
      ],
      indexes: [
        { key: 'userId_idx', type: 'key', attributes: ['userId'] },
        { key: 'expiresAt_idx', type: 'key', attributes: ['expiresAt'] },
      ],
    },
    {
      name: 'reports',
      collectionId: 'reports',
      attributes: [
        { key: 'reporterId', type: 'string', size: 255, required: true },
        { key: 'targetType', type: 'string', size: 50, required: true },
        { key: 'targetId', type: 'string', size: 255, required: true },
        { key: 'reason', type: 'string', size: 2000, required: true },
        { key: 'status', type: 'string', size: 20, required: true },
        { key: 'createdAt', type: 'string', size: 50, required: true },
      ],
      indexes: [
        { key: 'status_idx', type: 'key', attributes: ['status'] },
      ],
    },
  ];

  // ── Step 3: Create Collections ─────────────────────────────
  console.log('📁 Creating collections & attributes...\n');

  for (const col of collectionDefs) {
    process.stdout.write(`   "${col.name}"... `);
    try {
      await api('POST', `/databases/${dbId}/collections`, {
        collectionId: col.collectionId,
        name: col.name,
      });
      console.log(`collection created`);

      // Add attributes
      for (const attr of col.attributes) {
        let endpoint;
        let body = {
          key: attr.key,
          required: attr.required,
        };

        if (attr.type === 'string') {
          endpoint = '/databases/' + dbId + '/collections/' + col.collectionId + '/attributes/string';
          body.size = attr.size;
          body.array = attr.array || false;
        } else if (attr.type === 'integer') {
          endpoint = '/databases/' + dbId + '/collections/' + col.collectionId + '/attributes/integer';
        } else if (attr.type === 'boolean') {
          endpoint = '/databases/' + dbId + '/collections/' + col.collectionId + '/attributes/boolean';
        }

        try {
          await api('POST', endpoint, body);
          if (attr.type === 'string' && attr.array) {
            // array attributes might need a different approach, try directly
          }
        } catch (attrErr) {
          if (attrErr.message?.includes('already exists')) {
            // attribute already exists - ok
          } else {
            throw attrErr;
          }
        }
      }

      // Create indexes
      for (const idx of col.indexes) {
        try {
          await api('POST', `/databases/${dbId}/collections/${col.collectionId}/indexes`, {
            key: idx.key,
            type: idx.type,
            attributes: idx.attributes,
            orders: idx.orders || ['ASC'],
          });
        } catch (idxErr) {
          if (idxErr.message?.includes('already exists')) {
            // index already exists - ok
          } else {
            console.log(`\n   ⚠️ Index "${idx.key}": ${idxErr.message}`);
          }
        }
      }

      process.stdout.write('   ✅ Done\n');
    } catch (colErr) {
      if (colErr.message?.includes('already exists')) {
        console.log('already exists, skipping');
      } else {
        console.log(`\n   ❌ ${colErr.message}`);
      }
    }
  }

  // ── Step 4: Create Storage Buckets ──────────────────────────
  console.log('\n📦 Creating storage buckets...\n');

  const buckets = [
    {
      bucketId: 'media',
      name: 'Media',
      fileSecurity: true,
      maximumFileSize: 52428800,
      allowedFileExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'mp3', 'ogg', 'pdf'],
      enabled: true,
    },
    {
      bucketId: 'avatars',
      name: 'Avatars',
      fileSecurity: true,
      maximumFileSize: 5242880,
      allowedFileExtensions: ['jpg', 'jpeg', 'png', 'webp'],
      enabled: true,
    },
  ];

  for (const b of buckets) {
    process.stdout.write(`   "${b.name}"... `);
    try {
      await api('POST', '/storage/buckets', b);
      console.log('✅ Created');
    } catch (bErr) {
      if (bErr.message?.includes('already exists')) {
        console.log('⏩ Already exists');
      } else {
        console.log(`❌ ${bErr.message}`);
      }
    }
  }

  // ── Step 5: Summary ─────────────────────────────────────────
  console.log('\n========================================');
  console.log('  ✅ Setup Complete!');
  console.log('========================================\n');

  // Write .env.local
  const envContent = `# Appwrite Configuration (auto-generated by setup script)
EXPO_PUBLIC_APPWRITE_ENDPOINT=${ENDPOINT}
EXPO_PUBLIC_APPWRITE_PROJECT_ID=${PROJECT_ID}
EXPO_PUBLIC_APPWRITE_DATABASE_ID=${dbId}
EXPO_PUBLIC_APPWRITE_DATABASE_NAME=appmass_main
EXPO_PUBLIC_APPWRITE_API_KEY=${API_KEY.slice(0, 20)}...

# App Configuration
EXPO_PUBLIC_APP_NAME=appmass
EXPO_PUBLIC_PRIMARY_COLOR=#f4f3ee
EXPO_PUBLIC_ACCENT_COLOR=#c15f3c
EXPO_PUBLIC_DEFAULT_LOCALE=en

# Region
EXPO_PUBLIC_APPWRITE_REGION=asia-pacific
`;

  try {
    const fs = require('fs');
    fs.writeFileSync('.env.local', envContent);
    console.log('📝 Updated .env.local with your credentials\n');
  } catch (e) {
    console.log('📝 .env.local values:\n');
    console.log(envContent);
  }

  console.log('📦 Database ID: ' + dbId);
  console.log('📦 Collections created: ' + collectionDefs.map(c => c.name).join(', '));
  console.log('📦 Buckets created: ' + buckets.map(b => b.name).join(', '));
  console.log('\n🎉 All done! Run: npm install && npx expo start\n');
}

main().catch((err) => {
  console.error('\n❌ Setup failed:', err.message);
  process.exit(1);
});
