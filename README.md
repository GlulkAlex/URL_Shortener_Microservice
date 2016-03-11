API Basejump: URL Shortener Microservice
===
> ###Objective: 
Build a full stack JavaScript app 
that is functionally similar to this: 
[reference case](https://shurli.herokuapp.com) and 
deploy it to Heroku.
> ###User story:  
  1. user can  
  pass a URL as a parameter and than  
  receive a shortened URL in the JSON response.  
  2. If user pass an invalid URL  
  that doesn't follow the valid `http://www.example.com` format,  
  the JSON response will contain  
  an error instead. 
  3. When user visit that shortened URL,  
  it will redirect to the original link.  
  
Example usage (live demo):
---
  * [http://request-header-parser-api.herokuapp.com/api/whoami](http://request-header-parser-api.herokuapp.com/api/whoami)

Example output:
---
    { "original_url": "http://freecodecamp.com/news", "short_url": "https://shurli.herokuapp.com/4" }