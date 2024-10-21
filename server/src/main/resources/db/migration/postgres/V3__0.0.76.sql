DROP TABLE IF EXISTS member_config_smtp CASCADE ;
ALTER TABLE member DROP COLUMN IF EXISTS email_verified;
DROP TABLE IF EXISTS system_settings CASCADE ;

CREATE TABLE system_settings (
    id SERIAL,
    key VARCHAR(255) NOT NULL,
    value JSONB NOT NULL,
    init_value JSONB NOT NULL,
    public BOOLEAN DEFAULT FALSE
);

ALTER TABLE member ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;

ALTER TABLE system_settings ADD CONSTRAINT system_settings_pk PRIMARY KEY (id);
ALTER TABLE system_settings ADD CONSTRAINT system_settings_key_uq UNIQUE (key);

CREATE UNIQUE INDEX system_settings_key_idx ON system_settings (key);

INSERT INTO system_settings (key, value, init_value, public)
VALUES ('SMTP', '{"enabled":false, "host": "", "port": 587, "username": "", "password": ""}', '{"enabled":false, "host": "", "port": 587, "username": "", "password": ""}', FALSE),
       ('SIGN_UP','{"enabled": false,"emailVerification": false}', '{"enabled": false, "emailVerification": false}', TRUE),
       ('LOGIN', '{"emailAuth": false}','{"emailAuth": false}', TRUE),
       ('OAUTH', '{"kakao": {"clientId": "", "clientSecret": "", "enabled": false}, "github": {"clientId": "", "clientSecret": "", "enabled": false}, "naver": {"clientId": "", "clientSecret": "", "enabled": false}, "google": {"clientId": "", "clientSecret": "", "enabled": false}, "custom": {"clientId": "", "clientSecret": "", "url": "", "enabled": false}}', '{"kakao": {"clientId": "", "clientSecret": "", "enabled": false}, "github": {"clientId": "", "clientSecret": "", "enabled": false}, "naver": {"clientId": "", "clientSecret": "", "enabled": false}, "google": {"clientId": "", "clientSecret": "", "enabled": false}, "custom": {"clientId": "", "clientSecret": "", "url": "", "enabled": false}}', FALSE),
       ('SITE', '{"domain": "localhost:3000", "ssl": false, "cdnUrl": "/files"}', '{"domain": "localhost:3000", "ssl": false, "cdnUrl": "/files"}', TRUE);
