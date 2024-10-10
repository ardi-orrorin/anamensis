DROP TABLE IF EXISTS chat_room_user CASCADE;
DROP TABLE IF EXISTS chat_message CASCADE;
DROP TABLE IF EXISTS chat_room CASCADE;

CREATE TABLE chat_room (
    id BIGINT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    host_id BIGINT NOT NULL,
    last_message VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE chat_room_user (
    chat_room_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL
);

CREATE TABLE chat_message (
    id BIGINT AUTO_INCREMENT,
    chat_room_id BIGINT NOT NULL,
    sender_user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);

-- create primary key
ALTER TABLE chat_room ADD CONSTRAINT chat_room_pk PRIMARY KEY (id);
ALTER TABLE chat_room_user ADD CONSTRAINT chat_room_user_pk PRIMARY KEY (chat_room_id, user_id);
ALTER TABLE chat_message ADD CONSTRAINT chat_message_pk PRIMARY KEY (id);

-- create foreign key
ALTER TABLE chat_room ADD CONSTRAINT chat_room_host_fk FOREIGN KEY (host_id) REFERENCES member(id);
ALTER TABLE chat_room_user ADD CONSTRAINT chat_room_user_chat_room_fk FOREIGN KEY (chat_room_id) REFERENCES chat_room(id);
ALTER TABLE chat_room_user ADD CONSTRAINT chat_room_user_user_fk FOREIGN KEY (user_id) REFERENCES member(id);
ALTER TABLE chat_message ADD CONSTRAINT chat_message_chat_room_fk FOREIGN KEY (chat_room_id) REFERENCES chat_room(id);
ALTER TABLE chat_message ADD CONSTRAINT chat_message_user_fk FOREIGN KEY (sender_user_id) REFERENCES member(id);

-- create index
CREATE INDEX chat_room_host_id_idx ON chat_room (host_id);
CREATE INDEX chat_room_updated_at_desc_idx ON chat_room (updated_at DESC);
CREATE INDEX chat_message_chat_room_id_idx ON chat_message (chat_room_id);
CREATE INDEX chat_message_created_at_desc_idx ON chat_message (created_at DESC);


