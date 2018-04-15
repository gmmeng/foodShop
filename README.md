# Food Shop
Node.js example, providing login, register, purchase and main interfaces.

A Node.js app using most of the [MEAN](http://mean.io) software stack, including [Mongoose](http://mongoosejs.com/), [Express 4](https://expressjs.com/) and [Node.js](https://nodejs.org/) itself with its built-in modules.
## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
git clone https://github.com/gmmeng/foodShop
cd foodShop
npm install
npm start
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## Running deployed app on Heroky

App deployed in: [Heroku App](http://gabrielmoreira-foodshop.herokuapp.com)
```
http://gabrielmoreira-foodshop.herokuapp.com
```

## Deploying to Heroku

```
heroku create
git push heroku master
heroku open
```

Alternatively, you can deploy your own copy of the app using the web-based flow:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

# Running the tests
The following tests describe the features included in the app.

* Login page
  * Server verifies existence of usename.
  * If there is username, server veryfies if there's password pairing.
  * If there is a match, server renders main page.
  * If not, server renders an error message in the label object bellow Register button.
  * To speed up the testing process, use:
    * Username: john@beatles.uk
    * Password: lennonj!
* Register page 
  * Server verifies availability of entered username.
  * If username is available, server verifies if password matches the requirements.
  * Server includes new username/password pairing in users.json file it conditions are satisfied.
* Main page (Index)
  * Select product from dropdown list and click on "Submit" button.
    * Server will render the page with an image of the selected product.
    * Double click the image to open the purchase page.
  * Logout can be performed by:
    * Hovering the cursor over the username,
    * And clicking the "Logout" word.
    * Server renders the login page.
* Purchase page
  * Page is rendered with information retrieved from the NoSQL MongoDB database, hosted in the MLab server.
  * Client side javascript prevents user from purchasing more units than available quantity.
  * Client side javascript redirects user to main page after successfully making a purchase or canceling it.
  ----
# Documentation
For more information about using Node.js on Heroku, see these Dev Center articles:

- [10 Habits of a Happy Node Hacker](https://blog.heroku.com/archives/2014/3/11/node-habits)
- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Mongoose Guide](http://mongoosejs.com/docs/guide.html)
