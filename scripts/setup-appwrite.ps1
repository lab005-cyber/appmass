Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  appmass — Appwrite Cloud Setup (PS)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$ENDPOINT = "https://cloud.appwrite.io/v1"
$PROJECT_ID = "6a574108002067b4d857"
$API_KEY = "standard_ce4f609771d5df0db7a29903b3d31ac1ec1fd680331c8e691f896ab68638e6f9e295db775b516c028b17d76d9d15d5e072b4405d8631431681d704fba912f83ecc0c20ee059847e7d6591d4372397d5122979941406dc0391a2b60d2076d0c0d44c769d64e71c7a9d8954edd3c7c0ed293115dce273179beaa7998fbbe22d07e"

$headers = @{
    "Content-Type" = "application/json"
    "X-Appwrite-Project" = $PROJECT_ID
    "X-Appwrite-Key" = $API_KEY
}

function Invoke-Appwrite {
    param($Method, $Path, $Body)
    $params = @{
        Uri = "$ENDPOINT$Path"
        Method = $Method
        Headers = $headers
    }
    if ($Body) { $params.Body = ($Body | ConvertTo-Json -Depth 10) }
    try {
        $res = Invoke-RestMethod @params
        return $res
    } catch {
        $err = $_.Exception.Response
        $reader = New-Object System.IO.StreamReader($err.GetResponseStream())
        $body = $reader.ReadToEnd() | ConvertFrom-Json
        if ($body.message -match "already exists") {
            return @{ alreadyExists = $true; message = $body.message }
        }
        Write-Host "  ERROR: $($body.message)" -ForegroundColor Red
        throw $body.message
    }
}

# Step 1: Create Database
Write-Host "`nCreating database..." -ForegroundColor Yellow
$db = Invoke-Appwrite -Method POST -Path "/databases" -Body @{ databaseId = "unique()"; name = "appmass_main" }
if ($db.alreadyExists) {
    Write-Host "  Database already exists, fetching ID..." -ForegroundColor Gray
    $list = Invoke-Appwrite -Method GET -Path "/databases"
    $db = $list.databases | Where-Object { $_.name -eq "appmass_main" } | Select-Object -First 1
}
$dbId = $db.'$id'
Write-Host "  Database ID: $dbId" -ForegroundColor Green

# Step 2: Create Collections
$collections = @(
    @{ name = "profiles"; collectionId = "profiles"; attributes = @(
        @{ key = "userId"; type = "string"; size = 255; required = $true },
        @{ key = "displayName"; type = "string"; size = 100; required = $true },
        @{ key = "username"; type = "string"; size = 50; required = $true },
        @{ key = "bio"; type = "string"; size = 500; required = $false },
        @{ key = "avatarId"; type = "string"; size = 255; required = $false },
        @{ key = "coverImageId"; type = "string"; size = 255; required = $false },
        @{ key = "website"; type = "string"; size = 500; required = $false },
        @{ key = "location"; type = "string"; size = 100; required = $false },
        @{ key = "isVerified"; type = "boolean"; required = $false },
        @{ key = "isPrivate"; type = "boolean"; required = $false },
        @{ key = "createdAt"; type = "string"; size = 50; required = $true }
    ); indexes = @(
        @{ key = "username_idx"; type = "unique"; attributes = @("username") },
        @{ key = "userId_idx"; type = "key"; attributes = @("userId") }
    )},
    @{ name = "posts"; collectionId = "posts"; attributes = @(
        @{ key = "userId"; type = "string"; size = 255; required = $true },
        @{ key = "content"; type = "string"; size = 10000; required = $true },
        @{ key = "mediaIds"; type = "string"; size = 5000; required = $false; array = $true },
        @{ key = "hashtags"; type = "string"; size = 1000; required = $false; array = $true },
        @{ key = "mentionIds"; type = "string"; size = 1000; required = $false; array = $true },
        @{ key = "pollId"; type = "string"; size = 255; required = $false },
        @{ key = "isCommentDisabled"; type = "boolean"; required = $false },
        @{ key = "isRepostDisabled"; type = "boolean"; required = $false },
        @{ key = "createdAt"; type = "string"; size = 50; required = $true },
        @{ key = "updatedAt"; type = "string"; size = 50; required = $true }
    ); indexes = @(
        @{ key = "createdAt_idx"; type = "key"; attributes = @("createdAt"); orders = @("DESC") },
        @{ key = "userId_idx"; type = "key"; attributes = @("userId") }
    )},
    @{ name = "post_likes"; collectionId = "post_likes"; attributes = @(
        @{ key = "postId"; type = "string"; size = 255; required = $true },
        @{ key = "userId"; type = "string"; size = 255; required = $true },
        @{ key = "reactionType"; type = "string"; size = 20; required = $true },
        @{ key = "createdAt"; type = "string"; size = 50; required = $true }
    ); indexes = @(
        @{ key = "postId_idx"; type = "key"; attributes = @("postId") },
        @{ key = "post_user_unique"; type = "unique"; attributes = @("postId", "userId") }
    )},
    @{ name = "post_comments"; collectionId = "post_comments"; attributes = @(
        @{ key = "postId"; type = "string"; size = 255; required = $true },
        @{ key = "userId"; type = "string"; size = 255; required = $true },
        @{ key = "content"; type = "string"; size = 5000; required = $true },
        @{ key = "mediaIds"; type = "string"; size = 5000; required = $false; array = $true },
        @{ key = "parentCommentId"; type = "string"; size = 255; required = $false },
        @{ key = "createdAt"; type = "string"; size = 50; required = $true }
    ); indexes = @(
        @{ key = "postId_idx"; type = "key"; attributes = @("postId") },
        @{ key = "createdAt_idx"; type = "key"; attributes = @("createdAt") }
    )},
    @{ name = "post_reposts"; collectionId = "post_reposts"; attributes = @(
        @{ key = "postId"; type = "string"; size = 255; required = $true },
        @{ key = "userId"; type = "string"; size = 255; required = $true },
        @{ key = "quoteContent"; type = "string"; size = 5000; required = $false },
        @{ key = "createdAt"; type = "string"; size = 50; required = $true }
    ); indexes = @(
        @{ key = "postId_idx"; type = "key"; attributes = @("postId") }
    )},
    @{ name = "follows"; collectionId = "follows"; attributes = @(
        @{ key = "followerId"; type = "string"; size = 255; required = $true },
        @{ key = "followingId"; type = "string"; size = 255; required = $true },
        @{ key = "createdAt"; type = "string"; size = 50; required = $true }
    ); indexes = @(
        @{ key = "followerId_idx"; type = "key"; attributes = @("followerId") },
        @{ key = "followingId_idx"; type = "key"; attributes = @("followingId") },
        @{ key = "follow_unique"; type = "unique"; attributes = @("followerId", "followingId") }
    )},
    @{ name = "notifications"; collectionId = "notifications"; attributes = @(
        @{ key = "userId"; type = "string"; size = 255; required = $true },
        @{ key = "actorId"; type = "string"; size = 255; required = $true },
        @{ key = "type"; type = "string"; size = 50; required = $true },
        @{ key = "referenceId"; type = "string"; size = 255; required = $true },
        @{ key = "read"; type = "boolean"; required = $true },
        @{ key = "createdAt"; type = "string"; size = 50; required = $true }
    ); indexes = @(
        @{ key = "user_read_idx"; type = "key"; attributes = @("userId", "read") }
    )},
    @{ name = "hashtags"; collectionId = "hashtags"; attributes = @(
        @{ key = "tag"; type = "string"; size = 100; required = $true },
        @{ key = "postCount"; type = "integer"; required = $true },
        @{ key = "lastUsedAt"; type = "string"; size = 50; required = $true }
    ); indexes = @(
        @{ key = "tag_unique"; type = "unique"; attributes = @("tag") }
    )},
    @{ name = "bookmarks"; collectionId = "bookmarks"; attributes = @(
        @{ key = "postId"; type = "string"; size = 255; required = $true },
        @{ key = "userId"; type = "string"; size = 255; required = $true },
        @{ key = "createdAt"; type = "string"; size = 50; required = $true }
    ); indexes = @(
        @{ key = "userId_idx"; type = "key"; attributes = @("userId") },
        @{ key = "bookmark_unique"; type = "unique"; attributes = @("userId", "postId") }
    )},
    @{ name = "stories"; collectionId = "stories"; attributes = @(
        @{ key = "userId"; type = "string"; size = 255; required = $true },
        @{ key = "mediaIds"; type = "string"; size = 5000; required = $true; array = $true },
        @{ key = "caption"; type = "string"; size = 500; required = $false },
        @{ key = "expiresAt"; type = "string"; size = 50; required = $true },
        @{ key = "createdAt"; type = "string"; size = 50; required = $true }
    ); indexes = @(
        @{ key = "userId_idx"; type = "key"; attributes = @("userId") },
        @{ key = "expiresAt_idx"; type = "key"; attributes = @("expiresAt") }
    )},
    @{ name = "reports"; collectionId = "reports"; attributes = @(
        @{ key = "reporterId"; type = "string"; size = 255; required = $true },
        @{ key = "targetType"; type = "string"; size = 50; required = $true },
        @{ key = "targetId"; type = "string"; size = 255; required = $true },
        @{ key = "reason"; type = "string"; size = 2000; required = $true },
        @{ key = "status"; type = "string"; size = 20; required = $true },
        @{ key = "createdAt"; type = "string"; size = 50; required = $true }
    ); indexes = @(
        @{ key = "status_idx"; type = "key"; attributes = @("status") }
    )}
)

Write-Host "`nCreating collections & attributes..." -ForegroundColor Yellow
foreach ($col in $collections) {
    Write-Host "  `"$($col.name)`"... " -NoNewline
    try {
        $c = Invoke-Appwrite -Method POST -Path "/databases/$dbId/collections" -Body @{ collectionId = $col.collectionId; name = $col.name }
        if ($c.alreadyExists) { Write-Host "already exists, " -NoNewline -ForegroundColor Gray }
        else { Write-Host "collection created, " -NoNewline }

        foreach ($attr in $col.attributes) {
            $typePath = if ($attr.type -eq "string") { "string" } elseif ($attr.type -eq "integer") { "integer" } else { "boolean" }
            $body = @{ key = $attr.key; required = $attr.required }
            if ($attr.type -eq "string") { $body.size = $attr.size; $body.array = if ($attr.array) { $true } else { $false } }
            try {
                Invoke-Appwrite -Method POST -Path "/databases/$dbId/collections/$($col.collectionId)/attributes/$typePath" -Body $body | Out-Null
            } catch { if ($_ -notmatch "already exists") { throw } }
        }

        foreach ($idx in $col.indexes) {
            $idxBody = @{ key = $idx.key; type = $idx.type; attributes = $idx.attributes; orders = if ($idx.orders) { $idx.orders } else { @("ASC") } }
            try {
                Invoke-Appwrite -Method POST -Path "/databases/$dbId/collections/$($col.collectionId)/indexes" -Body $idxBody | Out-Null
            } catch { if ($_ -notmatch "already exists") { throw } }
        }
        Write-Host "OK" -ForegroundColor Green
    } catch {
        Write-Host "FAILED: $_" -ForegroundColor Red
    }
}

# Step 3: Create Storage Buckets
Write-Host "`nCreating storage buckets..." -ForegroundColor Yellow
$buckets = @(
    @{ bucketId = "media"; name = "Media"; fileSecurity = $true; maximumFileSize = 52428800; allowedFileExtensions = @("jpg","jpeg","png","gif","webp","mp4","mov","mp3","ogg","pdf"); enabled = $true },
    @{ bucketId = "avatars"; name = "Avatars"; fileSecurity = $true; maximumFileSize = 5242880; allowedFileExtensions = @("jpg","jpeg","png","webp"); enabled = $true }
)
foreach ($b in $buckets) {
    Write-Host "  `"$($b.name)`"... " -NoNewline
    try {
        $r = Invoke-Appwrite -Method POST -Path "/storage/buckets" -Body $b
        if ($r.alreadyExists) { Write-Host "Already exists" -ForegroundColor Gray }
        else { Write-Host "Created" -ForegroundColor Green }
    } catch { Write-Host "FAILED: $_" -ForegroundColor Red }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host "Database ID: $dbId"
Write-Host "Run: npm install && npx expo start" -ForegroundColor Yellow
