import http from 'http';

import { migrate } from 'bak/orm/migrate';

// import { hello } from './hello';
//
// http.createServer(function (req, res) {
//   res.write(hello('world!')); //write a response
//   res.end();
// }).listen(3000, function(){
//   console.log("server start at port 3000");
// });


migrate().then(() => console.log('done'));
