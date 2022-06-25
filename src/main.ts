import http from 'http';

import { hello } from './hello';

http.createServer(function (req, res) {
  res.write(hello('world!')); //write a response
  res.end();
}).listen(3000, function(){
  console.log("server start at port 3000");
});
