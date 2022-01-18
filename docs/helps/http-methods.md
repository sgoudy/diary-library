# HTTP Methods & Statuses

We will use the HTTP status codes from the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

For the time being we will no longer use the default response. The following default response should be considered outdated:

```javascript
{
    message: "General message describing this response.",
    response: 200...500
    status: true || false
}
```

**ALWAYS** set an appropriate status code with `res.status()`. We will be relying solely on these moving forward.

<br><br>

# Obsolete - Do not use the following information anymore
Every RESTful API service relies on HTTP methods to communicate the intent of an API request. Well there are some standards shared with all REST API's each application that implements it's own API tends to provide their own expectations and structure.

For our application we use the following:

Method | Operations | Description
---|---|---
DELETE | Delete | Delete the specified resource. Returns status 200 (ok) or 400 (bad request).
GET | Read/Request | This is a request to do something or for data of some kind. Return status 200 (ok), 204 (no content), or 400 (bad request).
POST | Create | This is a request to create something new. Return status 201 (created) or 400 (bad request).
PUT | Update | This is a request to update an existing resource. Return status 202 (accepted) or 400 (bad request).

In addition to the status codes mentioned in the previous table any of the following status codes may be used when appropriate:

Code | Description
---|---
200 | Successful transmission. The route requested accomplished what you wanted it to. 
201 | Created new resource successfully.
202 | Accepted a change or update to an existing resource.
204 | Successful transmission. We have nothing to send back to you.
301 | Old API route moved permanently to the provided route.
302 | Requested route was old, we automatically called the new route and your request succeed. Please use the new route next time.
400 | Bad request. Could not complete request because information may be missing or your lacking proper authorization.
401 | Unauthorized. Refused to accept request because you need to be authenticated first.
403 | Forbidden. You do not have the correct permissions for this request.
404 | Route not found or otherwise unable to respond to your request.
500 | Server error. This will automatically be sent when triggered.

## Front End Responses
After querying the API you will always receive a response object that contains at a minimum:

```javascript
{
    message: "General message describing this response.",
    response: 200...500
    status: true || false
}
```

A `status` of `true` indicates your request should be considered successful. The `response` code indicates the complete status of your request; see the HTTP status code table above. Depending on the API route you triggered there may be additional information in the response object.

## Back End Routes

When handling an API route in the back-end you need to make sure your listening for the correct HTTP method. When registering a new user for example, the back-end route should listen for `post` because we are registering (creating) a new user:

```javascript
const newRoute = function( Router, DB, Multipart ){

    Router.route('/register/:name/:email/:password').post( Multipart.none(), (req, res) => {
        // ...
        res.status(201);
        res.json( {
            message: 'New user was registered in the database.',
            response: 201,
            status: true
        } );
    }

}

export default newRoute;
```

When a user attempts to login to the system that is consider a general request, or read operation, and is handled by a `get` method:

```javascript
const newRoute = function( Router, DB, Multipart ){

    Router.route('/login/:email/:password').get( (req, res) => {
        // ...
        const doc = { ... };
        // ...
        res.status(200);
        res.json( {
            id: doc._id.toString(),
            message: 'Login successful!',
            response: 200,
            status: true,
            user: doc
        } );
    }

export default newRoute;
```

## POST vs. GET
So what is the difference between POST and GET requests? For starters keep in mind that:

- `post` and `put` requests should be handled as `POST` requests **most of the time**.
- `get` and `delete` should be handled as `GET` requests.

GET requests contain all the information you will need right in the route path (URL). For example:

```javascript
Router.route('/routes').get( (req, res) => {
    // No parameters are part of this route, just do something and respond.
}
```

```javascript
Router.route('/say/:message').get( (req, res) => {
    // This route has one parameter we can pull out.
    const params = req.params;
    const message = params.message;
    // Now we can do something with this message then respond.
}
```

POST request may or may not contain all the information you need in the route path (URL). For example:

```javascript
Router.route('/register/:name/:email/:password').post( Multipart.none(), (req, res) => {
    // This is a POST request BUT everything we need is in the URL.
    const params = req.params;
    const name = params.name;
    const email = params.email;
    const password = params.password;

    /*
     * NOTE: We used Multipart.none() because this route has everything we need
     * in the route path (URL) so there is no req.body to get.
     */
}
```

Notice how we could still use `req.params`. In a true `post` or `put` we will need to get the data from `req.body` instead. This is usually because the amount of data being sent is to large for a GET request. Here is an example:

```javascript
Router.route('/upload/something').post( Multipart.any(), (req, res) => {
    // This is a POST request and it must be handled via the body instead.
    const body = req.body;
    
    /*
     * NOTE: We used Multipart.any() here so req.params will most likely never
     * be set, we should rely on req.body instead. You will have to analyse
     * the request or review the front-end to determine what properties will be
     * on the body object.
     */
}
```

`Multipart` is actually an instance of [multer](https://github.com/expressjs/multer). You will need to review [multer](https://github.com/expressjs/multer) to understand how and when to your `Multipart` correctly. Using `Multipart.any()` may not always be the best idea.