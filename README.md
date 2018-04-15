# node-2performant

Promise based node.js wrapper for [2performant API](https://doc.2performant.com)

## Installing

Using npm:

```bash
$ npm install node-2performant
```

## Example

```js
//Making user auth
new TwoPerformant.Login('USERNAME','PASSWORD').then(function(user){

  //will return auth data and user data
  //you should save and encrypt this somewhere for future uses
  console.log(user);

  //instantiating TwoPerformant object with user auth
  var tp = new TwoPerformant(user.auth);

  //getting the affiliate object
  var affiliate = tp.affiliate();

  //fetching programs
  affiliate.getPrograms().then(function(affiliatePrograms){
    //will output programs and pagination
    console.log(affiliatePrograms);
  });

});
```

## Affiliate methods

```js
//getting the affiliate object for easy access
var affiliate = tp.affiliate();
```

Input parameters are well documented in [2performant API](https://doc.2performant.com)

##### affiliate.getPrograms(params)
##### affiliate.getAllPrograms(params)
##### affiliate.getProgram(id)
##### affiliate.getCommissions(params)
##### affiliate.getAllCommissions(params)
##### affiliate.getFeeds(params)
##### affiliate.getAllFeeds(params)
##### affiliate.getFeedProducts(id,params)
##### affiliate.getAllFeedProducts(id,params)
##### affiliate.getBanners(params)
##### affiliate.getAllBanners(params)
##### affiliate.getAdvertiserPromotions(params)

## Custom feed parser

Custom feeds are the feeds generated on [Tools > My Feeds](https://network.2performant.com/affiliate/tools/my-feeds/).

You need to provide only the feed's unique id which is found in the URL:

```html
https://api.2performant.com/feed/{ID}.csv
```

```js
var myFeed = new TwoPerformant.MyFeed('ID.csv');
var data = await myFeed.parse();
console.log(data);
```

## License

MIT
