CREATE TABLE board_favorite (
    board_pk BIGINT NOT NULL,
    member_pk BIGINT NOT NULL
);

ALTER TABLE board_favorite ADD PRIMARY KEY (board_pk, member_pk);
ALTER TABLE board_favorite ADD FOREIGN KEY (board_pk) REFERENCES board(id);
ALTER TABLE board_favorite ADD FOREIGN KEY (member_pk) REFERENCES member(id);


