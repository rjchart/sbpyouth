var azure = require('azure-storage');
var accessKey = 'pnOhpX2pEOye58E2gtlU5gVGzUbFVk3GcNYerm4RDuNuzoqsSB06v28oy3EF/wUZo6cUq/SUNdH0AQqek6rg7Q==';
var storageAccount = 'sbpccyouth';
var util = require('util');

var tableService = azure.createTableService(storageAccount, accessKey);
var entGen = azure.TableUtilities.entityGenerator;

tableService.createTableIfNotExists('users', function(error, result, res){
    if(!error){
        // Table exists or created
        console.log("result:" + result);
    }
    else {
        console.log("error:" + error);
    }
});  

module.exports.FindUser = function (provider, id, next) {
    var query = new azure.TableQuery()
    .top(1)
    .where('PartitionKey eq ? and RowKey eq ?', provider, id);
    tableService.queryEntities('users', query, null, function (error, result) {
        if (!error) {
            var changeString = JSON.stringify(result.entries);
            var entries = JSON.parse(changeString);
            if (entries[0]) {
                var entity = entries[0];
                for (var key in entity) {
                    var value = entity[key]._;
                    entity[key] = value;
                    // var valueType = typeof value;
                    // console.log(valueType);
                    // if (typeof value == "string")
                        // entity[key] = entGen.String(value);
                    // else if (typeof value == "number")
                        // entity[key] = entGen.Int32(value);
                }
                
                return next(null, entries[0]);
            }
            else
                return next("Not found", null);
        }
        else 
            return next(error, null);
    });  
}

module.exports.SaveUser = function (entity, next) {
    for (var key in entity) {
        var value = entity[key];
        var valueType = typeof value;
        console.log(valueType);
        if (typeof value == "string")
            entity[key] = entGen.String(value);
        else if (typeof value == "number")
            entity[key] = entGen.Int32(value);
    }
    
	// 데이터베이스에 entity를 추가합니다.
	tableService.insertOrMergeEntity('users', entity, function(error, result, res) {
		if (!error) {
            next (null, result);
		}
		else {
            next (error, null);
		}
	});
    
}