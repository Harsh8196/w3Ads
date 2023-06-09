# W3Ads Test Adserver

This test AdServer is based on the Eyevinn Test Adserver https://github.com/Eyevinn/test-adserver.git

## Requirements
- Node v12+

## Database
Right now the w3ads-adserver uses SxT (Space and Time) Database

## Usage 
- `git clone https://github.com/Harsh8196/w3Ads`
- `cd AdServer`
- `npm install`, then
- `npm start` to run the server.
- `npm run dev` to run the server in dev mode with nodemon listening to updates.

## Endpoints

- GET `/api/docs` to access the complete `Swagger` documentation.
- GET `/api/v1/sessions` to get list of sessions, newest first.
- GET `/api/v1/sessions/:sessionId` to get a specific session.
- DELETE `/api/v1/sessions/:sessionId` to remove a specific session.
- GET `/api/v1/sessions/:sessionId/tracking` to send tracking data to server through query parameters.
- GET `/api/v1/sessions/:sessionId/events` to get a list of all tracked events for a session.
- GET `/api/v1/sessions/:sessionId/vast` to get the VAST XML that was issued for a specific session.
- GET `/api/v1/users/userId` to get all sessions for a specific user, newest first.
- GET `/api/v1/vast` to create a session and get a VAST-XML file, may also use query parameters.
- GET `/api/v1/vmap` to create a session and get a VMAP-XML file, may also use query parameters.
- GET `/api/v1/ads` to get list of advertisement.
- POST `/api/v1/ads` to create a new Web3 advertisement also use query parameters.
- GET `/api/v1/ads/:companyName` to get list of advertisement for specific company.
- GET `/api/v1/eventInsight` to get list of event insight for all events.
- GET `/api/v1/creatorPaymentStatus` to get list of content creator's payment status.

## Environment variables

- `ADSERVER` Public hostname and port for service. Needed for tracking, defaults to `localhost:8080`.
- `HOST` To set the interface that the server listens to. Default is `localhost`.
- `PORT` To set the port that the server listens to. Default is `8080`.
- `BISCUIT_SESSION` To set the SxT BISCUIT for SESSIONS_TABLE_TEST
- `BISCUIT_EVENT` To set the SxT BISCUIT for EVENT_TABLE_TEST
- `BISCUIT_ADS` To set the SxT BISCUIT for ADS_TABLE_TEST
- `URL_DQL` To set the SxT DQL URL
- `URL_DML` To set the SxT DML URL
- `URL_REFRESH` To set the SxT REFRESH URL
- `REFRESH_TOKEN` To set the SxT REFRESH_TOKEN
- `ACCESS_TOKEN` To set the SxT ACCESS_TOKEN



## Table Query for SxT

- `Sessions_table_test` "CREATE TABLE ADSERVER.sessions_table_test(id UUID PRIMARY KEY,session_id varchar(255) NOT NULL ,user_id varchar(255) NOT NULL,ad_break_dur varchar(255) NOT NULL,created varchar(255) NOT NULL,host varchar(225) NOT NULL,cli_req varchar NOT NULL,response varchar NOT NULL,tracked_events varchar NOT NULL,content_creator varchar(255),publication_id varchar(255)) WITH \"public_key='',access_type=public_read\""

- `Events_table_test` "CREATE TABLE ADSERVER.events_table_test (id UUID PRIMARY KEY,session_id varchar(255) NOT NULL ,event_type varchar(255) NOT NULL,on_ads varchar(255) NOT NULL,issued_at varchar(255) NOT NULL,user_agent varchar(225) NOT NULL,content_creator varchar(225) NOT NULL,earning varchar(225) NOT NULL,is_paid varchar(255) NOT NULL) WITH \"public_key='',access_type=public_read\""

- `ads_table_test` "CREATE TABLE ADSERVER.ads_table_test (universal_id UUID PRIMARY KEY, id varchar(255) NOT NULL ,ads_name varchar(255) NOT NULL,url varchar NOT NULL,duration varchar(255) NOT NULL,bitrate varchar(10) NOT NULL,width varchar(5) NOT NULL,height varchar(5) NOT NULL,codec varchar(255) not null,category varchar(255) not null,budget varchar(255) not null, impression_bd varchar(255) not null, click_bd varchar(255) not null,ads_status varchar(255) not null,created_at varchar(255) not null,company varchar(255) not null) WITH \"public_key='',access_type=public_read\""


