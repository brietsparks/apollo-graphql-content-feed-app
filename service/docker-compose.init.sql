create database example_app;
create role appuser login password 'apppassword';
grant all privileges on database example_app to appuser;
