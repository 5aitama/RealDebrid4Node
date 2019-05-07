# Real Debrid REST for Node JS
### How to obtain **Authentication Token** ?
The `cookie` is the value of `auth` if you open cookies from real-debrid.com *(you need to be logged to get it)*
```js

const RealDebridRESTAuth = require('RealDebridRESTAuth')

// This is cookie from real-debrid.com
let cookie = 'YOUR_AUTH_COOKIE_HERE'

// Obtain auth data
RealDebridRESTAuth.ObtainAuthData()

// Bypass user verification with cookie
.then(authData => RealDebridRESTAuth.ByPassUserVerificationEndPoint(authData, cookie))

// Check credential endpoint
.then(RealDebridRESTAuth.CheckCredentialsEndpoint)

// Obtain Authentication Token
.then(RealDebridRESTAuth.ObtainToken)

// You have your authentication token !
.then(authToken => {
    // Do things with it here...
})
```

### How to make request ?
First you need to create new instance of `RealDebridREST`
```js
const RealDebridREST = require(RealDebridREST)
let realDebrid = new RealDebridREST(authToken)
```
And now you can perform request to Real-Debrid ! 
For exemple if i want to unrestrict link :
```js
realDebrid.UnrestrictLink('http://www.mylink.com/exemple')
.then(value => {
    // Do things with the value...
})
.catch(reason => {
    console.error(reason)
})
```