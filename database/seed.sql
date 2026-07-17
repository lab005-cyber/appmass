-- ============================================================
-- AppMass Seed Data
-- ============================================================

-- Sample Users
INSERT INTO profiles (id, email, username, display_name, avatar_url, bio, website, location, is_verified, is_private) VALUES
('a0000000-0000-0000-0000-000000000001', 'alex@example.com',    'alexcodes',    'Alex Chen',       NULL, 'Full-stack dev & coffee addict. Building the future one commit at a time.',       'https://alexchen.dev',     'San Francisco, CA', TRUE,  FALSE),
('a0000000-0000-0000-0000-000000000002', 'jordan@example.com',  'jordanart',    'Jordan Rivera',   NULL, 'Digital artist & illustrator. NFTs are just jpegs with attitude.',                'https://jordanart.io',     'Austin, TX',        FALSE, FALSE),
('a0000000-0000-0000-0000-000000000003', 'sam@example.com',     'sam_writes',   'Sam Taylor',      NULL, 'Tech journalist & newsletter author. DM for pitches.',                            'https://samtaylor.xyz',    'New York, NY',      TRUE,  FALSE),
('a0000000-0000-0000-0000-000000000004', 'priya@example.com',   'priyadesigns', 'Priya Kapoor',    NULL, 'UX designer @ BigCo. Design systems are my jam.',                                 'https://priyakapoor.design','Seattle, WA',      FALSE, FALSE),
('a0000000-0000-0000-0000-000000000005', 'marcus@example.com',  'marcus_dev',   'Marcus Johnson',  NULL, 'iOS engineer. SwiftUI enthusiast. Running on caffeine and xcode crashes.',         NULL,                       'Chicago, IL',      FALSE, TRUE);

-- Sample Posts
INSERT INTO posts (id, author_id, content, post_type, like_count, comment_count, repost_count, created_at) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
 'Just shipped a new feature that reduces bundle size by 40% using tree-shaking. Feeling good about this one. 🚀',
 'text', 42, 8, 12, NOW() - INTERVAL '2 hours'),

('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001',
 'Hot take: TypeScript is not just JavaScript with types — it''s a completely different mindset for building reliable software.',
 'text', 18, 5, 3, NOW() - INTERVAL '5 hours'),

('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002',
 'My latest piece — a cyberpunk-inspired cityscape. Took about 30 hours across two weeks. Thoughts?',
 'image', 156, 24, 38, NOW() - INTERVAL '1 day'),

('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002',
 'Drew this during today''s coffee break. Sometimes the best ideas come when you''re not trying. ☕✏️',
 'image', 87, 12, 15, NOW() - INTERVAL '6 hours'),

('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003',
 'Thread: Everything I learned covering AI conferences this year. 1/12',
 'text', 234, 45, 89, NOW() - INTERVAL '3 hours'),

('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000003',
 'The real AI bubble isn''t the technology — it''s the number of startups building the same GPT wrapper and calling it a "platform."',
 'text', 67, 18, 22, NOW() - INTERVAL '8 hours'),

('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000004',
 'Just redesigned our checkout flow. 3 fewer steps, 12% higher conversion. Design matters. 📊',
 'text', 53, 9, 14, NOW() - INTERVAL '1 day'),

('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000004',
 'New design system component: the adaptive input field. Auto-adjusts height, shows character count, inline validation. All in ~150 lines of SwiftUI.',
 'image', 91, 16, 27, NOW() - INTERVAL '4 hours'),

('b0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000005',
 'Just hit 100 consecutive days on my coding streak. The secret? Showing up even when the code is terrible. You can fix bad code, but you can''t fix zero code.',
 'text', 312, 38, 76, NOW() - INTERVAL '12 hours'),

('b0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000005',
 'Anyone else spend more time configuring their dev environment than actually writing code? Just me? Cool. 😅',
 'text', 45, 12, 5, NOW() - INTERVAL '1 hour');

-- Sample Likes
INSERT INTO post_likes (user_id, post_id) VALUES
('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001'),
('a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001'),
('a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001'),
('a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001'),
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003'),
('a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003'),
('a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000003'),
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005'),
('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000005'),
('a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000005'),
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000007'),
('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000007'),
('a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000009'),
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009'),
('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000009');

-- Sample Comments
INSERT INTO post_comments (user_id, post_id, content, created_at) VALUES
('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001',
 'That''s awesome! What tools did you use to measure the bundle impact?', NOW() - INTERVAL '90 minutes'),
('a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001',
 'Love seeing performance wins like this. Webpack or Vite?', NOW() - INTERVAL '80 minutes'),
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003',
 'The lighting in this is incredible. What software are you using?', NOW() - INTERVAL '23 hours'),
('a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000003',
 'This gives me Blade Runner vibes. Love the color palette!', NOW() - INTERVAL '22 hours'),
('a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009',
 'Day 100 is huge. Congrats! What language have you been focusing on?', NOW() - INTERVAL '11 hours'),
('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000009',
 '"You can fix bad code but you can''t fix zero code" — printing this on my wall.', NOW() - INTERVAL '10 hours');

-- Sample Follows
INSERT INTO follows (follower_id, followee_id) VALUES
('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002'),
('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003'),
('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004'),
('a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001'),
('a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003'),
('a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001'),
('a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004'),
('a0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001'),
('a0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002'),
('a0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000003'),
('a0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001'),
('a0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003');

-- Sample Hashtags
INSERT INTO hashtags (id, tag) VALUES
('c0000000-0000-0000-0000-000000000001', 'typescript'),
('c0000000-0000-0000-0000-000000000002', 'webdev'),
('c0000000-0000-0000-0000-000000000003', 'design'),
('c0000000-0000-0000-0000-000000000004', 'ai'),
('c0000000-0000-0000-0000-000000000005', 'art'),
('c0000000-0000-0000-0000-000000000006', 'swiftui'),
('c0000000-0000-0000-0000-000000000007', 'coding'),
('c0000000-0000-0000-0000-000000000008', 'productivity'),
('c0000000-0000-0000-0000-000000000009', 'uiux'),
('c0000000-0000-0000-0000-000000000010', 'tech');

-- Post-Hashtag associations
INSERT INTO post_hashtags (post_id, hashtag_id) VALUES
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002'),
('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000005'),
('b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000005'),
('b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000003'),
('b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000004'),
('b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000010'),
('b0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000004'),
('b0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000010'),
('b0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000003'),
('b0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000009'),
('b0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000006'),
('b0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000003'),
('b0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000007'),
('b0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000008'),
('b0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000007'),
('b0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000008');

-- Sample Notifications
INSERT INTO notifications (recipient_id, actor_id, type, entity_id, entity_type, message) VALUES
('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'like',    'b0000000-0000-0000-0000-000000000001', 'post',     'Jordan Rivera liked your post'),
('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'follow',  NULL,       NULL,       'Sam Taylor started following you'),
('a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'comment', 'b0000000-0000-0000-0000-000000000005', 'post',     'Alex Chen commented on your thread'),
('a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', 'like',    'b0000000-0000-0000-0000-000000000003', 'post',     'Priya Kapoor liked your artwork');

-- Sample Bookmark
INSERT INTO bookmarks (user_id, post_id) VALUES
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003'),
('a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000009');

-- Sample Story
INSERT INTO stories (id, user_id, media_url, caption) VALUES
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', NULL, 'Late night coding session 🦉'),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', NULL, 'At the AI conference today!');

-- Sample Story View
INSERT INTO story_views (story_id, user_id) VALUES
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002'),
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003'),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001');
