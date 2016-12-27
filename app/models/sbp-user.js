var azure = require('azure-storage');
var accessKey = 'Fh/+XVXWJOFP9O7bfN/ucFEK9/jt5nu4fdUYRJGzwMuH4KB8fFaCk/gmer20nZ4vs3AiJdqB3FYgPCZqibK2Bw==';
var storageAccount = 'sbpyouth';
var sbp_member = require('../models/sbp-member');
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

module.exports.UserDataFunction = function (profile, name, image, next) {
    sbp_member.FindUser(profile.provider, profile.id, function (error, result) {
        if (!error) {
            var entity = result;
            profile.entity = entity;
            if (result.linkP != null && result.linkP != '') {
                sbp_member.GetMemberAndLogWithName(result.linkR, function (error, final) {
                    var getMember = final[0];
                    if (!error) {
                        entity.link = getMember;
                        entity.link.userPhoto = image;
                        entity.link.userName = name; 
                    }
                    console.log(result);
                    var addPhoto = {
                        PartitionKey: getMember.PartitionKey,
                        RowKey: getMember.RowKey,
                        userPhoto: image
                    }
                    sbp_member.SaveMember(addPhoto, function (error, reult) {});

                    return next(null, entity);
                });
            }
            else
                return next(null, entity);
        }
        else {
            console.log(error);
            var entity = {
                PartitionKey: profile.provider,
                RowKey: profile.id,
                name: name,
                // data: profile._raw,
                photo: image,
                linkP: '',
                linkR: ''
            }
            profile.entity = entity;    
            
            sbp_member.SaveUser(entity, function (error, result) {
                if (!error) {
                    return next(null, entity);
                }
                else {
                    console.log(error);
                    return next(null, entity);
                }
            });
            
        }
    });
}

// module.exports.SaveUser = function (entity, next) {
//     for (var key in entity) {
//         var value = entity[key];
//         var valueType = typeof value;
//         console.log(valueType);
//         if (typeof value == "string")
//             entity[key] = entGen.String(value);
//         else if (typeof value == "number")
//             entity[key] = entGen.Int32(value);
//     }
    
// 	// 데이터베이스에 entity를 추가합니다.
// 	tableService.insertOrMergeEntity('users', entity, function(error, result, res) {
// 		if (!error) {
//             next (null, result);
// 		}
// 		else {
//             next (error, null);
// 		}
// 	});
    
// }