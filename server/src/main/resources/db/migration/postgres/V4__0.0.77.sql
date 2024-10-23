ALTER TABLE anamensis.smtp_push_history
    DROP COLUMN IF EXISTS member_pk,
    DROP COLUMN IF EXISTS member_config_smtp_pk;

ALTER TABLE anamensis.smtp_push_history
    ADD COLUMN IF NOT EXISTS to_mail VARCHAR(255) NOT NULL,
    ADD COLUMN IF NOT EXISTS from_mail VARCHAR(255) NOT NULL;

ALTER TABLE anamensis.smtp_push_history
    RENAME COLUMN create_at TO created_at;

ALTER TABLE anamensis.point_code
    ADD COLUMN IF NOT EXISTS editable BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS init_value BIGINT NOT NULL DEFAULT 0;

DROP TABLE IF EXISTS anamensis.smtp_push_history_count;

DROP TABLE IF EXISTS anamensis.attendance;

UPDATE anamensis.point_code
   SET init_value = point;

INSERT INTO anamensis.point_code (id, name, point, init_value, is_use)
VALUES (14,'sign_up', 100,  100, true);

INSERT INTO system_settings (key, value, init_value, public)
VALUES ('REDIS', '{"enabled": false, "host": "localhost", "port": 6379}', '{"enabled": false, "host": "localhost", "port": 6379}', FALSE);



