var express = require('express'),
  router = express.Router(),
  Article = require('../models/article');
var azure = require('azure-storage');
var flowpipe = require('flowpipe');

var accessKey = 'pnOhpX2pEOye58E2gtlU5gVGzUbFVk3GcNYerm4RDuNuzoqsSB06v28oy3EF/wUZo6cUq/SUNdH0AQqek6rg7Q==';
var storageAccount = 'sbpccyouth';
var entGen = azure.TableUtilities.entityGenerator;

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  var articles = [new Article(), new Article()];
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles
    });
});

router.get('/test', function (req, res, next) {
	var tableService = azure.createTableService(storageAccount, accessKey);
  
  
  flowpipe.init( function(next) {
      var page = 1;
      next(null, page);
  })
  .pipe('makeTable', function (next, page) {
  
      tableService.createTableIfNotExists('charges', function(error, result, res){
          if(!error){
              // Table exists or created
              console.log("result:" + result);
          }
          else {
              console.log("error:" + error);
          }
          next(null, page);
      });  
  })
  .pipe('getChargeMembers', function (next, page) {
      var query = new azure.TableQuery()
      .where('PartitionKey eq ?', '청년부');

      // 데이터베이스 쿼리를 실행합니다.
      tableService.queryEntities('charges', query, null, function entitiesQueried(error, result) {
          if (!error) {
              var testString = JSON.stringify(result.entries);
              var entries = JSON.parse(testString);
      //         // response.send(ejs.render(data, 
      //         //     {data: entries}
      //         // ));
              next(null, entries);
          }
          else {
              console.log("error:" + error);
              next("error", page);
          }
              
      });
      // next(null, page);
  })
  .end (function (err, result) {
    if (!err) {
        console.log("done");
        var articles = [new Article(), new Article()];
        res.render('chargeList', {
          title: 'Charge Member List',
          articles: articles,
          data: result
        });
      
    }
  });
  
  // flowpipe.init(function (next) {
  //       var page = 1;
  //       next(null, page);
  //     })
  //     .pipe('makeTable', function (next, page) {
  //         tableService.createTableIfNotExists('charges', function(error, result, res){
  //             if(!error){
  //                 // Table exists or created
  //                 next(null, page);
  //             }
  //         });
  //     })
  //     .pipe('getChargeMembers', function (next, page) {
  //         // fs.readFile('chargeList.html', 'utf8', function (error, data) {
  //           var query = new azure.TableQuery()
  //           .where('PartitionKey eq ?', '청년부');

  //           // 데이터베이스 쿼리를 실행합니다.
  //           tableService.queryEntities('charges', query, null, function entitiesQueried(error, result) {
  //               if (!error) {
  //                   var testString = JSON.stringify(result.entries);
  //                   var entries = JSON.parse(testString);
  //                   // response.send(ejs.render(data, 
  //                   //     {data: entries}
  //                   // ));
  //                   next(null, entries);
  //               }
  //           });

  //         // });
  //     })
  //     .end(function (err, result) {
  //          console.log(result);
  //     });

});
