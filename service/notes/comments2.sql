/*
 Pros:
 - guaranteed valid state: parent and child comment will belong to same post

 Cons:
 - potential for orphaned comments
 */

create table posts
(
    id uuid primary key
);

create table comments
(
    id                uuid primary key
);

create table comment_comments
(
    id                uuid primary key,
    parent_comment_id uuid references comments (id) not null,
    child_comment_id  uuid references comments (id) not null,
    unique (id, parent_comment_id)
);

create table post_comments
(
    id         uuid primary key,
    post_id    uuid references posts (id)    not null,
    comment_id uuid references comments (id) not null,
    unique (id, post_id)
);

