CREATE DATABASE help_request;
\c help_request

CREATE TABLE classes
(
  id SMALLSERIAL PRIMARY KEY,
  name VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE locations
(
  id SMALLSERIAL PRIMARY KEY,
  name VARCHAR(25) NOT NULL UNIQUE
);

CREATE TABLE helpers
(
  id SERIAL PRIMARY KEY,
  username VARCHAR(256) NOT NULL UNIQUE,
  fname VARCHAR(256) NOT NULL,
  lname VARCHAR(256) NOT NULL,
  pass_hash VARCHAR(256) NOT NULL
);

CREATE TABLE requests
(
  id BIGSERIAL PRIMARY KEY,
  fname VARCHAR(256) NOT NULL,
  lname VARCHAR(256) NOT NULL,
  class_id SMALLINT NOT NULL REFERENCES classes(id),
  description TEXT,
  contact VARCHAR(256),
  location_id SMALLINT NOT NULL REFERENCES locations(id)
);

CREATE TABLE current_requests
(
  id BIGSERIAL PRIMARY KEY,
  request_id BIGINT NOT NULL REFERENCES requests(id),
  started TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE serving_requests
(
  id BIGSERIAL PRIMARY KEY,
  request_id BIGINT NOT NULL REFERENCES requests(id),
  helper_id INT NOT NULL REFERENCES helpers(id),
  started TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO classes(name)
VALUES
('CS 124'),
('CS 165'),
('CS 235'),
('CS 213'),
('Other');

INSERT INTO locations(name)
VALUES
('CS Help Lab'),
('Remote');

INSERT INTO helpers(username, fname, lname, pass_hash)
VALUES
('lmjamie', 'Landon', 'Jamieson', '$2a$10$d/yqgmBAmWmvueCAqCEsQOewRnTcJQMM1dGjxxXm4dD0kkulICshG'),
('sburton', 'Brother', 'Burton', '$2a$10$0xuMLxGNo.53WYaSNet5g.9o3s362.gpjrJgA/aTw6ppwG1wvFxFG');
