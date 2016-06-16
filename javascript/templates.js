function profile_template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (birthDay, birthMonth, birthYear, branch, gender, locate, mail, mustShow, name, phone, photo, showLocate, showMail, showPhone, userPhoto, usingPhoto) {
buf.push("<div class=\"ui card\"><div style=\"background-color:#e5e5e5\" class=\"image outImg\">");
if ( (usingPhoto == 'true'))
{
buf.push("<img" + (jade.attr("src", "" + (userPhoto||'') + "", true, false)) + " class=\"fitImg\"/>");
}
else if ( (photo))
{
buf.push("<img" + (jade.attr("src", "" + (photo) + "", true, false)) + " class=\"fitImg\"/>");
}
else
{
buf.push("<img src=\"/public/img/image.png\" class=\"fitImg\"/>");
}
buf.push("</div><div class=\"content\"><a class=\"header\">" + (jade.escape((jade_interp = name) == null ? '' : jade_interp)) + "</a><div class=\"meta\"><span class=\"date\">" + (jade.escape((jade_interp = birthYear) == null ? '' : jade_interp)) + "." + (jade.escape((jade_interp = birthMonth) == null ? '' : jade_interp)) + "." + (jade.escape((jade_interp = birthDay) == null ? '' : jade_interp)) + "</span></div><div class=\"ui relaxed celled list\"><div class=\"item\"><i class=\"big heterosexual middle aligned icon\"></i><div class=\"content\"><div class=\"header\">성별<div style=\"color:gray\" class=\"description\">" + (jade.escape((jade_interp = gender) == null ? '' : jade_interp)) + "</div></div></div></div><div class=\"item\"><i class=\"big tag middle aligned icon\"></i><div class=\"content\"><div class=\"header\">브랜치<div style=\"color:gray\" class=\"description\">" + (jade.escape((jade_interp = branch || '') == null ? '' : jade_interp)) + "</div></div></div></div><div class=\"item\"><i class=\"big phone middle aligned icon\"></i><div class=\"content\"><div class=\"header\">전화번호");
if ( showPhone == "true" || mustShow == true)
{
buf.push("<div style=\"color:gray\" class=\"description\">" + (jade.escape((jade_interp = phone) == null ? '' : jade_interp)) + "</div>");
}
else
{
buf.push("<div style=\"color:gray\" class=\"description\">비공개</div>");
}
buf.push("</div></div></div><div class=\"item\"><i class=\"big mail middle aligned icon\"></i><div class=\"content\"><div class=\"header\">메일");
if ( showMail == "true" || mustShow == true)
{
buf.push("<div style=\"color:gray\" class=\"description\">" + (jade.escape((jade_interp = mail || '') == null ? '' : jade_interp)) + "</div>");
}
else
{
buf.push("<div style=\"color:gray\" class=\"description\">비공개</div>");
}
buf.push("</div></div></div><div class=\"item\"><i class=\"big building middle aligned icon\"></i><div class=\"content\"><div class=\"header\">거주지");
if ( showLocate == "true" || mustShow == true)
{
buf.push("<div style=\"color:gray\" class=\"description\">" + (jade.escape((jade_interp = locate || '') == null ? '' : jade_interp)) + "</div>");
}
else
{
buf.push("<div style=\"color:gray\" class=\"description\">비공개</div>");
}
buf.push("</div></div></div></div></div></div>");}.call(this,"birthDay" in locals_for_with?locals_for_with.birthDay:typeof birthDay!=="undefined"?birthDay:undefined,"birthMonth" in locals_for_with?locals_for_with.birthMonth:typeof birthMonth!=="undefined"?birthMonth:undefined,"birthYear" in locals_for_with?locals_for_with.birthYear:typeof birthYear!=="undefined"?birthYear:undefined,"branch" in locals_for_with?locals_for_with.branch:typeof branch!=="undefined"?branch:undefined,"gender" in locals_for_with?locals_for_with.gender:typeof gender!=="undefined"?gender:undefined,"locate" in locals_for_with?locals_for_with.locate:typeof locate!=="undefined"?locate:undefined,"mail" in locals_for_with?locals_for_with.mail:typeof mail!=="undefined"?mail:undefined,"mustShow" in locals_for_with?locals_for_with.mustShow:typeof mustShow!=="undefined"?mustShow:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"phone" in locals_for_with?locals_for_with.phone:typeof phone!=="undefined"?phone:undefined,"photo" in locals_for_with?locals_for_with.photo:typeof photo!=="undefined"?photo:undefined,"showLocate" in locals_for_with?locals_for_with.showLocate:typeof showLocate!=="undefined"?showLocate:undefined,"showMail" in locals_for_with?locals_for_with.showMail:typeof showMail!=="undefined"?showMail:undefined,"showPhone" in locals_for_with?locals_for_with.showPhone:typeof showPhone!=="undefined"?showPhone:undefined,"userPhoto" in locals_for_with?locals_for_with.userPhoto:typeof userPhoto!=="undefined"?userPhoto:undefined,"usingPhoto" in locals_for_with?locals_for_with.usingPhoto:typeof usingPhoto!=="undefined"?usingPhoto:undefined));;return buf.join("");
}
function profile_edit(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (PartitionKey, attend, attendDesc, attendString, birthDay, birthMonth, birthYear, branch, charge, gender, locate, mail, name, part, phone, photo, service, tension, tensionString, year) {
buf.push("<form id=\"uploadForm\"" + (jade.attr("action", "/saveProfile/" + (name) + "", true, false)) + " enctype=\"multipart/form-data\" method=\"post\"><div class=\"ui card\"><input type=\"hidden\" name=\"PartitionKey\"" + (jade.attr("value", "" + (PartitionKey) + "", true, false)) + "/><input type=\"hidden\" name=\"RowKey\"" + (jade.attr("value", "" + (name) + "", true, false)) + "/><input type=\"hidden\" name=\"year\"" + (jade.attr("value", "" + (year) + "", true, false)) + "/><input type=\"hidden\" name=\"charge\"" + (jade.attr("value", "" + (charge) + "", true, false)) + "/><label style=\"background-color:#e5e5e5\" for=\"uploadInput\" class=\"image outImg\">");
if ( (photo))
{
buf.push("<img id=\"updateImage\"" + (jade.attr("src", "" + (photo) + "", true, false)) + " class=\"fitImg\"/><input type=\"hidden\" name=\"photo\"" + (jade.attr("value", "" + (photo) + "", true, false)) + "/>");
}
else
{
buf.push("<img id=\"updateImage\" src=\"/public/img/image.png\" class=\"fitImg\"/>");
}
buf.push("</label><div class=\"content\"><a onclick=\"UploadSubmit()\" class=\"ui big red ribbon label\"> \nedit</a><br/><br/><a class=\"header\">" + (jade.escape((jade_interp = name) == null ? '' : jade_interp)) + "</a><div class=\"meta\"><span class=\"date\">" + (jade.escape((jade_interp = birthYear) == null ? '' : jade_interp)) + "." + (jade.escape((jade_interp = birthMonth) == null ? '' : jade_interp)) + "." + (jade.escape((jade_interp = birthDay) == null ? '' : jade_interp)) + "</span></div><table class=\"ui small table\"><tr> <td>성별</td><td><div class=\"ui input focus\"><input type=\"text\" name=\"gender\"" + (jade.attr("value", "" + (gender) + "", true, false)) + " style=\"max-width:130px; max-height:30px\"/></div></td></tr><tr> <td>브랜치</td><td> <div class=\"ui input focus\"><input type=\"text\" name=\"branch\"" + (jade.attr("value", "" + (branch) + "", true, false)) + " style=\"max-width:130px; max-height:30px\"/></div></td></tr><tr> <td>전화번호</td><td> <div class=\"ui input focus\"><input type=\"text\" name=\"phone\"" + (jade.attr("value", "" + (phone) + "", true, false)) + " style=\"max-width:130px; max-height:30px\"/></div></td></tr><tr> <td>이메일</td><td> <div class=\"ui input focus\"><input type=\"text\" name=\"mail\"" + (jade.attr("value", "" + (mail || '') + "", true, false)) + " style=\"max-width:130px; max-height:30px\"/></div></td></tr><tr> <td>출석빈도</td><td class=\"center aligned\"><div style=\"min-width:100px;\" class=\"ui selection dropdown\"><input type=\"hidden\" name=\"attend\"" + (jade.attr("value", "" + (attend) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\">" + (jade.escape((jade_interp = attendString) == null ? '' : jade_interp)) + "</div><div class=\"menu\"><div data-value=\"0\" style=\"min-width:100px; max-height:30px\" class=\"item\">안 나옴</div><div data-value=\"1\" style=\"min-width:100px; max-height:30px\" class=\"item\">가끔 나옴</div><div data-value=\"2\" style=\"min-width:100px; max-height:30px\" class=\"item\">종종 나옴</div><div data-value=\"3\" style=\"min-width:100px; max-height:30px\" class=\"item\">잘 나옴</div><div data-value=\"4\" style=\"min-width:100px; max-height:30px\" class=\"item\">매주 나옴</div></div></div></td></tr><tr> <td>성격</td><td class=\"center aligned\"><div style=\"min-width:100px;\" class=\"ui selection dropdown\"><input type=\"hidden\" name=\"tension\"" + (jade.attr("value", "" + (tension) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\">" + (jade.escape((jade_interp = tensionString) == null ? '' : jade_interp)) + "</div><div class=\"menu\"><div data-value=\"0\" style=\"min-width:100px; max-height:30px\" class=\"item\">과묵함</div><div data-value=\"1\" style=\"min-width:100px; max-height:30px\" class=\"item\">내성적임</div><div data-value=\"2\" style=\"min-width:100px; max-height:30px\" class=\"item\">일반적임</div><div data-value=\"3\" style=\"min-width:100px; max-height:30px\" class=\"item\">사교적임</div><div data-value=\"4\" style=\"min-width:100px; max-height:30px\" class=\"item\">매우 활발함</div></div></div></td></tr><tr> <td>비고사항</td><td> <div class=\"ui input focus\"><input type=\"text\" name=\"attendDesc\"" + (jade.attr("value", "" + (attendDesc || '') + "", true, false)) + " style=\"max-width:130px; max-height:30px\"/></div></td></tr><tr> <td>소속</td><td> <div class=\"ui input focus\"><input type=\"text\" name=\"part\"" + (jade.attr("value", "" + (part) + "", true, false)) + " style=\"max-width:130px; max-height:30px\"/></div></td></tr><tr> <td>브랜치 역할</td><td> <div class=\"ui input focus\"><input type=\"text\" name=\"charge\"" + (jade.attr("value", "" + (charge) + "", true, false)) + " style=\"max-width:130px; max-height:30px\"/></div></td></tr><tr> <td>봉사 부서</td><td> <div class=\"ui input focus\"><input type=\"text\" name=\"service\"" + (jade.attr("value", "" + (service || '') + "", true, false)) + " style=\"max-width:130px; max-height:30px\"/></div></td></tr><tr> <td>거주지</td><td> <div class=\"ui input focus\"><input type=\"text\" name=\"locate\"" + (jade.attr("value", "" + (locate || '') + "", true, false)) + " style=\"max-width:130px; max-height:30px\"/></div></td></tr><tr> <td>출생년도</td><td> <div class=\"ui input focus\"><input type=\"text\" name=\"birthYear\"" + (jade.attr("value", "" + (birthYear || '') + "", true, false)) + " style=\"max-width:130px; max-height:30px\"/></div></td></tr><tr> <td>출생월</td><td> <div class=\"ui input focus\"><input type=\"text\" name=\"birthMonth\"" + (jade.attr("value", "" + (birthMonth || '') + "", true, false)) + " style=\"max-width:130px; max-height:30px\"/></div></td></tr><tr> <td>출생일</td><td> <div class=\"ui input focus\"><input type=\"text\" name=\"birthDay\"" + (jade.attr("value", "" + (birthDay || '') + "", true, false)) + " style=\"max-width:130px; max-height:30px\"/></div></td></tr></table></div><div class=\"ui two bottom attached buttons\"><div" + (jade.attr("onclick", "DeleteMember(" + (PartitionKey) + ",'" + (name) + "')", true, false)) + " class=\"ui red button\"><i class=\"remove icon\"> </i>Delete</div><div onclick=\"UploadSubmit()\" class=\"ui button\"><i class=\"write icon\"> </i>Edit</div></div><input type=\"submit\" hidden=\"hidden\"/></div><input id=\"uploadInput\" type=\"file\" name=\"upload\" accept=\"image/*\" onchange=\"ReadURL(this)\" class=\"filebox upload\"/></form>");}.call(this,"PartitionKey" in locals_for_with?locals_for_with.PartitionKey:typeof PartitionKey!=="undefined"?PartitionKey:undefined,"attend" in locals_for_with?locals_for_with.attend:typeof attend!=="undefined"?attend:undefined,"attendDesc" in locals_for_with?locals_for_with.attendDesc:typeof attendDesc!=="undefined"?attendDesc:undefined,"attendString" in locals_for_with?locals_for_with.attendString:typeof attendString!=="undefined"?attendString:undefined,"birthDay" in locals_for_with?locals_for_with.birthDay:typeof birthDay!=="undefined"?birthDay:undefined,"birthMonth" in locals_for_with?locals_for_with.birthMonth:typeof birthMonth!=="undefined"?birthMonth:undefined,"birthYear" in locals_for_with?locals_for_with.birthYear:typeof birthYear!=="undefined"?birthYear:undefined,"branch" in locals_for_with?locals_for_with.branch:typeof branch!=="undefined"?branch:undefined,"charge" in locals_for_with?locals_for_with.charge:typeof charge!=="undefined"?charge:undefined,"gender" in locals_for_with?locals_for_with.gender:typeof gender!=="undefined"?gender:undefined,"locate" in locals_for_with?locals_for_with.locate:typeof locate!=="undefined"?locate:undefined,"mail" in locals_for_with?locals_for_with.mail:typeof mail!=="undefined"?mail:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"part" in locals_for_with?locals_for_with.part:typeof part!=="undefined"?part:undefined,"phone" in locals_for_with?locals_for_with.phone:typeof phone!=="undefined"?phone:undefined,"photo" in locals_for_with?locals_for_with.photo:typeof photo!=="undefined"?photo:undefined,"service" in locals_for_with?locals_for_with.service:typeof service!=="undefined"?service:undefined,"tension" in locals_for_with?locals_for_with.tension:typeof tension!=="undefined"?tension:undefined,"tensionString" in locals_for_with?locals_for_with.tensionString:typeof tensionString!=="undefined"?tensionString:undefined,"year" in locals_for_with?locals_for_with.year:typeof year!=="undefined"?year:undefined));;return buf.join("");
}
function addMember_template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (chargeGroup, chargeName, chargeYear, name, num) {
buf.push("<div class=\"four fields\"><div class=\"field\"><label>이름</label><input" + (jade.attr("name", "add_name[" + (num) + "]", true, false)) + " placeholder=\"이름\" type=\"text\"" + (jade.attr("value", "" + (name) + "", true, false)) + "/></div><div class=\"field\"><label>직책</label><input" + (jade.attr("name", "add_chargeName[" + (num) + "]", true, false)) + " placeholder=\"직책\" type=\"text\"" + (jade.attr("value", "" + (chargeName) + "", true, false)) + "/></div><div class=\"field\"><label>소속</label><input" + (jade.attr("name", "add_chargeGroup[" + (num) + "]", true, false)) + " placeholder=\"소속\" type=\"text\"" + (jade.attr("value", "" + (chargeGroup) + "", true, false)) + "/></div><div class=\"field\"><label>년도</label><input" + (jade.attr("name", "add_chargeYear[" + (num) + "]", true, false)) + " placeholder=\"년도\" type=\"text\"" + (jade.attr("value", "" + (chargeYear) + "", true, false)) + "/></div></div>");}.call(this,"chargeGroup" in locals_for_with?locals_for_with.chargeGroup:typeof chargeGroup!=="undefined"?chargeGroup:undefined,"chargeName" in locals_for_with?locals_for_with.chargeName:typeof chargeName!=="undefined"?chargeName:undefined,"chargeYear" in locals_for_with?locals_for_with.chargeYear:typeof chargeYear!=="undefined"?chargeYear:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"num" in locals_for_with?locals_for_with.num:typeof num!=="undefined"?num:undefined));;return buf.join("");
}
function addMember_second(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (chargeGroup, chargeName, chargeYear, name, num) {
buf.push("<div class=\"four fields\"><div class=\"field\"><input" + (jade.attr("name", "add_name[" + (num) + "]", true, false)) + " placeholder=\"이름\" type=\"text\"" + (jade.attr("value", "" + (name) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_chargeName[" + (num) + "]", true, false)) + " placeholder=\"직책\" type=\"text\"" + (jade.attr("value", "" + (chargeName) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_chargeGroup[" + (num) + "]", true, false)) + " placeholder=\"소속\" type=\"text\"" + (jade.attr("value", "" + (chargeGroup) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_chargeYear[" + (num) + "]", true, false)) + " placeholder=\"년도\" type=\"text\"" + (jade.attr("value", "" + (chargeYear) + "", true, false)) + "/></div></div>");}.call(this,"chargeGroup" in locals_for_with?locals_for_with.chargeGroup:typeof chargeGroup!=="undefined"?chargeGroup:undefined,"chargeName" in locals_for_with?locals_for_with.chargeName:typeof chargeName!=="undefined"?chargeName:undefined,"chargeYear" in locals_for_with?locals_for_with.chargeYear:typeof chargeYear!=="undefined"?chargeYear:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"num" in locals_for_with?locals_for_with.num:typeof num!=="undefined"?num:undefined));;return buf.join("");
}
function addPerson_template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (attend, birthDay, birthMonth, birthYear, gender, name, num, phone, tension) {
buf.push("<div class=\"eight fields\"><div class=\"field\"><label>이름</label><input" + (jade.attr("name", "add_name[" + (num) + "]", true, false)) + " placeholder=\"이름\" type=\"text\"" + (jade.attr("value", "" + (name) + "", true, false)) + "/></div><div class=\"field\"><label>성별</label><input" + (jade.attr("name", "add_gender[" + (num) + "]", true, false)) + " placeholder=\"성별\" type=\"text\"" + (jade.attr("value", "" + (gender) + "", true, false)) + "/></div><div class=\"field\"><label>전화번호</label><input" + (jade.attr("name", "add_phone[" + (num) + "]", true, false)) + " placeholder=\"소속\" type=\"text\"" + (jade.attr("value", "" + (phone) + "", true, false)) + "/></div><div class=\"field\"><label>출생년도</label><input" + (jade.attr("name", "add_birthYear[" + (num) + "]", true, false)) + " placeholder=\"년도\" type=\"text\"" + (jade.attr("value", "" + (birthYear) + "", true, false)) + "/></div><div class=\"field\"><label>출생 월</label><input" + (jade.attr("name", "add_birthMonth[" + (num) + "]", true, false)) + " placeholder=\"월\" type=\"text\"" + (jade.attr("value", "" + (birthMonth) + "", true, false)) + "/></div><div class=\"field\"><label>출생 날짜</label><input" + (jade.attr("name", "add_birthDay[" + (num) + "]", true, false)) + " placeholder=\"일\" type=\"text\"" + (jade.attr("value", "" + (birthDay) + "", true, false)) + "/></div><div class=\"field\"><label>성격</label><input" + (jade.attr("name", "add_tension[" + (num) + "]", true, false)) + " placeholder=\"성격\" type=\"text\"" + (jade.attr("value", "" + (tension) + "", true, false)) + "/></div><div class=\"field\"><label>출석빈도</label><input" + (jade.attr("name", "add_attend[" + (num) + "]", true, false)) + " placeholder=\"출석빈도\" type=\"text\"" + (jade.attr("value", "" + (attend) + "", true, false)) + "/></div></div>");}.call(this,"attend" in locals_for_with?locals_for_with.attend:typeof attend!=="undefined"?attend:undefined,"birthDay" in locals_for_with?locals_for_with.birthDay:typeof birthDay!=="undefined"?birthDay:undefined,"birthMonth" in locals_for_with?locals_for_with.birthMonth:typeof birthMonth!=="undefined"?birthMonth:undefined,"birthYear" in locals_for_with?locals_for_with.birthYear:typeof birthYear!=="undefined"?birthYear:undefined,"gender" in locals_for_with?locals_for_with.gender:typeof gender!=="undefined"?gender:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"num" in locals_for_with?locals_for_with.num:typeof num!=="undefined"?num:undefined,"phone" in locals_for_with?locals_for_with.phone:typeof phone!=="undefined"?phone:undefined,"tension" in locals_for_with?locals_for_with.tension:typeof tension!=="undefined"?tension:undefined));;return buf.join("");
}
function addPerson_second(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (attend, birthDay, birthMonth, birthYear, gender, name, num, phone, tension) {
buf.push("<div class=\"eight fields\"><div class=\"field\"><input" + (jade.attr("name", "add_name[" + (num) + "]", true, false)) + " placeholder=\"이름\" type=\"text\"" + (jade.attr("value", "" + (name) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_gender[" + (num) + "]", true, false)) + " placeholder=\"성별\" type=\"text\"" + (jade.attr("value", "" + (gender) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_phone[" + (num) + "]", true, false)) + " placeholder=\"소속\" type=\"text\"" + (jade.attr("value", "" + (phone) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_birthYear[" + (num) + "]", true, false)) + " placeholder=\"년도\" type=\"text\"" + (jade.attr("value", "" + (birthYear) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_birthMonth[" + (num) + "]", true, false)) + " placeholder=\"월\" type=\"text\"" + (jade.attr("value", "" + (birthMonth) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_birthDay[" + (num) + "]", true, false)) + " placeholder=\"일\" type=\"text\"" + (jade.attr("value", "" + (birthDay) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_tension[" + (num) + "]", true, false)) + " placeholder=\"성격\" type=\"text\"" + (jade.attr("value", "" + (tension) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_attend[" + (num) + "]", true, false)) + " placeholder=\"출석빈도\" type=\"text\"" + (jade.attr("value", "" + (attend) + "", true, false)) + "/></div></div>");}.call(this,"attend" in locals_for_with?locals_for_with.attend:typeof attend!=="undefined"?attend:undefined,"birthDay" in locals_for_with?locals_for_with.birthDay:typeof birthDay!=="undefined"?birthDay:undefined,"birthMonth" in locals_for_with?locals_for_with.birthMonth:typeof birthMonth!=="undefined"?birthMonth:undefined,"birthYear" in locals_for_with?locals_for_with.birthYear:typeof birthYear!=="undefined"?birthYear:undefined,"gender" in locals_for_with?locals_for_with.gender:typeof gender!=="undefined"?gender:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"num" in locals_for_with?locals_for_with.num:typeof num!=="undefined"?num:undefined,"phone" in locals_for_with?locals_for_with.phone:typeof phone!=="undefined"?phone:undefined,"tension" in locals_for_with?locals_for_with.tension:typeof tension!=="undefined"?tension:undefined));;return buf.join("");
}
function addBranch_template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (attendDesc, branch, name, num, year) {
buf.push("<div class=\"four fields\"><div class=\"field\"><label>이름</label><input" + (jade.attr("name", "add_name[" + (num) + "]", true, false)) + " placeholder=\"이름\" type=\"text\"" + (jade.attr("value", "" + (name) + "", true, false)) + "/></div><div class=\"field\"><label>브랜치</label><input" + (jade.attr("name", "add_branch[" + (num) + "]", true, false)) + " placeholder=\"브랜치\" type=\"text\"" + (jade.attr("value", "" + (branch) + "", true, false)) + "/></div><div class=\"field\"><label>비고</label><input" + (jade.attr("name", "add_attendDesc[" + (num) + "]", true, false)) + " placeholder=\"비고\" type=\"text\"" + (jade.attr("value", "" + (attendDesc) + "", true, false)) + "/></div><div class=\"field\"><label>년도</label><input" + (jade.attr("name", "add_year[" + (num) + "]", true, false)) + " placeholder=\"년도\" type=\"text\"" + (jade.attr("value", "" + (year) + "", true, false)) + "/></div></div>");}.call(this,"attendDesc" in locals_for_with?locals_for_with.attendDesc:typeof attendDesc!=="undefined"?attendDesc:undefined,"branch" in locals_for_with?locals_for_with.branch:typeof branch!=="undefined"?branch:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"num" in locals_for_with?locals_for_with.num:typeof num!=="undefined"?num:undefined,"year" in locals_for_with?locals_for_with.year:typeof year!=="undefined"?year:undefined));;return buf.join("");
}
function addBranch_second(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (attendDesc, branch, name, num, year) {
buf.push("<div class=\"four fields\"><div class=\"field\"><input" + (jade.attr("name", "add_name[" + (num) + "]", true, false)) + " placeholder=\"이름\" type=\"text\"" + (jade.attr("value", "" + (name) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_branch[" + (num) + "]", true, false)) + " placeholder=\"브랜치\" type=\"text\"" + (jade.attr("value", "" + (branch) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_attendDesc[" + (num) + "]", true, false)) + " placeholder=\"비고\" type=\"text\"" + (jade.attr("value", "" + (attendDesc) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_year[" + (num) + "]", true, false)) + " placeholder=\"년도\" type=\"text\"" + (jade.attr("value", "" + (year) + "", true, false)) + "/></div></div>");}.call(this,"attendDesc" in locals_for_with?locals_for_with.attendDesc:typeof attendDesc!=="undefined"?attendDesc:undefined,"branch" in locals_for_with?locals_for_with.branch:typeof branch!=="undefined"?branch:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"num" in locals_for_with?locals_for_with.num:typeof num!=="undefined"?num:undefined,"year" in locals_for_with?locals_for_with.year:typeof year!=="undefined"?year:undefined));;return buf.join("");
}
function addNameBS_template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (nameBS, num) {
buf.push("<div class=\"two wide column\"><label>BS</label><input" + (jade.attr("name", "make_nameBS[" + (num) + "]", true, false)) + " placeholder=\"이름\" type=\"text\"" + (jade.attr("value", "" + (nameBS) + "", true, false)) + "/></div>");}.call(this,"nameBS" in locals_for_with?locals_for_with.nameBS:typeof nameBS!=="undefined"?nameBS:undefined,"num" in locals_for_with?locals_for_with.num:typeof num!=="undefined"?num:undefined));;return buf.join("");
}
function detailProfile_template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (PartitionKey, RowKey, families, friends, haters, hopers, undefined) {
buf.push("<h4 class=\"ui header\"> \n친한 사람 리스트</h4><div class=\"ui relaxed celled list\"><div class=\"item\"><div class=\"ui grid\">");
// iterate friends
;(function(){
  var $$obj = friends;
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var friend = $$obj[index];

buf.push("<div class=\"four wide column\"><div class=\"right floated content\"><div" + (jade.attr("onclick", "Delete('" + (PartitionKey) + "','" + (RowKey) + "','" + (friend) + "', 'friend')", true, false)) + " class=\"ui mini button\">Delete</div></div><i class=\"large retweet middle aligned icon\"></i>" + (jade.escape((jade_interp = friend) == null ? '' : jade_interp)) + "</div>");
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var friend = $$obj[index];

buf.push("<div class=\"four wide column\"><div class=\"right floated content\"><div" + (jade.attr("onclick", "Delete('" + (PartitionKey) + "','" + (RowKey) + "','" + (friend) + "', 'friend')", true, false)) + " class=\"ui mini button\">Delete</div></div><i class=\"large retweet middle aligned icon\"></i>" + (jade.escape((jade_interp = friend) == null ? '' : jade_interp)) + "</div>");
    }

  }
}).call(this);

buf.push("</div></div><div class=\"item\"><div class=\"content\"><form id=\"insert_friend\" action=\"/insert/friend\" method=\"post\"><input type=\"hidden\" name=\"key\"" + (jade.attr("value", "" + (PartitionKey) + "", true, false)) + "/><input type=\"hidden\" name=\"member\"" + (jade.attr("value", "" + (RowKey) + "", true, false)) + "/><input type=\"hidden\" name=\"relation\" value=\"friend\"/><div class=\"ui grid\"><div class=\"three wide column\"><div class=\"ui mini input focus\"><input type=\"text\" placeholder=\"이름\" name=\"target[0]\"/></div></div><div class=\"three wide column\"><div class=\"ui mini input focus\"><input type=\"text\" placeholder=\"이름\" name=\"target[1]\"/></div></div><div class=\"three wide column\"><div class=\"ui mini input focus\"><input type=\"text\" placeholder=\"이름\" name=\"target[2]\"/></div></div><div class=\"three wide column\"><div class=\"ui mini input focus\"><input type=\"text\" placeholder=\"이름\" name=\"target[3]\"/></div></div><div class=\"one wide column\"></div><div class=\"three wide column\"><div onclick=\"Insert('friend')\" class=\"ui mini button\"><i class=\"large add user middle aligned icon\"> </i>Add</div></div></div></form></div></div></div><h4 class=\"ui header\"> \n가족 혹은 연인 리스트</h4><div class=\"ui relaxed celled list\"><div class=\"item\"><div class=\"ui grid\">");
// iterate families
;(function(){
  var $$obj = families;
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var family = $$obj[index];

buf.push("<div class=\"four wide column\"><div class=\"right floated content\"><div" + (jade.attr("onclick", "Delete('" + (PartitionKey) + "','" + (RowKey) + "','" + (family) + "', 'family')", true, false)) + " class=\"ui mini button\">Delete</div></div><i class=\"large heart middle aligned icon\"></i>" + (jade.escape((jade_interp = family) == null ? '' : jade_interp)) + "</div>");
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var family = $$obj[index];

buf.push("<div class=\"four wide column\"><div class=\"right floated content\"><div" + (jade.attr("onclick", "Delete('" + (PartitionKey) + "','" + (RowKey) + "','" + (family) + "', 'family')", true, false)) + " class=\"ui mini button\">Delete</div></div><i class=\"large heart middle aligned icon\"></i>" + (jade.escape((jade_interp = family) == null ? '' : jade_interp)) + "</div>");
    }

  }
}).call(this);

buf.push("</div></div><div class=\"item\"><div class=\"content\"><form id=\"insert_family\" action=\"/insert/family\" method=\"post\"><input type=\"hidden\" name=\"key\"" + (jade.attr("value", "" + (PartitionKey) + "", true, false)) + "/><input type=\"hidden\" name=\"member\"" + (jade.attr("value", "" + (RowKey) + "", true, false)) + "/><input type=\"hidden\" name=\"relation\" value=\"family\"/><div class=\"ui grid\"><div class=\"three wide column\"><div class=\"ui mini input focus\"><input type=\"text\" placeholder=\"이름\" name=\"target[0]\"/></div></div><div class=\"three wide column\"><div class=\"ui mini input focus\"><input type=\"text\" placeholder=\"이름\" name=\"target[1]\"/></div></div><div class=\"three wide column\"><div class=\"ui mini input focus\"><input type=\"text\" placeholder=\"이름\" name=\"target[2]\"/></div></div><div class=\"three wide column\"><div class=\"ui mini input focus\"><input type=\"text\" placeholder=\"이름\" name=\"target[3]\"/></div></div><div class=\"one wide column\"></div><div class=\"three wide column\"><div onclick=\"Insert('family')\" class=\"ui mini button\"><i class=\"large add user middle aligned icon\"> </i>Add</div></div></div></form></div></div></div><h4 class=\"ui header\"> \n싫어하는 사람 리스트</h4><div class=\"ui relaxed celled list\"><div class=\"item\"><div class=\"ui grid\">");
// iterate haters
;(function(){
  var $$obj = haters;
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var hater = $$obj[index];

buf.push("<div class=\"four wide column\"><div class=\"right floated content\"><div" + (jade.attr("onclick", "Delete('" + (PartitionKey) + "','" + (RowKey) + "','" + (hater) + "', 'hater')", true, false)) + " class=\"ui mini button\">Delete</div></div><i class=\"large ban middle aligned icon\"></i>" + (jade.escape((jade_interp = hater) == null ? '' : jade_interp)) + "</div>");
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var hater = $$obj[index];

buf.push("<div class=\"four wide column\"><div class=\"right floated content\"><div" + (jade.attr("onclick", "Delete('" + (PartitionKey) + "','" + (RowKey) + "','" + (hater) + "', 'hater')", true, false)) + " class=\"ui mini button\">Delete</div></div><i class=\"large ban middle aligned icon\"></i>" + (jade.escape((jade_interp = hater) == null ? '' : jade_interp)) + "</div>");
    }

  }
}).call(this);

buf.push("</div></div><div class=\"item\"><div class=\"content\"><form id=\"insert_hater\" action=\"/insert/hater\" method=\"post\"><input type=\"hidden\" name=\"key\"" + (jade.attr("value", "" + (PartitionKey) + "", true, false)) + "/><input type=\"hidden\" name=\"member\"" + (jade.attr("value", "" + (RowKey) + "", true, false)) + "/><input type=\"hidden\" name=\"relation\" value=\"hater\"/><div class=\"ui grid\"><div class=\"three wide column\"><div class=\"ui mini input focus\"><input type=\"text\" placeholder=\"이름\" name=\"target[0]\"/></div></div><div class=\"three wide column\"><div class=\"ui mini input focus\"><input type=\"text\" placeholder=\"이름\" name=\"target[1]\"/></div></div><div class=\"three wide column\"><div class=\"ui mini input focus\"><input type=\"text\" placeholder=\"이름\" name=\"target[2]\"/></div></div><div class=\"three wide column\"><div class=\"ui mini input focus\"><input type=\"text\" placeholder=\"이름\" name=\"target[3]\"/></div></div><div class=\"one wide column\"></div><div class=\"three wide column\"><div onclick=\"Insert('hater')\" class=\"ui mini button\"><i class=\"large add user middle aligned icon\"> </i>Add</div></div></div></form></div></div></div><h4 class=\"ui header\"> \n다음 브랜치 같이 할 사람 리스트</h4><div class=\"ui relaxed celled list\"><div class=\"item\"><div class=\"ui grid\">");
// iterate hopers
;(function(){
  var $$obj = hopers;
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var hoper = $$obj[index];

buf.push("<div class=\"four wide column\"><div class=\"right floated content\"><div" + (jade.attr("onclick", "Delete('" + (PartitionKey) + "','" + (RowKey) + "','" + (hoper) + "', 'hoper')", true, false)) + " class=\"ui mini button\">Delete</div></div><i class=\"large compress middle aligned icon\"></i>" + (jade.escape((jade_interp = hoper) == null ? '' : jade_interp)) + "</div>");
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var hoper = $$obj[index];

buf.push("<div class=\"four wide column\"><div class=\"right floated content\"><div" + (jade.attr("onclick", "Delete('" + (PartitionKey) + "','" + (RowKey) + "','" + (hoper) + "', 'hoper')", true, false)) + " class=\"ui mini button\">Delete</div></div><i class=\"large compress middle aligned icon\"></i>" + (jade.escape((jade_interp = hoper) == null ? '' : jade_interp)) + "</div>");
    }

  }
}).call(this);

buf.push("</div></div><div class=\"item\"><div class=\"content\"><form id=\"insert_hoper\" action=\"/insert/hoper\" method=\"post\"><input type=\"hidden\" name=\"key\"" + (jade.attr("value", "" + (PartitionKey) + "", true, false)) + "/><input type=\"hidden\" name=\"member\"" + (jade.attr("value", "" + (RowKey) + "", true, false)) + "/><input type=\"hidden\" name=\"relation\" value=\"hoper\"/><div class=\"ui grid\"><div class=\"three wide column\"><div class=\"ui mini input focus\"><input type=\"text\" placeholder=\"이름\" name=\"target[0]\"/></div></div><div class=\"three wide column\"><div class=\"ui mini input focus\"><input type=\"text\" placeholder=\"이름\" name=\"target[1]\"/></div></div><div class=\"three wide column\"><div class=\"ui mini input focus\"><input type=\"text\" placeholder=\"이름\" name=\"target[2]\"/></div></div><div class=\"three wide column\"><div class=\"ui mini input focus\"><input type=\"text\" placeholder=\"이름\" name=\"target[3]\"/></div></div><div class=\"one wide column\"></div><div class=\"three wide column\"><div onclick=\"Insert('hoper')\" class=\"ui mini button\"><i class=\"large add user middle aligned icon\"> </i>Add</div></div></div></form></div></div></div>");}.call(this,"PartitionKey" in locals_for_with?locals_for_with.PartitionKey:typeof PartitionKey!=="undefined"?PartitionKey:undefined,"RowKey" in locals_for_with?locals_for_with.RowKey:typeof RowKey!=="undefined"?RowKey:undefined,"families" in locals_for_with?locals_for_with.families:typeof families!=="undefined"?families:undefined,"friends" in locals_for_with?locals_for_with.friends:typeof friends!=="undefined"?friends:undefined,"haters" in locals_for_with?locals_for_with.haters:typeof haters!=="undefined"?haters:undefined,"hopers" in locals_for_with?locals_for_with.hopers:typeof hopers!=="undefined"?hopers:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
}