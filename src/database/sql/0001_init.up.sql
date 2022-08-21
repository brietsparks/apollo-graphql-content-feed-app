create table users
(
    id                 uuid primary key,
    creation_timestamp timestamptz default (now() at time zone 'utc'),
    name               varchar(255) not null
);

create table projects
(
    id                 uuid primary key,
    creation_timestamp timestamptz default (now() at time zone 'utc'),
    -- owner_id            uuid not null references users(id), -- ...eventually
    name               varchar(100)
);

create table statuses
(
    id                 uuid primary key,
    creation_timestamp timestamptz default (now() at time zone 'utc'),
    project_id         uuid not null references projects (id),
    name               varchar(100)
);

create table issues
(
    id                 uuid primary key,
    creation_timestamp timestamptz default (now() at time zone 'utc'),
    assignee_id        uuid references users (id),
    status_id          uuid references statuses (id),
    name               varchar(100) not null,
    description        text
);

create table status_issues_priority
(
    status_id        uuid primary key references statuses(id),
    ranked_issue_ids uuid[] not null
);

create table tags
(
    id                 uuid primary key,
    creation_timestamp timestamptz default (now() at time zone 'utc'),
    name               varchar(100)
);

create table issue_tags
(
    id                 uuid primary key,
    creation_timestamp timestamptz default (now() at time zone 'utc'),
    issue_id           uuid not null references issues (id),
    tag_id             uuid not null references tags (id),
    unique (issue_id, tag_id)
);

create table comments
(
    id                 uuid primary key,
    creation_timestamp timestamptz default (now() at time zone 'utc'),
    author_id          uuid not null references users (id),
    issue_id           uuid not null references issues (id),
    message            varchar(200)
);


