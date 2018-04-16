# node-2performant

Promise based node.js wrapper for [2performant API](https://doc.2performant.com)

## Installing

Using npm:

```bash
$ npm install node-2performant
```

## Example

```js
var TwoPerformant = require('node-2performant');

//Making user auth for affiliate
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

  //getting the advertiser object
  var advertiser = tp.advertiser();

  advertiser.getCommissions().then(function(res){
    console.log(res.commissions);
  });

});
```

```js
//Making user auth for advertiser
new TwoPerformant.Login('USERNAME','PASSWORD').then(function(user){

  //will return auth data and user data
  //you should save and encrypt this somewhere for future uses
  console.log(user);

  //instantiating TwoPerformant object with user auth
  var tp = new TwoPerformant(user.auth);

  //getting the advertiser object
  var advertiser = tp.advertiser();

  advertiser.getCommissions().then(function(res){
    console.log(res.commissions);
  });

});
```

## async/await example
```js
var TwoPerformant = require('node-2performant');

async function run(){
  var user =  await new TwoPerformant.Login('USERNAME','PASSWORD');

  var tp = new TwoPerformant(user.auth);

  var affiliate = tp.affiliate();

  var affiliatePrograms = await affiliate.getPrograms();

  var affiliateProgram = await affiliate.getProgram('ID');
}
run();
```

## Affiliate methods

```js
//getting the affiliate object for easy access
var affiliate = tp.affiliate();
```

Input parameters are well documented in [2performant API](https://doc.2performant.com)

##### affiliate.getPrograms(params)
```js
//all parameters are optional
var params = {
  page: 1, //Page number, default: 1
  perpage: 10, //Resources per page, default: 10

  //Filter object that contains optional fields for filtering resource results
  filter: {
    query: "", //Filter by on of fields [name, description, tos] can be full text searched using
    category: "", //Filter by Category name
    country: "", //Filter by Country name
  },

  //Sort object that contains any optional fields for sorting
  sort: {
    approved_commission_count: "", //Sort results asc or desc by price
    click_count: "", //Sort results asc or desc by actions
    epc: "", //Sort results asc or desc by clicks
  }
};

affiliate.getPrograms(params).then(function(affiliatePrograms){
  console.log(affiliatePrograms);
});
```

##### affiliate.getAllPrograms(params)
```js
//for parameters see getPrograms method
affiliate.getAllPrograms(params).then(function(affiliatePrograms){
  console.log(affiliatePrograms);
});
```

##### affiliate.getProgram(id)
```js
//id is required
affiliate.getProgram(id).then(function(affiliateProgram){
  console.log(affiliateProgram);
});
```

##### affiliate.getCommissions(params)
##### affiliate.getAllCommissions(params)
##### affiliate.getFeeds(params)
##### affiliate.getAllFeeds(params)
##### affiliate.getFeedProducts(id,params)
##### affiliate.getAllFeedProducts(id,params)
##### affiliate.getBanners(params)
##### affiliate.getAllBanners(params)
##### affiliate.getAdvertiserPromotions(params)

## Advertiser methods

```js
//getting the advertiser object for easy access
var advertiser = tp.advertiser();
```

Input parameters are well documented in [2performant API](https://doc.2performant.com)

##### advertiser.getPrograms(params)
##### advertiser.getAllPrograms(params)
##### advertiser.getProgram(id)
##### advertiser.getCommissions(params)
##### advertiser.getAllCommissions(params)
##### advertiser.createCommission(params)
Params accepts only commission parameters

```js
advertiser.createCommission({user_id: 'INTEGER', amount: 'DECIMAL', description: 'STRING'});
```
##### advertiser.updateCommission(id,params)
Params accepts only commission parameters

```js
advertiser.updateCommission(id,{reason: 'STRING', amount: 'DECIMAL', description: 'STRING'});
```

##### advertiser.acceptCommission(id)
```js
advertiser.acceptCommission(id);
```

##### advertiser.rejectCommission(id,reason,params)
Params accepts only commission parameters

```js
advertiser.rejectCommission(id,reason,params);
```

## Custom feed parser

Custom feeds are the feeds generated on [Tools > My Feeds](https://network.2performant.com/affiliate/tools/my-feeds/).

You need to provide only the feed's unique id which is found in the URL:

```html
https://api.2performant.com/feed/{ID}.csv
```

```js
async function run(){
  var myFeed = new TwoPerformant.MyFeed('ID.csv');
  var data = await myFeed.parse();
  console.log(data);
};
run();
```

## License

MIT
