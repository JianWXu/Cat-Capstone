\echo 'Delete and recreate whiskurr db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE whiskurr;
CREATE DATABASE whiskurr;
\connect whiskurr

\i cat-schema.sql

\echo 'Delete and recreate whiskurr_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE whiskurr_test;
CREATE DATABASE whiskurr_test;
\connect whiskurr_test

\i cat-schema.sql
