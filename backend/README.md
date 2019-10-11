# CMPE 273 - Lab 1
## Michael Lowe
Email: michael.lowe@sjsu.edu

Student ID: 013850161

### Introduction

The following is the proposed Schema and API for _ColorSpace, a search engine for colors and their usage on the web.


It is primarily designed to be used by our Polling / Crawling mechanism. As of now, we do not intend to implement a frontend database as this is out of scope with regards to our distributed system.

### Installation
***Pre-requisite*** `NodeJS` & `Node Package Manager`
1. In terminal:

```
$      cd ~/lab2_mlowe
$      npm install
$      node server.js
```

2. The server will run on `localhost:3000`

### Schema

1. Site
```
_id       : Document ID
domain    : “url.com”
resource  : Resource // Subdocument
colors    : [ColorSchema] // Array of ref _id
```
  1.1 Resource
  ```
  src       : String
  options   : [String]
  ```
3. Color
```
_id     : Document ID
hex     : String
rgb     : [Number]
group   : ColorGroup // ref _id
```

4. ColorGroup
```
_id       : Document ID
primary   : String
secondary : String
grayscale : Boolean
range     : [Number]
```

### Endpoints

#### 1. Create

  **HTTP Method:** `POST`

  ***Requires:*** `req.body`

  **Routes:**

  1.1 `"/site"` *Creates a Site document & Resource subdocument*

  1.2 `"/color"` *Creates a Color document*

  1.3 `"/group"` *Creates a ColorGroup document*

#### 2. Read

  **HTTP Method:** `GET`

  ***Requires:*** `req.params`

  **Routes:**

  1.1 `"/site/:id"` *Finds Site document by `_id`*

  1.2 `"/color/hex/:val"` *Finds a Color document by `hex` value*

  1.3 `"/group/:primary/:secondary"` *Finds a ColorGroup document by `primary` and `secondary` classification*

#### 3. Update

  **HTTP Method:** `PUT`

  ***Requires:*** `req.body` `req.params`

  **Routes:**

  1.1 `"/site/:id"` *Finds Site document by `_id` and updates*

  1.2 `"/color/:id"` *Finds a Color document by `_id` and updates*

  1.3 `"/group/:id"` *Finds a ColorGroup document by `_id` and updates*

#### 4. Delete

  **HTTP Method:** `DELETE`

  ***Requires:*** `req.params`

  **Routes:**

  1.1 `"/site/:id"` *Finds Site document by `_id` and deletes*

  1.2 `"/color/:id"` *Finds a Color document by `_id` and deletes*

  1.3 `"/group/:id"` *Finds a ColorGroup document by `_id` and deletes*
