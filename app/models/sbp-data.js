var azure = require('azure-storage');
var accessKey = 'pnOhpX2pEOye58E2gtlU5gVGzUbFVk3GcNYerm4RDuNuzoqsSB06v28oy3EF/wUZo6cUq/SUNdH0AQqek6rg7Q==';
var storageAccount = 'sbpccyouth';
var util = require('util');
var sbp_time = require('../models/sbp-time');

var tableService = azure.createTableService(storageAccount, accessKey);
var entGen = azure.TableUtilities.entityGenerator;

function RemoveEntityGen (entity) {
    // var resultData = {};
    for (var key in entity) {
        var valueOfKey = entity[key];
        if (typeof valueOfKey == "object")
            entity[key] = valueOfKey._;
    }
    // return resultData;
}

module.exports.AddData = function (addData, next) {
    var batch = new azure.TableBatch();
    for (var key in addData) {
        var data = addData[key];
        var entity = {
            PartitionKey: entGen.String(data.chargeYear),
            RowKey: entGen.String(data.chargeName),
            data: entGen.String(data.name),
            chargeGroup: entGen.String(data.chargeGroup)
        };
        batch.insertEntity(entity,{echoContent: true});
    }
    tableService.executeBatch('saveData', batch, function (error, result, response) {
        if(!error) {
            next(null, result);
        }
        else
            next(error, null);
    });
}
