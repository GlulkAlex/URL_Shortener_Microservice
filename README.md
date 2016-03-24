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
  
Live demo:
---
  * [https://api-url-shortener-microservice.herokuapp.com/](https://api-url-shortener-microservice.herokuapp.com/)
> ###Usage example:
  * creating short link from *valid* __URL__:
  input:
    [https://api-url-shortener-microservice.herokuapp.com/new/http://freecodecamp.com/news](https://api-url-shortener-microservice.herokuapp.com/new/http://freecodecamp.com/news)
  output:
    `{ "original_url": "http://freecodecamp.com/news", "short_url": "https://api-url-shortener-microservice.herokuapp.com/4" }`
  * using created short link:
  input:
    [https://api-url-shortener-microservice.herokuapp.com/cnn](https://api-url-shortener-microservice.herokuapp.com/cnn)
  output:
    redirect to [http://freecodecamp.com/news]([http://freecodecamp.com/news])
  * creating short link from __invalid__ (or *non existed*) __URL__:
  input:
    [https://api-url-shortener-microservice.herokuapp.com/new/invalid_URL/?allow=true](https://api-url-shortener-microservice.herokuapp.com/new/invalid_URL/?allow=true)
  output:
    `{ "original_url": "invalid_URL/", "short_url": "https://api-url-shortener-microservice.herokuapp.com/eRR" }`
