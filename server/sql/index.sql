alter table anamensis.login_history drop index idx_login_history_create_at;
alter table anamensis.user drop index idx_user_create_at;
alter table anamensis.user drop index idx_user_is_user;

create index idx_login_history_create_at on anamensis.login_history(create_at);
create index idx_user_is_user on anamensis.user(is_use);
create index idx_user_create_at on anamensis.user(create_at);


select * from user where user_id = 'admin';