\echo 'Delete and recreate cat_cap db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE cat_cap;
CREATE DATABASE cat_cap;
\connect cat_cap

\i cat-schema.sql

\echo 'Delete and recreate cat_cap_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE cat_cap_test;
CREATE DATABASE cat_cap_test;
\connect cat_cap_test

\i cat_cap.sql
