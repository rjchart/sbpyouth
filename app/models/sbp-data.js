var azure = require('azure-storage');
var accessKey = 'pnOhpX2pEOye58E2gtlU5gVGzUbFVk3GcNYerm4RDuNuzoqsSB06v28oy3EF/wUZo6cUq/SUNdH0AQqek6rg7Q==';
var storageAccount = 'sbpccyouth';
var util = require('util');
var sbp_time = require('../models/sbp-time');
var multiparty = require('multiparty');
var title = '신반포 중앙교회 청년부';

var tableService = azure.createTableService(storageAccount, accessKey);
var blobService = azure.createBlobService(storageAccount, accessKey);
var entGen = azure.TableUtilities.entityGenerator;


function SetEntityGen (entity) {
    for (var key in entity) {
        var value = entity[key];
        var valueType = typeof value;
        if (value == null)
            value = '';
        // console.log(valueType);
        if (key == "PartitionKey" || key == "RowKey")
            entity[key] = entGen.String(value.toString());
        else if (typeof value == "string")
            entity[key] = entGen.String(value);
        else if (typeof value == "number")
            entity[key] = entGen.Int32(value);
        else if (typeof value == "boolean")
            entity[key] = entGen.Boolean(value);
    }
}

function RemoveEntityGen (entity) {
    // var resultData = {};
    for (var key in entity) {
        var valueOfKey = entity[key];
        if (typeof valueOfKey == "object")
            entity[key] = valueOfKey._;
    }
    // return resultData;
}

module.exports.AddBank = function (addData, next) {
    var batch = new azure.TableBatch();
    for (var key in addData) {
        var data = addData[key];
		if (data.deleteRow == "true") {
			SetEntityGen(data);
			batch.deleteEntity(data,{echoContent: true});
		}
		else {
			SetEntityGen(data);
			batch.insertOrMergeEntity(data,{echoContent: true});
		}
    }
    tableService.executeBatch('bank', batch, function (error, result, response) {
        if(!error) {
            next(null, result);
        }
        else
            next(error, null);
    });
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

module.exports.MultipartyFunction = function (req, id, next) {
	var form = new multiparty.Form();
	var checkMax = 1;
	var checkCount = 0;

	var fields = {};

    form.on('part', function(part) {
	    if (!part.filename) {
	    	// console.log("not file:" + JSON.stringify(part));
			console.log('none');
	    }
	    else {
			var filename = id + new Date().toISOString() + ".jpg";
			var size = part.byteCount;
	    	// console.log("file:" + JSON.stringify(part));
			var size2 = part.byteCount - part.byteOffset;
			var container = 'imgcontainer';

	    	console.log("part:" + filename + ", size:" + size + ", size2:" + size2);
			var urlString = "https://sbpccyouth.blob.core.windows.net/" + container + "/" + filename;
			checkMax++;

			blobService.createBlockBlobFromStream(container, filename, part, size, function(error) {
				if (!error) {
					console.log("photo upload ok");
					fields.photo = urlString;
				}
				else 
                    next(error);

				checkCount++;
				if (checkCount >= checkMax)
					next(null, fields);
			});
			return;
	    }
	});

	// Close emitted after form parsed 
	form.on('close', function() {
		console.log('Upload completed!');

		checkCount++;
		if (checkCount >= checkMax)
			next(null, fields);
	});

    form.on('field', function (field, value) {
        fields[field] = value;
    });

	form.parse(req);
}

module.exports.CheckLogin = function (req) {
    if (!req.session.passport || !req.session.passport.user) {
        return {
			title: title,
			base: req.url
		};
    }
	if (!req.session.passport.user.link) {
		return {
			title: title,
			isLogin: true,
			isLink: false,
			base: req.url
		};
	}
    var link = req.session.passport.user.link;
	link.isLogin = true;
	link.isLink = true;
	link.title = title;
	link.base = req.url;
	return link;
}