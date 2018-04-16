'use strict';

const axios = require('axios');
const csvjson = require('csvjson');

const API_URL = 'https://api.2performant.com';

var Login = function(username, password){
  return new Promise(function(resolve, reject){
    axios({method: 'POST',url: API_URL+'/users/sign_in',data: {"user": {"email": username,"password": password}}})
      .then(function(res){
        resolve({
          auth: {
            accessToken: res.headers['access-token'],
            client: res.headers['client'],
            uid: res.headers['uid'],
            expiry: res.headers['expiry'],
            tokenType: res.headers['token-type']
          },
          user: res.data.user
        });
      })
      .catch(function(error){
        console.log(error.response.data.errors);
      });
  });
};

var TwoPerformant = function(auth){
  this.auth = auth;
};

TwoPerformant.prototype.makeRequest = async function(method,endpoint,data){
  var _this = this;
  return new Promise(function(resolve, reject){
    return axios({method: method, url: API_URL+'/'+endpoint, data: data || {}, headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'access-token': _this.auth.accessToken,
      'client': _this.auth.client,
      'uid': _this.auth.uid,
      'token-type': _this.auth.tokenType
    }})
    .then(function(res){
      resolve(res);
    })
    .catch(function(error){
      resolve({success: false,status: error.response.status,statusText: error.response.statusText,errors: error.response.data.errors});
    });
  });
};

TwoPerformant.prototype.isSuccess = function(res, fetch) {
    return res.success !== undefined && res.success === false ? false : true;
}

TwoPerformant.prototype.accessProperty = function(path, obj) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null
    }, obj || self);
}

TwoPerformant.prototype.getItems = async function(endpoint, params, fetch){
  var res = await this.makeRequest('GET',endpoint, params);
  if(!fetch){
    return res.data;
  }
  var obj = {};
  var map = {
    'metadata.pagination': 'pagination',
    'metadata.totals': 'totals'
  };
  for(let i in fetch){
    obj[map[fetch[i]] || fetch[i]] = this.accessProperty(fetch[i],res.data);
  }
  return obj;
};

TwoPerformant.prototype.getAllItems = async function(resource, cb){
  var arr = [];
  var fetch = true;
  var page = 1;
  while(fetch){
    var res = await cb(page);
    Array.prototype.push.apply(arr,res[resource]);
    var p = (res.pagination === undefined ? res.metadata.pagination.pages : res.pagination.pages)
    if(page === parseInt(p)){
      fetch = false;
    }
    else{
      page++;
    }
  }
  return arr;
};

TwoPerformant.prototype.affiliate = function(){
  var _this = this;
  var _obj = {};

  _obj.getPrograms = function(params){
    return _this.getItems('affiliate/programs', params, ['programs','metadata.pagination']);
  };

  _obj.getAllPrograms = function(params){
    return _this.getAllItems('programs', function(page){
      return _obj.getPrograms(Object.assign(params || {},{page: page, perpage: 500}));
    });
  };

  _obj.getProgram = async function(id){
    var res = await _this.getItems('affiliate/programs/'+id, {}, ['program']);
    return res.program;
  };

  _obj.getCommissions = function(params){
    return _this.getItems('affiliate/commissions', params, ['commissions','metadata.totals','metadata.pagination']);
  };

  _obj.getAllCommissions = function(params){
    return _this.getAllItems('commissions', function(page){
      return _obj.getCommissions(Object.assign(params || {},{page: page, perpage: 500}));
    });
  };

  _obj.getFeeds = function(params){
    return _this.getItems('affiliate/product_feeds', params, ['product_feeds','metadata.pagination']);
  };

  _obj.getAllFeeds = function(params){
    return _this.getAllItems('product_feeds', function(page){
      return _obj.getFeeds(Object.assign(params || {},{page: page, perpage: 500}));
    });
  };

  _obj.getFeedProducts = function(id,params){
    return _this.getItems('affiliate/product_feeds/'+id+'/products', params, ['products','metadata.pagination']);
  };

  _obj.getAllFeedProducts = function(id,params){
    return _this.getAllItems('products', function(page){
      return _obj.getFeedProducts(id,Object.assign(params || {},{page: page, perpage: 40}));
    });
  };

  _obj.getBanners = function(params){
    return _this.getItems('affiliate/banners', params, ['banners','metadata.pagination']);
  };

  _obj.getAllBanners = async function(params){
    return _this.getAllItems('banners', function(page){
      return _obj.getBanners(Object.assign(params || {},{page: page, perpage: 500}));
    });
  };

  _obj.getAdvertiserPromotions = async function(params){
    var res = await _this.getItems('affiliate/advertiser_promotions', params, ['advertiser_promotions']);
    return res.advertiser_promotions;
  };

  return _obj;
};

TwoPerformant.prototype.advertiser = function(){
  var _this = this;
  var _obj = {};

  _obj.getPrograms = function(params){
    return _this.getItems('advertiser/programs', params, ['programs','metadata.pagination']);
  };

  _obj.getAllPrograms = function(params){
    return _this.getAllItems('programs', function(page){
      return _obj.getPrograms(Object.assign(params || {},{page: page, perpage: 500}));
    });
  };

  _obj.getProgram = async function(id){
    var res = await _this.getItems('advertiser/programs/'+id, {}, ['program']);
    return res.program;
  };

  _obj.getCommissions = function(params){
    return _this.getItems('advertiser/programs/default/commissions', params);
  };

  _obj.getAllCommissions = function(params){
    return _this.getAllItems('commissions', function(page){
      return _obj.getCommissions(Object.assign(params || {},{page: page, perpage: 500}));
    });
  };

  _obj.createCommission = async function(params){
    var res = await _this.makeRequest('POST','advertiser/programs/default/commissions', {commission: params});
    return _this.isSuccess(res) ? res.data.commission : res;
  };

  _obj.updateCommission = async function(id,params){
    var res = await _this.makeRequest('PUT','advertiser/programs/default/commissions/'+id, {commission: params});
    return _this.isSuccess(res) ? res.data.commission : res;
  };

  _obj.acceptCommission = async function(id){
    var res = await _this.makeRequest('PUT','advertiser/programs/default/commissions/'+id+'/accept');
    return _this.isSuccess(res) ? res.data.commission : res;
  };

  _obj.rejectCommission = async function(id, reason, params){
    var res = await _this.makeRequest('PUT','advertiser/programs/default/commissions/'+id+'/reject', {reason: reason,commission: params});
    return _this.isSuccess(res) ? res.data.commission : res;
  };

  return _obj;
};

var MyFeed = function(filename){
  var _obj = {};

  _obj.fetchCSV = async function(){
    var res = await axios({method: 'GET', url: API_URL+'/feed/'+filename, responseType: 'text'});
    return res.data;
  };

  _obj.parse = async function(){
    return csvjson.toObject(await _obj.fetchCSV(), {delimiter : ',',quote     : '"'});
  };

  return _obj;
};

module.exports = TwoPerformant;
module.exports.Login = Login;
module.exports.MyFeed = MyFeed;
