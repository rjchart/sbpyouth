var azure = require('azure-storage');
var accessKey = 'Fh/+XVXWJOFP9O7bfN/ucFEK9/jt5nu4fdUYRJGzwMuH4KB8fFaCk/gmer20nZ4vs3AiJdqB3FYgPCZqibK2Bw==';
var storageAccount = 'sbpyouth';
var util = require('util');
var sbp_time = require('../models/sbp-time');
var multiparty = require('multiparty');
var title = '신반포 중앙교회 청년부';

var tableService = azure.createTableService(storageAccount, accessKey);
var blobService = azure.createBlobService(storageAccount, accessKey);
var entGen = azure.TableUtilities.entityGenerator;


function MakeQuery(partitionKey, other) {
    var queryString = "PartitionKey eq '" + partitionKey + "'";
    var tt = typeof other;
    if (typeof other != undefined) {
        for (var key in other) {
            queryString += " and " + key + " eq '" + other[key] + "'";
        }
    }
    return queryString;
}

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

module.exports.AddDatas = function (addData, tableName, next) {
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
    tableService.executeBatch(tableName, batch, function (error, result, response) {
        if(!error) {
            next(null, result);
        }
        else
            next(error, null);
    });
}

module.exports.AddSBPData = function (data, next) {
    SetEntityGen(data);
    // 데이터베이스에 entity를 추가합니다.
    tableService.insertOrMergeEntity('sbpcc', data, function(error, result) {
        if (!error) {
            next(null, result);
        }
        else {
            next(error);
        }
    });
}

module.exports.GetSBPDatas = function (partitionKey, others, next) {
    
    var queryString = MakeQuery(partitionKey, others);

    // queryString1 = "PartitionKey eq 'Event'";
    var query = new azure.TableQuery()
    .where(queryString);
    // .where('PartitionKey eq ?', partitionKey);

    // 데이터베이스 쿼리를 실행합니다.
    tableService.queryEntities('sbpcc', query, null, function (error, result) {
        if (!error) {
            var resultDatas = [];
            for (var index in result.entries) {
                var data = result.entries[index];
                RemoveEntityGen(data);
                resultDatas.push(data);
            }
            next(null, resultDatas);
        }
        else {
            console.log("error:" + error);
            next(error);
        }
            
    });
}

module.exports.AddSBPDatas = function (tableName, addData, next) {
    var batch = new azure.TableBatch();
	var count = 0;
	var sendCount = 1;
	var finishCount = 0;
    for (var key in addData) {
		if (count >= 100) {
			sendCount++;
			count = 0;
			tableService.executeBatch(tableName, batch, function (error, result, response) {
				if(!error) {
					finishCount++;
					if (finishCount >= sendCount)
						next(null, result);
				}
				else
					next(error, null);
			});
			batch = new azure.TableBatch();
		}
        var data = addData[key];
		if (data.deleteRow == "true") {
			SetEntityGen(data);
			batch.deleteEntity(data,{echoContent: true});
		}
		else {
			SetEntityGen(data);
			batch.insertOrMergeEntity(data,{echoContent: true});
		}
		count++;
    }
    tableService.executeBatch(tableName, batch, function (error, result, response) {
        if(!error) {
			finishCount++;
			if (finishCount >= sendCount)
				next(null, result);
        }
        else
            next(error, null);
    });
}

module.exports.AddBank = function (addData, next) {
    var batch = new azure.TableBatch();
    for (var key in addData) {
        var data = addData[key];
		if (data.deleteRow && data.deleteRow == "true") {
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
        batch.insertOrMergeEntity(entity,{echoContent: true});
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
					fields.photoName = filename;
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
		var header = req.rawHeaders[1];
		if (header == "127.0.0.1:3000") {
			return {
				title: title,
				base: req.url,
				auth: "developer"
			};
		}
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