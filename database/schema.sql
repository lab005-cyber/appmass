-- ============================================================
-- AppMass Schema
-- Reference SQL schema (Appwrite is NoSQL, this documents the
-- relational structure for clarity and migrations)
-- ============================================================

-- Users / Profiles
CREATE TABLE profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    username        VARCHAR(50)  NOT NULL UNIQUE,
    display_name    VARCHAR(100),
    avatar_url      TEXT,
    bio             TEXT,
    website         TEXT,
    location        VARCHAR(100),
    is_verified     BOOLEAN DEFAULT FALSE,
    is_private      BOOLEAN DEFAULT FALSE,
    follower_count  INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    post_count      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_username ON profiles (username);
CREATE INDEX idx_profiles_email    ON profiles (email);

-- Posts
CREATE TYPE post_type AS ENUM ('text', 'image', 'video', 'poll');

CREATE TABLE posts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content         TEXT,
    media_urls      TEXT[],           -- array of image/video URLs
    post_type       post_type DEFAULT 'text',
    is_pinned       BOOLEAN DEFAULT FALSE,
    like_count      INTEGER DEFAULT 0,
    comment_count   INTEGER DEFAULT 0,
    repost_count    INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_author_id   ON posts (author_id);
CREATE INDEX idx_posts_created_at  ON posts (created_at DESC);

-- Post Likes
CREATE TABLE post_likes (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    post_id    UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, post_id)
);

CREATE INDEX idx_post_likes_user_id ON post_likes (user_id);
CREATE INDEX idx_post_likes_post_id ON post_likes (post_id);

-- Post Comments
CREATE TABLE post_comments (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    post_id    UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    parent_id  UUID REFERENCES post_comments(id) ON DELETE CASCADE,
    content    TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_post_comments_user_id   ON post_comments (user_id);
CREATE INDEX idx_post_comments_post_id   ON post_comments (post_id);
CREATE INDEX idx_post_comments_parent_id ON post_comments (parent_id);

-- Post Reposts
CREATE TABLE post_reposts (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    post_id    UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    quote_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, post_id)
);

CREATE INDEX idx_post_reposts_user_id ON post_reposts (user_id);
CREATE INDEX idx_post_reposts_post_id ON post_reposts (post_id);

-- Polls
CREATE TABLE polls (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    question    TEXT NOT NULL,
    expires_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_polls_post_id ON polls (post_id);

-- Poll Options
CREATE TABLE poll_options (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id   UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    label     TEXT NOT NULL,
    vote_count INTEGER DEFAULT 0
);

CREATE INDEX idx_poll_options_poll_id ON poll_options (poll_id);

-- Poll Votes
CREATE TABLE poll_votes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    poll_option_id  UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, poll_option_id)
);

CREATE INDEX idx_poll_votes_user_id         ON poll_votes (user_id);
CREATE INDEX idx_poll_votes_poll_option_id  ON poll_votes (poll_option_id);

-- Follows
CREATE TABLE follows (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    followee_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (follower_id, followee_id)
);

CREATE INDEX idx_follows_follower_id ON follows (follower_id);
CREATE INDEX idx_follows_followee_id ON follows (followee_id);

-- Bookmarks
CREATE TABLE bookmarks (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    post_id    UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, post_id)
);

CREATE INDEX idx_bookmarks_user_id ON bookmarks (user_id);
CREATE INDEX idx_bookmarks_post_id ON bookmarks (post_id);

-- Stories
CREATE TABLE stories (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    media_url  TEXT NOT NULL,
    caption    TEXT,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stories_user_id    ON stories (user_id);
CREATE INDEX idx_stories_expires_at ON stories (expires_at);

-- Story Views
CREATE TABLE story_views (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id  UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (story_id, user_id)
);

CREATE INDEX idx_story_views_story_id ON story_views (story_id);
CREATE INDEX idx_story_views_user_id  ON story_views (user_id);

-- Hashtags
CREATE TABLE hashtags (
    id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag   VARCHAR(100) NOT NULL UNIQUE
);

-- Post-Hashtag junction
CREATE TABLE post_hashtags (
    post_id    UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    hashtag_id UUID NOT NULL REFERENCES hashtags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, hashtag_id)
);

CREATE INDEX idx_post_hashtags_hashtag_id ON post_hashtags (hashtag_id);

-- Notifications
CREATE TYPE notification_type AS ENUM (
    'like', 'comment', 'follow', 'repost', 'mention',
    'story_like', 'poll_expired', 'new_follower'
);

CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    actor_id        UUID REFERENCES profiles(id) ON DELETE SET NULL,
    type            notification_type NOT NULL,
    entity_id       UUID,             -- polymorphic reference
    entity_type     VARCHAR(50),
    message         TEXT,
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient_id ON notifications (recipient_id);
CREATE INDEX idx_notifications_created_at   ON notifications (created_at DESC);

-- Blocks
CREATE TABLE blocks (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocker_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    blocked_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (blocker_id, blocked_id)
);

CREATE INDEX idx_blocks_blocker_id ON blocks (blocker_id);
CREATE INDEX idx_blocks_blocked_id ON blocks (blocked_id);

-- Reports
CREATE TYPE report_reason AS ENUM (
    'spam', 'harassment', 'hate_speech', 'nudity',
    'violence', 'false_information', 'other'
);

CREATE TABLE reports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reported_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    entity_id       UUID NOT NULL,
    entity_type     VARCHAR(50) NOT NULL,
    reason          report_reason NOT NULL,
    description     TEXT,
    is_resolved     BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_reporter_id ON reports (reporter_id);
CREATE INDEX idx_reports_reported_id ON reports (reported_id);

-- Ad Campaigns
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'ended');

CREATE TABLE ad_campaigns (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    advertiser_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    content         TEXT,
    media_url       TEXT,
    target_audience JSONB,
    budget          DECIMAL(12,2) NOT NULL,
    spent           DECIMAL(12,2) DEFAULT 0,
    impressions     INTEGER DEFAULT 0,
    clicks          INTEGER DEFAULT 0,
    status          campaign_status DEFAULT 'draft',
    starts_at       TIMESTAMPTZ,
    ends_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ad_campaigns_advertiser_id ON ad_campaigns (advertiser_id);
CREATE INDEX idx_ad_campaigns_status        ON ad_campaigns (status);
