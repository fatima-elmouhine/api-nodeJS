const express = require('express');
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const app = express();
const usersRouter = require('./routes/user');
const groupsRouter = require('./routes/group');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

require('dotenv').config();

app.use(helmet());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
function useSwaggerUIAuthStoragePlugin() {
    /* eslint-disable */
    // prettier-ignore
    const afterLoad = function(ui) {
      // NOTE: Code inside this afterLoad function will run in the browser!
      //
      // **Therefore, you cannot use an closure variables in here!**
      // Also you should follow ES5 coding style.
      //
      // See: https://github.com/scottie1984/swagger-ui-express/blob/master/index.js#L239
      //
      // Other Notes:
      // See https://github.com/scottie1984/swagger-ui-express/issues/44
      // See https://github.com/swagger-api/swagger-ui/blob/master/src/core/system.js#L344
      // See https://github.com/swagger-api/swagger-ui/issues/2915#issuecomment-297405865
  
      var AUTH_SCHEME = "AuthJWT";
      // var swaggerOptions = this;
      var currentAuthToken = undefined;
  
      setTimeout(function() {
        // Restore auth token from localStorage, if any.
        var token = localStorage.getItem(AUTH_SCHEME);
        if (token) {
          setAuthToken(token);
          console.log("Restored " + AUTH_SCHEME + " token from localStorage.");
        }
        // Start polling ui.getState() to see if the user changed tokens.
        setTimeout(checkForNewLogin, 3000);
      }, 1000);
  
      function checkForNewLogin() {
        var stateToken = getAuthTokenFromState();
        if (stateToken !== currentAuthToken) {
          console.log("Saved " + AUTH_SCHEME + " token to localStorage.");
          if (stateToken) {
            localStorage.setItem(AUTH_SCHEME, stateToken);
          } else {
            localStorage.removeItem(AUTH_SCHEME);
          }
          currentAuthToken = stateToken;
        }
        // Continue checking every second...
        setTimeout(checkForNewLogin, 1000);
      }
  
      function getAuthTokenFromState() {
        var state = ui.getState();
        // Get token from state "auth.authorized[AUTH_SCHEME].value"
        return getUIStateEntry(
          getUIStateEntry(
            getUIStateEntry(getUIStateEntry(state, "auth"), "authorized"),
            AUTH_SCHEME
          ),
          "value"
        );
      }
  
      function getUIStateEntry(state, name) {
        if (state && state._root && Array.isArray(state._root.entries)) {
          var entry = state._root.entries.find(e => e && e[0] === name);
          return entry ? entry[1] : undefined;
        }
        return undefined;
      }
  
      function setAuthToken(token) {
        var authorization = {};
        authorization[AUTH_SCHEME] = {
          name: AUTH_SCHEME,
          schema: {
            type: "apiKey",
            in: "header",
            name: "Authorization",
            description: "",
          },
          value: token,
        };
        var result = ui.authActions.authorize(authorization);
        currentAuthToken = token;
        return result;
      }
    };
    /* eslint-enable */
    return {
      afterLoad,
    };
  }
var options = {
    swaggerOptions: {
      authAction :{ 
        JWT: 
        {
            name: "JWT", 
            schema: 
                {
                    type: "apiKey",
                    in: "header", 
                    name: "Authorization", 
                    description: ""
                }, 
            value: "Bearer <JWT>"
        }},
        plugins: [useSwaggerUIAuthStoragePlugin()],

    }
  };
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile, options))

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

    .then(() => { 
        app.listen(3000, () => {
            console.log('listening on port 3000');
        });
    })
    .catch(err => console.error(err));


    app.use('/api/users', usersRouter);
    app.use('/api/groups', groupsRouter);


    app.get('/api/logout', (req, res) => {
        res.clearCookie('token');
        // console.log('Logged out');
        res.send('Vous êtes deconnecte');
    });

