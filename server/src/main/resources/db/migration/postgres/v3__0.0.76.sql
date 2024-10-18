CREATE TABLE system_settings (
    id SERIAL,
    key VARCHAR(255) NOT NULL,
    value JSONB NOT NULL
);

ALTER TABLE system_settings ADD CONSTRAINT system_settings_pk PRIMARY KEY (id);
ALTER TABLE system_settings ADD CONSTRAINT system_settings_key_uq UNIQUE (key);

CREATE UNIQUE INDEX system_settings_key_idx ON system_settings (key);



