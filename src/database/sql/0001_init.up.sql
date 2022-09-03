create table users
(
    id                 uuid primary key,
    creation_timestamp timestamptz default (now() at time zone 'utc'),
    name               varchar(255) not null
);

create table posts
(
    id                 uuid primary key,
    creation_timestamp timestamptz default (now() at time zone 'utc'),
    owner_id           uuid references users (id) not null,
    title              varchar(255)               not null,
    body               varchar(1000)
);

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
    post_id            uuid references posts (id),
    tag_id             uuid references tags (id)
);

create table image_tags
(
    id                 uuid primary key,
    creation_timestamp timestamptz default (now() at time zone 'utc'),
    image_id           uuid references images (id),
    tag_id             uuid references tags (id)
);
