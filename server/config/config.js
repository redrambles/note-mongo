var env = process.env.NODE_ENV || 'development'; // (Heroku uses NODE_ENV and test env is set in package.json)
console.log('env **** ', env);

if (env === 'development' || env === 'test') {
    var config = require('./config.json');
    var envConfig = config[env]; // test or development

   Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
   })
}


// if (env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'; // it test env, use separate db
// }