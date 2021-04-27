const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');

module.exports = function localStrategy() {
    passport.use(new Strategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        }, (username, password, done) => {
            const url = 'mongodb://localhost:27017';
            const dbName = 'libraryApp';
            (async function mongo(){
                let client;

                try {
                    client = await MongoClient.connect(url);

                    debug('Connected correctly to server');

                    const db = client.db(dbName);
                    const col = db.collection('users');
                    // first issue:
                    // the nodemon didn't restart and pick up
                    //the changes you made to add the local passport strategy
                    // so next time, restart if u face weird issues and the code
                    // looks correctly
                    // also, ru
                    const users = await col.find().toArray();
                    debug(users);
                    const user = await col.findOne({ username });
                    debug(user);
                    debug(username);
                    debug(password);
// the error indicates it can't find the user, so it return nulls.
// do you have  user with the name jon? EH....not sure where is it
// open up your mongdob 
                    if(user.password === password) {
                        done(null, user)
                    } else {
                        done(null, false);
                    }
                }   catch (err) {
                    console.log(err.stack);
                }
                // Close connection
                client.close();
            }());
        }));        
};