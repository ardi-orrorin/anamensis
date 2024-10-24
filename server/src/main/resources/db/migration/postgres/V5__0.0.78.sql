CREATE TABLE job_execution (
    job_name VARCHAR(255) NOT NULL,
    status VARCHAR(100) NOT NULL
);

ALTER TABLE job_execution ADD CONSTRAINT job_name_pk PRIMARY KEY (job_name);

INSERT INTO job_execution (job_name, status)
VALUES ('board-index-job', 'READY'),
       ('dummy-file-delete-job', 'READY');

INSERT INTO system_settings (key, value, init_value, public)
VALUES ('TRIGGER', '{"dummy-file-delete-job-trigger": {"enabled": false, "cron": "0 0 23 * * ?"}}', '{"dummy-file-delete-job-trigger": {"enabled": false, "cron": "0 0 23 * * ?"}}', FALSE);