INSERT INTO point_code
       (id, name, point, is_use)
VALUES (13, 'q&a', 0, 1);

ALTER TABLE point_history ADD COLUMN value INT NOT NULL DEFAULT 0;