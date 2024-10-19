DROP TABLE IF EXISTS member_config_smtp CASCADE ;

CREATE TABLE system_settings (
    id SERIAL,
    key VARCHAR(255) NOT NULL,
    value JSONB NOT NULL,
    init_value JSONB NOT NULL
);

ALTER TABLE system_settings ADD CONSTRAINT system_settings_pk PRIMARY KEY (id);
ALTER TABLE system_settings ADD CONSTRAINT system_settings_key_uq UNIQUE (key);

CREATE UNIQUE INDEX system_settings_key_idx ON system_settings (key);

INSERT INTO system_settings (key, value, init_value)
VALUES ('SMTP', '{"host": "", "port": 587, "username": "", "password": ""}', '{"host": "", "port": 587, "username": "", "password": ""}');