//Http server that keeps track of a list of friends
//Works with streams of data
//and outputs some HTML 


const http = require('http'); // built in module

const PORT = 3000;

const server = http.createServer();

const friends = [
  {
    id: 0,
    name: 'Nikola Tesla',
  },
  {
    id: 1,
    name: 'Sir Isaac Newton',
  },
  {
    id: 2,
    name: 'Albert Einstein',
  }
];
// *Example Post request ran on JS console at localhost3000
// fetch('http://localhost:3000/friends', {
//     method:'POST',
//     body: JSON.stringify({ id: 3, name: 'Ryan Dahl' })
// })
// If we refresh it's gone because its not in a database. It's living in an array in memory

server.on('request', (req, res) => { // we read from the request and write to the response (req, res) readbleable stream and writable stream
  const items = req.url.split('/');
  // /friends/2 => ['', 'friends', '2']
  // /friends/
  if (req.method === 'POST' && items[1] === 'friends') {
    req.on('data', (data) => { //req object is a readable stream so we can use the on() listener. But remember that it is in the form of bytes. 
      const friend = data.toString(); //The JSON that is being passed from the browser to our server is being received as a buffer, which we then convert to a string.
      console.log('Request:', friend);
      friends.push(JSON.parse(friend)); // Therefore we have to convert it back to an object so we can add it to our list of friends
    });
    req.pipe(res); // we pass in some JSON data to our req(readable stream) and pipe it to our res(writable stream) => readable.pipe(writable)
    // don't have to use the end() because the response ends whenever the request ends when we use pipe
  } else if (req.method === 'GET' && items[1] === 'friends') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    if (items.length === 3) { //Usually we do not hardcode the url length like this
      const friendIndex = Number(items[2]); // ['', 'friends', '2'] => index 2. Convert to number since it is in string form
      res.end(JSON.stringify(friends[friendIndex]));
    } else {
      res.end(JSON.stringify(friends));
    }
  } else if (req.method === 'GET' && items[1] === 'messages') {
    res.setHeader('Content-Type', 'text/html'); //We can write HTML tags
    res.write('<html>');
    res.write('<body>');
    res.write('<ul>');
    res.write('<li>Hello Isaac!</li>');
    res.write('<li>What are your thoughts on astronomy?</li>');
    res.write('</ul>');
    res.write('</body>');
    res.write('</html>');
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
}); //127.0.0.1 => localhost