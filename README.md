# Real Debrid REST for Node JS
### How to obtain **Authentication Token** ?
The `cookie` is the value of `auth` if you open cookies from real-debrid.com *(you need to be logged to get it)*
```js
// This is cookie from real-debrid.com
let cookie: string = 'YOUR_AUTH_COOKIE_HERE'

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