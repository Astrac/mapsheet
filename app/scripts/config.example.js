'use strict';

angular.module('mapsheetApp')
  .value('googleClientId', 'your-google-client-id') // <- Put here your client id
  .value('googleScope', 'https://spreadsheets.google.com/feeds https://www.googleapis.com/auth/userinfo.email')
;
