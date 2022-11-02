/*
 Pros:
 - no orphaned comments

 Cons:
 - potential for invalid state: parent and child might not belong to same post
 */

create table posts
(
    id uuid primary key
);

create table comments
(
    id                uuid primary key,
    post_id           uuid references posts (id) not null,
    parent_comment_id uuid references comments (id)
);

