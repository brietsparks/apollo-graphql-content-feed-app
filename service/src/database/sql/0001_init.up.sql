create table users
(
    id                 uuid primary key,
    creation_timestamp timestamptz default (now() at time zone 'utc'),
    name               varchar(255) not null
);

insert into users(id, name)
values ('00000000-0000-0000-0000-000000000000', 'Default User');

create table posts
(
    id                 uuid primary key,
    creation_timestamp timestamptz default (now() at time zone 'utc'),
    owner_id           uuid references users (id) not null,
    title              varchar(255)               not null,
    body               varchar(1000)
);

insert into posts(id, owner_id, title)
values ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'post 1');
insert into posts(id, owner_id, title)
values ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'post 2');
insert into posts(id, owner_id, title)
values ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'post 3');


create table images
(
    id                 uuid primary key,
    creation_timestamp timestamptz default (now() at time zone 'utc'),
    owner_id           uuid references users (id) not null,
    url                varchar(2048)              not null,
    caption            varchar(255)
);

create table tags
(
    id                 uuid primary key,
    creation_timestamp timestamptz default (now() at time zone 'utc'),
    name               varchar(100)
);

create table post_tags
(
    id                 uuid primary key,
    creation_timestamp timestamptz default (now() at time zone 'utc'),
    post_id            uuid references posts (id) not null,
    tag_id             uuid references tags (id)  not null
);

create table image_tags
(
    id                 uuid primary key,
    creation_timestamp timestamptz default (now() at time zone 'utc'),
    image_id           uuid references images (id) not null,
    tag_id             uuid references tags (id)   not null
);

create table comments
(
    id                 uuid primary key,
    creation_timestamp timestamptz default (now() at time zone 'utc'),
    owner_id           uuid references users (id) not null,
    body               varchar(255)
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

create table image_comments
(
    id         uuid primary key,
    image_id   uuid references images (id)   not null,
    comment_id uuid references comments (id) not null,
    unique (id, image_id)
)


