# Amazing Playlist Builder!

### What Does It Do?

The APB allows users to create, save, use, and share playlists, tapped into the worlds most massive music collections.

### How Do I Deploy APB?

*Option 1: Users*

Use our interface. Go to http://wedontreallyhaveafrontendyet.com, and follow the user prompts.

*Option 2: Developers*

Although we allow a minimal direct user interface, our primary goal is creating an API for developers to build amazing custom solutions.  Follow the RESTful endpoint instructions below.  Contact us at http://dontexpectustoreallyanswer.com/contactus if you run into difficulties.

# How Can I Use The APB API?

## General

The APB API uses RESTful endpoints.  Each endpoint below identifies the http method, access level (public requires no credentials, private requires user credentials), and a general description of the method.
Keywords within URIs are indicated via `<keyword>`.  E.g. to use:

````http
localhost:8080/api/music/songs?song=<keyword>
````
substitute `<keyword>` with `purple` to find all song titles that include purple, per below.

````http
localhost:8080/api/music/songs?song=purple
````

If not specified, request bodies and request headers are not required.  E.g. for most get endpoints, the request body can be blank, or if populated, will be ignored.

## IDs

Each entity in the database has a read-only unique Mongo Object Id.  See https://docs.mongodb.com/manual/reference/method/ObjectId/.  All APB references between collections require this ID, which is the `_id` property.

## Users

**Create User Account**

This creates APB user accounts.

 Method  | Access | Description |
| ------- |------- | ----------- |
| POST     | Public | create new **user** |

````http
http://localhost:8080/api/users
````

>*request body (all 4 fields are required)* `Content Type` `Application/json`

````json
{
    "username": "<userentry>",
    "password": "<userentry>",
    "firstName": "<userentry>",
    "lastName": "<userentry>"
}
````

All fields must be strings (e.g. password cannot be all numbers). Usernames and passwords must be explicitly trimmed. Usernames must be unique.  Passwords must be 10-72 characters in length.

**User Login**

Upon successful creation of the user account. Then the user needs to log in.  Redirect the user to a form to enter username and password. The submit function should submit the username & password as follows:

| Method  | Access | Description |
| ------- |------- | ----------- |
| POST   | Public | **log in** to user account |

````http
http://localhost:8080/api/auth/login 
HTTP Header:
Authorization: Basic <base64 encoded usernamepassword>
````

**Update User Account**

 Method  | Access | Description |
| ------- |------- | ----------- |
| PUT     | Private | update **user** account |

````http
http://localhost:8080/api/users/<userId>
````

>*request body (include at least one field below)* `Content Type` `Application/json`

````json
{
    "username": "<userentry>",
    "password": "<userentry>",
    "firstName": "<userentry>",
    "lastName": "<userentry>"
}
````

**Delete User Account**

 Method  | Access | Description |
| ------- |------- | ----------- |
| DELETE | Private | delete **user** account |

This will also delete associated user playlists.

````http
http://localhost:8080/api/users/<userId>
````

**Access User Account**

 Method  | Access | Description |
| ------- |------- | ----------- |
| GET | Private | access **user** account |

````http
http://localhost:8080/api/users/<userId>
````

## Accessing Private Endpoints

The API APB will respond to a successful login with a JavaScript Web Token.  All endpoints identified as "Private" require the user to have a valid APB user accounts.  To access all private endpoints, include the token as follows:

````http
http://localhost:8080/api/<APB-RESTfulEndpoint>
HTTP Header:
Authorization: Bearer <javascript web token>
````

# The Good Stuff! Accessing Music!

### Artists

| Method  | Access | Description |
| ------- |------- | ----------- |
| GET     | Public | Load 20 artists with albums and songs. Can be useful for teaser content. |

````http
http://localhost:8080/api/music/
````

| Method  | Access | Description |
| ------- |------- | ----------- |
| GET     | Public | find **artists** by id |

````http
http://localhost:8080/api/music/artists/<artistId> 
````



### Albums

| Method  | Access | Description |
| ------- |------- | ----------- |
| GET     | Public | find **albums** with title that includes keyword |

````http
http://localhost:8080/api/music/albums?album=<keyword>
````




### Songs

| Method  | Access | Description |
| ------- |------- | ----------- |
| GET     | Public | find **songs** with title that includes keyword |

````http
http://localhost:8080/api/music/songs?song=<keyword>
````

| Method  | Access | Description |
| ------- |------- | ----------- |
| PUT     | Private | increment **votes** of popularity of songs |

````http
http://localhost:8080/api/music/artists/<artistId>/albums/<albumId>/songs/<songId>
````


### Playlists

| Method  | Access | Description |
| ------- |------- | ----------- |
| GET     | Private | find **playlists** by user |

````http
http://localhost:8080/api/music/playlists/users/<userId>
````

| Method  | Access | Description |
| ------- |------- | ----------- |
| GET     | Private | find **playlist** by id |

````http
http://localhost:8080/api/music/playlists/<playlistId>
````

| Method  | Access | Description |
| ------- |------- | ----------- |
| POST     | Private | create a new **playlist** |

````http
http://localhost:8080/api/music/playlists
````

>*request body,* (`playlistName` *is required, other fields are optional.)* `Content Type` `Application/json`

````json
{
    "id": "<playlist id>",
	"playlistName" : "<playlistname is required>",
	"songs" : [
		{ "_id" : "<id>" }
	]
}
````

| Method  | Access | Description |
| ------- |------- | ----------- |
| PUT     | Private | update **playlist** by id |

````http
http://localhost:8080/api/music/playlists/<playlistId>
````

Submit the information below in the request body as `Content Type` `Application/json`.
Playlist id is required in the body, but will **NOT** be updated.
Any other information included in the body will be updated.
Invalid requests (other fields, incorrect formatting, etc.) will be rejected.  **IMPORTANT** This function performs a complete replace (delete all, then add all) for any field present in the request body.  If "songs" is present in the request body, then the request body should include **ALL** songs to be used in the playlist, not just a song to add or remove from the playlist.

>*request body* `Content Type` `Application/json`

````json
{
    "id": "<playlist id>",
	"playlistName" : "<playlistname>",
	"songs" : [
		{ "_id" : "<id>" }
	]
}
````

| Method  | Access | Description |
| ------- |------- | ----------- |
| DELETE  | Private | delete **playlist** by id |

````http
http://localhost:8080/api/music/playlists/<playlistId>
````



# Administrator Access

**Artists**
Administrator access is required to edit the music database.  Contact us to inquire about administrator access.

| Method  | Access | Description |
| ------- |------- | ----------- |
| POST     | Admin | add an **artist**, which can include genres, albums and songs |

````http
http://localhost:8080/api/music/artists 
````
>*request body (artistName is required, other fields are optional)* `Content Type` `Application/json`

````json
{
  "artistName" : "<artist>",
  "genres" : [
  	"<genre>", "<genre>"
  ],
  "albums" : [
    { "title" : "<albumTitle>",
      "songs" : [
        {"title" : "<songTitle>"},
	{"title" : "<songTitle>"}
      ]
    }
  ]
}
````

| Method  | Access | Description |
| ------- |------- | ----------- |
| PUT     | Admin | update **artists** by id |

The format for updating an artist is identical to creating an artist, but **ONLY** include in the request body the artist id and fields that should be updated.

````http
http://localhost:8080/api/music/artist/<artistId>
````

| Method  | Access | Description |
| ------- |------- | ----------- |
| DELETE  | Admin | delete **artist** by id |

````http
http://localhost:8080/api/music/artists/<artistId>
````

>*request body (id is required in body, and must match request parameter)* `Content Type` `Application/json`

````json
{
  "id" : "idjustposted" ,
}
````

**Albums**

Coming Soon!

**Songs**

Coming Soon!
