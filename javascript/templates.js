function profile_template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (birthDay, birthMonth, birthYear, branch, gender, locate, mail, mustShow, name, phone, photoName, showLocate, showMail, showPhone, userPhoto, usingPhoto) {
buf.push("<div class=\"ui card\"><div style=\"background-color:#e5e5e5\" class=\"image outImg\">");
if ( (usingPhoto == 'true'))
{
buf.push("<img" + (jade.attr("src", "" + (userPhoto||'') + "", true, false)) + " class=\"fitImg\"/>");
}
else if ( (photoName))
{
buf.push("<img" + (jade.attr("src", "https://sbpyouth.blob.core.windows.net/imgcontainer/" + (photoName) + "", true, false)) + " class=\"fitImg\"/>");
}
else
{
buf.push("<img src=\"/public/img/image.png\" class=\"fitImg\"/>");
}
buf.push("</div><div class=\"content\"><a onclick=\"ModalProfile()\" class=\"header\">" + (jade.escape((jade_interp = name) == null ? '' : jade_interp)) + "</a><div class=\"meta\"><span class=\"date\">" + (jade.escape((jade_interp = birthYear) == null ? '' : jade_interp)) + "." + (jade.escape((jade_interp = birthMonth) == null ? '' : jade_interp)) + "." + (jade.escape((jade_interp = birthDay) == null ? '' : jade_interp)) + "</span></div><div class=\"ui relaxed celled list\"><div class=\"item\"><i class=\"big heterosexual middle aligned icon\"></i><div class=\"content\"><div class=\"header\">성별<div style=\"color:gray\" class=\"description\">" + (jade.escape((jade_interp = gender) == null ? '' : jade_interp)) + "</div></div></div></div><div class=\"item\"><i class=\"big tag middle aligned icon\"></i><div class=\"content\"><div class=\"header\">브랜치<div style=\"color:gray\" class=\"description\">" + (jade.escape((jade_interp = branch || '') == null ? '' : jade_interp)) + "</div></div></div></div><div class=\"item\"><i class=\"big phone middle aligned icon\"></i><div class=\"content\"><div class=\"header\">전화번호");
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
buf.push("</div></div></div></div></div></div>");}.call(this,"birthDay" in locals_for_with?locals_for_with.birthDay:typeof birthDay!=="undefined"?birthDay:undefined,"birthMonth" in locals_for_with?locals_for_with.birthMonth:typeof birthMonth!=="undefined"?birthMonth:undefined,"birthYear" in locals_for_with?locals_for_with.birthYear:typeof birthYear!=="undefined"?birthYear:undefined,"branch" in locals_for_with?locals_for_with.branch:typeof branch!=="undefined"?branch:undefined,"gender" in locals_for_with?locals_for_with.gender:typeof gender!=="undefined"?gender:undefined,"locate" in locals_for_with?locals_for_with.locate:typeof locate!=="undefined"?locate:undefined,"mail" in locals_for_with?locals_for_with.mail:typeof mail!=="undefined"?mail:undefined,"mustShow" in locals_for_with?locals_for_with.mustShow:typeof mustShow!=="undefined"?mustShow:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"phone" in locals_for_with?locals_for_with.phone:typeof phone!=="undefined"?phone:undefined,"photoName" in locals_for_with?locals_for_with.photoName:typeof photoName!=="undefined"?photoName:undefined,"showLocate" in locals_for_with?locals_for_with.showLocate:typeof showLocate!=="undefined"?showLocate:undefined,"showMail" in locals_for_with?locals_for_with.showMail:typeof showMail!=="undefined"?showMail:undefined,"showPhone" in locals_for_with?locals_for_with.showPhone:typeof showPhone!=="undefined"?showPhone:undefined,"userPhoto" in locals_for_with?locals_for_with.userPhoto:typeof userPhoto!=="undefined"?userPhoto:undefined,"usingPhoto" in locals_for_with?locals_for_with.usingPhoto:typeof usingPhoto!=="undefined"?usingPhoto:undefined));;return buf.join("");
}
function profile_edit(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (PartitionKey, attend, attendDesc, attendString, birthDay, birthMonth, birthYear, branch, charge, gender, locate, mail, name, part, phone, photo, photoName, service, tension, tensionString, year) {
buf.push("<form id=\"uploadForm\"" + (jade.attr("action", "/saveProfile/" + (name) + "", true, false)) + " enctype=\"multipart/form-data\" method=\"post\"><div class=\"ui card\"><input type=\"hidden\" name=\"PartitionKey\" value=\"Member\"/><input type=\"hidden\" name=\"RowKey\"" + (jade.attr("value", "" + (name) + "", true, false)) + "/><input type=\"hidden\" name=\"year\"" + (jade.attr("value", "" + (year) + "", true, false)) + "/><input type=\"hidden\" name=\"charge\"" + (jade.attr("value", "" + (charge) + "", true, false)) + "/><label style=\"background-color:#e5e5e5\" for=\"uploadInput\" class=\"image outImg\">");
if ( (photo))
{
buf.push("<img id=\"updateImage\"" + (jade.attr("src", "https://sbpyouth.blob.core.windows.net/imgcontainer/" + (photoName) + "", true, false)) + " class=\"fitImg\"/><input type=\"hidden\" name=\"photo\"" + (jade.attr("value", "https://sbpyouth.blob.core.windows.net/imgcontainer/" + (photoName) + "", true, false)) + "/>");
}
else
{
buf.push("<img id=\"updateImage\" src=\"/public/img/image.png\" class=\"fitImg\"/>");
}
buf.push("</label><div class=\"content\"><a onclick=\"UploadSubmit()\" class=\"ui big red ribbon label\"> \nedit</a><br/><br/><a onclick=\"ModalProfile()\" class=\"header\">" + (jade.escape((jade_interp = name) == null ? '' : jade_interp)) + "</a><div class=\"meta\"><span class=\"date\">" + (jade.escape((jade_interp = birthYear) == null ? '' : jade_interp)) + "." + (jade.escape((jade_interp = birthMonth) == null ? '' : jade_interp)) + "." + (jade.escape((jade_interp = birthDay) == null ? '' : jade_interp)) + "</span></div><table style=\"padding-left:0px; padding-right:0px\" class=\"profile ui very basic small table\"><tr> <td>성별</td><td><div class=\"ui input\"><input type=\"text\" name=\"gender\"" + (jade.attr("value", "" + (gender) + "", true, false)) + "/></div></td></tr><tr> <td>브랜치</td><td> <div class=\"ui input\"><input type=\"text\" name=\"branch\"" + (jade.attr("value", "" + (branch) + "", true, false)) + "/></div></td></tr><tr> <td>전화번호</td><td> <div class=\"ui input\"><input type=\"text\" name=\"phone\"" + (jade.attr("value", "" + (phone) + "", true, false)) + "/></div></td></tr><tr> <td>이메일</td><td> <div class=\"ui input\"><input type=\"text\" name=\"mail\"" + (jade.attr("value", "" + (mail || '') + "", true, false)) + "/></div></td></tr><tr> <td>출석빈도</td><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\" name=\"attend\"" + (jade.attr("value", "" + (attend) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\">" + (jade.escape((jade_interp = attendString) == null ? '' : jade_interp)) + "</div><div class=\"menu\"><div data-value=\"0\" style=\"min-width:100px; max-height:30px\" class=\"item\">안 나옴</div><div data-value=\"1\" style=\"min-width:100px; max-height:30px\" class=\"item\">가끔 나옴</div><div data-value=\"2\" style=\"min-width:100px; max-height:30px\" class=\"item\">종종 나옴</div><div data-value=\"3\" style=\"min-width:100px; max-height:30px\" class=\"item\">잘 나옴</div><div data-value=\"4\" style=\"min-width:100px; max-height:30px\" class=\"item\">매주 나옴</div></div></div></td></tr><tr> <td>성격</td><td class=\"center aligned\"><div style=\"min-width:100px;\" class=\"ui selection dropdown\"><input type=\"hidden\" name=\"tension\"" + (jade.attr("value", "" + (tension) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\">" + (jade.escape((jade_interp = tensionString) == null ? '' : jade_interp)) + "</div><div class=\"menu\"><div data-value=\"0\" style=\"min-width:100px; max-height:30px\" class=\"item\">과묵함</div><div data-value=\"1\" style=\"min-width:100px; max-height:30px\" class=\"item\">내성적임</div><div data-value=\"2\" style=\"min-width:100px; max-height:30px\" class=\"item\">일반적임</div><div data-value=\"3\" style=\"min-width:100px; max-height:30px\" class=\"item\">사교적임</div><div data-value=\"4\" style=\"min-width:100px; max-height:30px\" class=\"item\">매우 활발함</div></div></div></td></tr><tr> <td>비고사항</td><td> <div class=\"ui input\"><input type=\"text\" name=\"attendDesc\"" + (jade.attr("value", "" + (attendDesc || '') + "", true, false)) + "/></div></td></tr><tr> <td>소속</td><td> <div class=\"ui input\"><input type=\"text\" name=\"part\"" + (jade.attr("value", "" + (part) + "", true, false)) + "/></div></td></tr><tr> <td>브랜치 역할</td><td> <div class=\"ui input\"><input type=\"text\" name=\"charge\"" + (jade.attr("value", "" + (charge||'') + "", true, false)) + "/></div></td></tr><tr> <td>봉사 부서</td><td> <div class=\"ui input\"><input type=\"text\" name=\"service\"" + (jade.attr("value", "" + (service || '') + "", true, false)) + "/></div></td></tr><tr> <td>거주지</td><td> <div class=\"ui input\"><input type=\"text\" name=\"locate\"" + (jade.attr("value", "" + (locate || '') + "", true, false)) + "/></div></td></tr><tr> <td>출생년도</td><td> <div class=\"ui input\"><input type=\"text\" name=\"birthYear\"" + (jade.attr("value", "" + (birthYear || '') + "", true, false)) + "/></div></td></tr><tr> <td>출생월</td><td> <div class=\"ui input\"><input type=\"text\" name=\"birthMonth\"" + (jade.attr("value", "" + (birthMonth || '') + "", true, false)) + "/></div></td></tr><tr> <td>출생일</td><td> <div class=\"ui input\"><input type=\"text\" name=\"birthDay\"" + (jade.attr("value", "" + (birthDay || '') + "", true, false)) + "/></div></td></tr></table></div><div class=\"ui two bottom attached buttons\"><div" + (jade.attr("onclick", "DeleteMember(" + (PartitionKey) + ",'" + (name) + "')", true, false)) + " class=\"ui red button\"><i class=\"remove icon\"> </i>Delete</div><div onclick=\"UploadSubmit()\" class=\"ui button\"><i class=\"write icon\"> </i>Edit</div></div><input type=\"submit\" hidden=\"hidden\"/></div><input id=\"uploadInput\" type=\"file\" name=\"upload\" accept=\"image/*\" onchange=\"ReadURL(this)\" class=\"filebox upload\"/></form>");}.call(this,"PartitionKey" in locals_for_with?locals_for_with.PartitionKey:typeof PartitionKey!=="undefined"?PartitionKey:undefined,"attend" in locals_for_with?locals_for_with.attend:typeof attend!=="undefined"?attend:undefined,"attendDesc" in locals_for_with?locals_for_with.attendDesc:typeof attendDesc!=="undefined"?attendDesc:undefined,"attendString" in locals_for_with?locals_for_with.attendString:typeof attendString!=="undefined"?attendString:undefined,"birthDay" in locals_for_with?locals_for_with.birthDay:typeof birthDay!=="undefined"?birthDay:undefined,"birthMonth" in locals_for_with?locals_for_with.birthMonth:typeof birthMonth!=="undefined"?birthMonth:undefined,"birthYear" in locals_for_with?locals_for_with.birthYear:typeof birthYear!=="undefined"?birthYear:undefined,"branch" in locals_for_with?locals_for_with.branch:typeof branch!=="undefined"?branch:undefined,"charge" in locals_for_with?locals_for_with.charge:typeof charge!=="undefined"?charge:undefined,"gender" in locals_for_with?locals_for_with.gender:typeof gender!=="undefined"?gender:undefined,"locate" in locals_for_with?locals_for_with.locate:typeof locate!=="undefined"?locate:undefined,"mail" in locals_for_with?locals_for_with.mail:typeof mail!=="undefined"?mail:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"part" in locals_for_with?locals_for_with.part:typeof part!=="undefined"?part:undefined,"phone" in locals_for_with?locals_for_with.phone:typeof phone!=="undefined"?phone:undefined,"photo" in locals_for_with?locals_for_with.photo:typeof photo!=="undefined"?photo:undefined,"photoName" in locals_for_with?locals_for_with.photoName:typeof photoName!=="undefined"?photoName:undefined,"service" in locals_for_with?locals_for_with.service:typeof service!=="undefined"?service:undefined,"tension" in locals_for_with?locals_for_with.tension:typeof tension!=="undefined"?tension:undefined,"tensionString" in locals_for_with?locals_for_with.tensionString:typeof tensionString!=="undefined"?tensionString:undefined,"year" in locals_for_with?locals_for_with.year:typeof year!=="undefined"?year:undefined));;return buf.join("");
}
function addMember_template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (chargeGroup, chargeName, chargeYear, name, num, undefined) {
buf.push("<div class=\"four fields\"><div class=\"field\"><label>이름</label><input" + (jade.attr("name", "add_name[" + (num) + "]", true, false)) + " placeholder=\"이름\" type=\"text\"" + (jade.attr("value", "" + (name) + "", true, false)) + "/></div><div class=\"field\"><label>직책</label><input" + (jade.attr("name", "add_chargeName[" + (num) + "]", true, false)) + " placeholder=\"직책, 혹은 브랜치\" type=\"text\"" + (jade.attr("value", "" + (chargeName) + "", true, false)) + "/></div><div class=\"field\"><label>소속</label><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\"" + (jade.attr("name", "add_chargeGroup[" + (num) + "]", true, false)) + (jade.attr("value", "" + (chargeGroup) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\">" + (jade.escape((jade_interp = chargeGroup) == null ? '' : jade_interp)) + "</div><div class=\"menu\">");
var sections = ['교회', '임원', 'BS', '팀장', '부장 집사'];
// iterate sections
;(function(){
  var $$obj = sections;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var ss = $$obj[$index];

buf.push("<div" + (jade.attr("data-value", "" + (ss) + "", true, false)) + " class=\"item\">" + (jade.escape((jade_interp = ss) == null ? '' : jade_interp)) + "</div>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var ss = $$obj[$index];

buf.push("<div" + (jade.attr("data-value", "" + (ss) + "", true, false)) + " class=\"item\">" + (jade.escape((jade_interp = ss) == null ? '' : jade_interp)) + "</div>");
    }

  }
}).call(this);

buf.push("</div></div></td></div><div class=\"field\"><label>년도</label><input" + (jade.attr("name", "add_chargeYear[" + (num) + "]", true, false)) + " placeholder=\"년도\" type=\"text\"" + (jade.attr("value", "" + (chargeYear) + "", true, false)) + "/></div></div>");}.call(this,"chargeGroup" in locals_for_with?locals_for_with.chargeGroup:typeof chargeGroup!=="undefined"?chargeGroup:undefined,"chargeName" in locals_for_with?locals_for_with.chargeName:typeof chargeName!=="undefined"?chargeName:undefined,"chargeYear" in locals_for_with?locals_for_with.chargeYear:typeof chargeYear!=="undefined"?chargeYear:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"num" in locals_for_with?locals_for_with.num:typeof num!=="undefined"?num:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
}
function addMember_second(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (chargeGroup, chargeName, chargeYear, name, num, undefined) {
buf.push("<div class=\"four fields\"><div class=\"field\"><input" + (jade.attr("name", "add_name[" + (num) + "]", true, false)) + " placeholder=\"이름\" type=\"text\"" + (jade.attr("value", "" + (name) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_chargeName[" + (num) + "]", true, false)) + " placeholder=\"직책, 혹은 브랜치\" type=\"text\"" + (jade.attr("value", "" + (chargeName) + "", true, false)) + "/></div><div class=\"field\"><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\"" + (jade.attr("name", "add_chargeGroup[" + (num) + "]", true, false)) + (jade.attr("value", "" + (chargeGroup) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\">" + (jade.escape((jade_interp = chargeGroup) == null ? '' : jade_interp)) + " </div><div class=\"menu\">");
var sections = ['교회', '임원', 'BS', '팀장', '부장 집사'];
// iterate sections
;(function(){
  var $$obj = sections;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var ss = $$obj[$index];

buf.push("<div" + (jade.attr("data-value", "" + (ss) + "", true, false)) + " class=\"item\">" + (jade.escape((jade_interp = ss) == null ? '' : jade_interp)) + "</div>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var ss = $$obj[$index];

buf.push("<div" + (jade.attr("data-value", "" + (ss) + "", true, false)) + " class=\"item\">" + (jade.escape((jade_interp = ss) == null ? '' : jade_interp)) + "</div>");
    }

  }
}).call(this);

buf.push("</div></div></td></div><div class=\"field\"><input" + (jade.attr("name", "add_chargeYear[" + (num) + "]", true, false)) + " placeholder=\"년도\" type=\"text\"" + (jade.attr("value", "" + (chargeYear) + "", true, false)) + "/></div></div>");}.call(this,"chargeGroup" in locals_for_with?locals_for_with.chargeGroup:typeof chargeGroup!=="undefined"?chargeGroup:undefined,"chargeName" in locals_for_with?locals_for_with.chargeName:typeof chargeName!=="undefined"?chargeName:undefined,"chargeYear" in locals_for_with?locals_for_with.chargeYear:typeof chargeYear!=="undefined"?chargeYear:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"num" in locals_for_with?locals_for_with.num:typeof num!=="undefined"?num:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
}
function addPerson_template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (attend, birthDay, birthMonth, birthYear, gender, name, num, phone, tension) {
buf.push("<div class=\"eight fields\"><div class=\"field\"><label>이름</label><input" + (jade.attr("name", "add_name[" + (num) + "]", true, false)) + " placeholder=\"이름\" type=\"text\"" + (jade.attr("value", "" + (name) + "", true, false)) + "/></div><div class=\"field\"><label>성별</label><input" + (jade.attr("name", "add_gender[" + (num) + "]", true, false)) + " placeholder=\"성별\" type=\"text\"" + (jade.attr("value", "" + (gender) + "", true, false)) + "/></div><div class=\"field\"><label>전화번호</label><input" + (jade.attr("name", "add_phone[" + (num) + "]", true, false)) + " placeholder=\"소속\" type=\"text\"" + (jade.attr("value", "" + (phone) + "", true, false)) + "/></div><div class=\"field\"><label>출생년도</label><input" + (jade.attr("name", "add_birthYear[" + (num) + "]", true, false)) + " placeholder=\"년도 (2자리)\" type=\"text\"" + (jade.attr("value", "" + (birthYear) + "", true, false)) + "/></div><div class=\"field\"><label>출생 월</label><input" + (jade.attr("name", "add_birthMonth[" + (num) + "]", true, false)) + " placeholder=\"월\" type=\"text\"" + (jade.attr("value", "" + (birthMonth) + "", true, false)) + "/></div><div class=\"field\"><label>출생 날짜</label><input" + (jade.attr("name", "add_birthDay[" + (num) + "]", true, false)) + " placeholder=\"일\" type=\"text\"" + (jade.attr("value", "" + (birthDay) + "", true, false)) + "/></div><div class=\"field\"><label>성격</label><input" + (jade.attr("name", "add_tension[" + (num) + "]", true, false)) + " placeholder=\"성격\" type=\"text\"" + (jade.attr("value", "" + (tension) + "", true, false)) + "/></div><div class=\"field\"><label>출석빈도</label><input" + (jade.attr("name", "add_attend[" + (num) + "]", true, false)) + " placeholder=\"출석빈도\" type=\"text\"" + (jade.attr("value", "" + (attend) + "", true, false)) + "/></div></div>");}.call(this,"attend" in locals_for_with?locals_for_with.attend:typeof attend!=="undefined"?attend:undefined,"birthDay" in locals_for_with?locals_for_with.birthDay:typeof birthDay!=="undefined"?birthDay:undefined,"birthMonth" in locals_for_with?locals_for_with.birthMonth:typeof birthMonth!=="undefined"?birthMonth:undefined,"birthYear" in locals_for_with?locals_for_with.birthYear:typeof birthYear!=="undefined"?birthYear:undefined,"gender" in locals_for_with?locals_for_with.gender:typeof gender!=="undefined"?gender:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"num" in locals_for_with?locals_for_with.num:typeof num!=="undefined"?num:undefined,"phone" in locals_for_with?locals_for_with.phone:typeof phone!=="undefined"?phone:undefined,"tension" in locals_for_with?locals_for_with.tension:typeof tension!=="undefined"?tension:undefined));;return buf.join("");
}
function addPerson_second(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (attend, birthDay, birthMonth, birthYear, gender, name, num, phone, tension) {
buf.push("<div class=\"eight fields\"><div class=\"field\"><input" + (jade.attr("name", "add_name[" + (num) + "]", true, false)) + " placeholder=\"이름\" type=\"text\"" + (jade.attr("value", "" + (name) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_gender[" + (num) + "]", true, false)) + " placeholder=\"성별\" type=\"text\"" + (jade.attr("value", "" + (gender) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_phone[" + (num) + "]", true, false)) + " placeholder=\"소속\" type=\"text\"" + (jade.attr("value", "" + (phone) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_birthYear[" + (num) + "]", true, false)) + " placeholder=\"년도 (2자리)\" type=\"text\"" + (jade.attr("value", "" + (birthYear) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_birthMonth[" + (num) + "]", true, false)) + " placeholder=\"월\" type=\"text\"" + (jade.attr("value", "" + (birthMonth) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_birthDay[" + (num) + "]", true, false)) + " placeholder=\"일\" type=\"text\"" + (jade.attr("value", "" + (birthDay) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_tension[" + (num) + "]", true, false)) + " placeholder=\"성격\" type=\"text\"" + (jade.attr("value", "" + (tension) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_attend[" + (num) + "]", true, false)) + " placeholder=\"출석빈도\" type=\"text\"" + (jade.attr("value", "" + (attend) + "", true, false)) + "/></div></div>");}.call(this,"attend" in locals_for_with?locals_for_with.attend:typeof attend!=="undefined"?attend:undefined,"birthDay" in locals_for_with?locals_for_with.birthDay:typeof birthDay!=="undefined"?birthDay:undefined,"birthMonth" in locals_for_with?locals_for_with.birthMonth:typeof birthMonth!=="undefined"?birthMonth:undefined,"birthYear" in locals_for_with?locals_for_with.birthYear:typeof birthYear!=="undefined"?birthYear:undefined,"gender" in locals_for_with?locals_for_with.gender:typeof gender!=="undefined"?gender:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"num" in locals_for_with?locals_for_with.num:typeof num!=="undefined"?num:undefined,"phone" in locals_for_with?locals_for_with.phone:typeof phone!=="undefined"?phone:undefined,"tension" in locals_for_with?locals_for_with.tension:typeof tension!=="undefined"?tension:undefined));;return buf.join("");
}
function addBranch_template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (attendDesc, branch, name, num, year) {
buf.push("<div class=\"four fields\"><div class=\"field\"><label>이름</label><input" + (jade.attr("name", "add_name[" + (num) + "]", true, false)) + " placeholder=\"이름\" type=\"text\"" + (jade.attr("value", "" + (name) + "", true, false)) + "/></div><div class=\"field\"><label>브랜치</label><input" + (jade.attr("name", "add_branch[" + (num) + "]", true, false)) + " placeholder=\"브랜치\" type=\"text\"" + (jade.attr("value", "" + (branch) + "", true, false)) + "/></div><div class=\"field\"><label>비고</label><div class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\"" + (jade.attr("name", "add_attendDesc[" + (num) + "]", true, false)) + (jade.attr("value", "" + (attendDesc) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\">" + (jade.escape((jade_interp = attendDesc) == null ? '' : jade_interp)) + "</div><div class=\"menu\"><div data-value=\"기본\" style=\"min-width:100px; max-height:30px\" class=\"item\">기본</div><div data-value=\"청1부\" style=\"min-width:100px; max-height:30px\" class=\"item\">청1부</div><div data-value=\"청2부\" style=\"min-width:100px; max-height:30px\" class=\"item\">청2부</div><div data-value=\"군대\" style=\"min-width:100px; max-height:30px\" class=\"item\">군대</div><div data-value=\"유학\" style=\"min-width:100px; max-height:30px\" class=\"item\">유학</div><div data-value=\"bs\" style=\"min-width:100px; max-height:30px\" class=\"item\">bs</div></div></div></div></div><div class=\"field\"><label>년도</label><input" + (jade.attr("name", "add_year[" + (num) + "]", true, false)) + " placeholder=\"년도\" type=\"text\"" + (jade.attr("value", "" + (year) + "", true, false)) + "/></div></div>");}.call(this,"attendDesc" in locals_for_with?locals_for_with.attendDesc:typeof attendDesc!=="undefined"?attendDesc:undefined,"branch" in locals_for_with?locals_for_with.branch:typeof branch!=="undefined"?branch:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"num" in locals_for_with?locals_for_with.num:typeof num!=="undefined"?num:undefined,"year" in locals_for_with?locals_for_with.year:typeof year!=="undefined"?year:undefined));;return buf.join("");
}
function addBranch_second(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (attendDesc, branch, name, num, year) {
buf.push("<div class=\"four fields\"><div class=\"field\"><input" + (jade.attr("name", "add_name[" + (num) + "]", true, false)) + " placeholder=\"이름\" type=\"text\"" + (jade.attr("value", "" + (name) + "", true, false)) + "/></div><div class=\"field\"><input" + (jade.attr("name", "add_branch[" + (num) + "]", true, false)) + " placeholder=\"브랜치\" type=\"text\"" + (jade.attr("value", "" + (branch) + "", true, false)) + "/></div><div class=\"field\"><div class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\"" + (jade.attr("name", "add_attendDesc[" + (num) + "]", true, false)) + (jade.attr("value", "" + (attendDesc) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\">" + (jade.escape((jade_interp = attendDesc) == null ? '' : jade_interp)) + "</div><div class=\"menu\"><div data-value=\"기본\" style=\"min-width:100px; max-height:30px\" class=\"item\">기본</div><div data-value=\"청1부\" style=\"min-width:100px; max-height:30px\" class=\"item\">청1부</div><div data-value=\"청2부\" style=\"min-width:100px; max-height:30px\" class=\"item\">청2부</div><div data-value=\"군대\" style=\"min-width:100px; max-height:30px\" class=\"item\">군대</div><div data-value=\"유학\" style=\"min-width:100px; max-height:30px\" class=\"item\">유학</div><div data-value=\"bs\" style=\"min-width:100px; max-height:30px\" class=\"item\">bs</div></div></div></div></div><div class=\"field\"><input" + (jade.attr("name", "add_year[" + (num) + "]", true, false)) + " placeholder=\"년도\" type=\"text\"" + (jade.attr("value", "" + (year) + "", true, false)) + "/></div></div>");}.call(this,"attendDesc" in locals_for_with?locals_for_with.attendDesc:typeof attendDesc!=="undefined"?attendDesc:undefined,"branch" in locals_for_with?locals_for_with.branch:typeof branch!=="undefined"?branch:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"num" in locals_for_with?locals_for_with.num:typeof num!=="undefined"?num:undefined,"year" in locals_for_with?locals_for_with.year:typeof year!=="undefined"?year:undefined));;return buf.join("");
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
function modalMemberProfile(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (data) {
buf.push("<form id=\"editMember\"" + (jade.attr("action", "/saveProfile/" + (data.RowKey) + "", true, false)) + " enctype=\"multipart/form-data\" method=\"post\" class=\"form\"><div class=\"ui raised segment\"><div class=\"ui grid\"><div class=\"two column computer only row\"><div class=\"four wide streched column\"><div class=\"ui card\"><input type=\"hidden\" name=\"PartitionKey\"" + (jade.attr("value", "" + (data.PartitionKey) + "", true, false)) + "/><input type=\"hidden\" name=\"RowKey\"" + (jade.attr("value", "" + (data.name) + "", true, false)) + "/><label style=\"background-color:#e5e5e5\" for=\"uploadInput\" class=\"image outImg\">");
if ( (data.usingPhoto == 'true'))
{
buf.push("<img id=\"photo\"" + (jade.attr("src", "" + (data.userPhoto||'') + "", true, false)) + " class=\"fitImg\"/>");
}
else if ( (data.photo))
{
buf.push("<img id=\"updateImage\"" + (jade.attr("src", "" + (data.photo||'') + "", true, false)) + " class=\"fitImg\"/><input type=\"hidden\" name=\"photo\"" + (jade.attr("value", "" + (data.photo||'') + "", true, false)) + "/>");
}
else
{
buf.push("<img id=\"updateImage\" src=\"/public/img/image.png\" class=\"fitImg\"/>");
}
buf.push("</label></div><div><table class=\"ui center aligned very basic small table\"><tbody><tr><td>교회 출석</td><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\" name=\"attend\"" + (jade.attr("value", "" + (data.attend || 0) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\"></div><div class=\"menu\"><div data-value=\"0\" class=\"item\">안나옴</div><div data-value=\"1\" class=\"item\">잘 모름</div><div data-value=\"2\" class=\"item\">종종 나옴</div><div data-value=\"3\" class=\"item\">잘 나옴</div><div data-value=\"4\" class=\"item\">매주 나옴</div></div></div></td></tr><tr><td>사교성</td><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\" name=\"tension\"" + (jade.attr("value", "" + (data.tension || 0) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\"></div><div class=\"menu\"><div data-value=\"0\" class=\"item\">알수없음</div><div data-value=\"1\" class=\"item\">모자람</div><div data-value=\"2\" class=\"item\">평범함</div><div data-value=\"3\" class=\"item\">좋음</div><div data-value=\"4\" class=\"item\">특출남</div></div></div></td></tr><tr><td>행사 참여</td><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\" name=\"attendEvent\"" + (jade.attr("value", "" + (data.attendEvent || 0) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\"></div><div class=\"menu\"><div data-value=\"0\" class=\"item\">안나옴</div><div data-value=\"1\" class=\"item\">잘 모름</div><div data-value=\"2\" class=\"item\">종종 참여</div><div data-value=\"3\" class=\"item\">잘 참여</div><div data-value=\"4\" class=\"item\">거의 참여</div></div></div></td></tr><tr><td>신앙 지식</td><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\" name=\"theology\"" + (jade.attr("value", "" + (data.theology || 0) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\"></div><div class=\"menu\"><div data-value=\"0\" class=\"item\">알수없음</div><div data-value=\"1\" class=\"item\">모자람</div><div data-value=\"2\" class=\"item\">평범함</div><div data-value=\"3\" class=\"item\">좋음</div><div data-value=\"4\" class=\"item\">특출남</div></div></div></td></tr><tr><td>성실함</td><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\" name=\"faithful\"" + (jade.attr("value", "" + (data.faithful || 0) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\"></div><div class=\"menu\"><div data-value=\"0\" class=\"item\">알수없음</div><div data-value=\"1\" class=\"item\">모자람</div><div data-value=\"2\" class=\"item\">평범함</div><div data-value=\"3\" class=\"item\">좋음</div><div data-value=\"4\" class=\"item\">특출남</div></div></div></td></tr><tr><td>배려심</td><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\" name=\"care\"" + (jade.attr("value", "" + (data.care || 0) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\"></div><div class=\"menu\"><div data-value=\"0\" class=\"item\">알수없음</div><div data-value=\"1\" class=\"item\">모자람</div><div data-value=\"2\" class=\"item\">평범함</div><div data-value=\"3\" class=\"item\">좋음</div><div data-value=\"4\" class=\"item\">특출남</div></div></div></td></tr><tr><td>운동 능력</td><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\" name=\"physical\"" + (jade.attr("value", "" + (data.physical || 0) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\"></div><div class=\"menu\"><div data-value=\"0\" class=\"item\">알수없음</div><div data-value=\"1\" class=\"item\">모자람</div><div data-value=\"2\" class=\"item\">평범함</div><div data-value=\"3\" class=\"item\">좋음</div><div data-value=\"4\" class=\"item\">특출남</div></div></div></td></tr><tr><td>지혜</td><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\" name=\"wisdom\"" + (jade.attr("value", "" + (data.wisdom || 0) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\"></div><div class=\"menu\"><div data-value=\"0\" class=\"item\">알수없음</div><div data-value=\"1\" class=\"item\">모자람</div><div data-value=\"2\" class=\"item\">평범함</div><div data-value=\"3\" class=\"item\">좋음</div><div data-value=\"4\" class=\"item\">특출남</div></div></div></td></tr><tr><td>순발력</td><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\" name=\"impulse\"" + (jade.attr("value", "" + (data.impulse || 0) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\"></div><div class=\"menu\"><div data-value=\"0\" class=\"item\">알수없음</div><div data-value=\"1\" class=\"item\">모자람</div><div data-value=\"2\" class=\"item\">평범함</div><div data-value=\"3\" class=\"item\">좋음</div><div data-value=\"4\" class=\"item\">특출남</div></div></div></td></tr><tr><td>유머</td><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\" name=\"sociality\"" + (jade.attr("value", "" + (data.sociality || 0) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\"></div><div class=\"menu\"><div data-value=\"0\" class=\"item\">알수없음</div><div data-value=\"1\" class=\"item\">모자람</div><div data-value=\"2\" class=\"item\">평범함</div><div data-value=\"3\" class=\"item\">좋음</div><div data-value=\"4\" class=\"item\">특출남</div></div></div></td></tr><tr><td>인내력(멘탈)</td><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\" name=\"endurance\"" + (jade.attr("value", "" + (data.endurance || 0) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\"></div><div class=\"menu\"><div data-value=\"0\" class=\"item\">알수없음</div><div data-value=\"1\" class=\"item\">모자람</div><div data-value=\"2\" class=\"item\">평범함</div><div data-value=\"3\" class=\"item\">좋음</div><div data-value=\"4\" class=\"item\">특출남</div></div></div></td></tr><tr><td>세심함</td><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\" name=\"careful\"" + (jade.attr("value", "" + (data.careful || 0) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\"></div><div class=\"menu\"><div data-value=\"0\" class=\"item\">알수없음</div><div data-value=\"1\" class=\"item\">모자람</div><div data-value=\"2\" class=\"item\">평범함</div><div data-value=\"3\" class=\"item\">좋음</div><div data-value=\"4\" class=\"item\">특출남</div></div></div></td></tr><tr><td>기억력</td><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\" name=\"memory\"" + (jade.attr("value", "" + (data.memory || 0) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\"></div><div class=\"menu\"><div data-value=\"0\" class=\"item\">알수없음</div><div data-value=\"1\" class=\"item\">모자람</div><div data-value=\"2\" class=\"item\">평범함</div><div data-value=\"3\" class=\"item\">좋음</div><div data-value=\"4\" class=\"item\">특출남</div></div></div></td></tr><tr><td>감수성</td><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\" name=\"sensitivity\"" + (jade.attr("value", "" + (data.sensitivity || 0) + "", true, false)) + "/><i class=\"dropdown icon\"></i><div class=\"text\"></div><div class=\"menu\"><div data-value=\"0\" class=\"item\">알수없음</div><div data-value=\"1\" class=\"item\">모자람</div><div data-value=\"2\" class=\"item\">평범함</div><div data-value=\"3\" class=\"item\">좋음</div><div data-value=\"4\" class=\"item\">특출남</div></div></div></td></tr></tbody></table></div></div><div class=\"twelve wide streched column\"><div class=\"ui container\"><h3 class=\"ui header\"><div style=\"width:100%\" class=\"content ui grid\"><div class=\"two column row\"><div class=\"twelve wide streched column\">" + (jade.escape((jade_interp = data.RowKey) == null ? '' : jade_interp)) + "<div class=\"sub header\">" + (jade.escape((jade_interp = data.birthYear) == null ? '' : jade_interp)) + "." + (jade.escape((jade_interp = data.birthMonth) == null ? '' : jade_interp)) + "." + (jade.escape((jade_interp = data.birthDay) == null ? '' : jade_interp)) + "</div></div><div class=\"four wide streched column\"><a onclick=\"EditSubmit()\" style=\"position:absolute; right:0px\" class=\"ui big red label\"><i class=\"write icon\"> </i>수정</a></div></div></div><div class=\"ui mini relaxed celled list\"><div class=\"item\"><div class=\"ui blue image label\"><i style=\"width:15px; padding-left:2px\" class=\"big calendar middle aligned icon\"></i></div><div class=\"content\"><div class=\"header\">나이 (수정 불가)</div><div><h3 style=\"color:gray\" class=\"description\"> \n" + (jade.escape((jade_interp = data.age) == null ? '' : jade_interp)) + "</h3></div></div></div><div class=\"item\"><div class=\"ui blue image label\"><i style=\"width:15px; padding-left:0px\" class=\"big heterosexual middle aligned icon\"></i></div><div class=\"content\"><div class=\"header\">성별</div><div><div class=\"ui input\"><input type=\"text\" name=\"gender\"" + (jade.attr("value", "" + (data.gender || '') + "", true, false)) + " placeholder=\"알수없음\"/></div></div></div></div><div class=\"item\"><div class=\"ui blue image label\"><i style=\"width:15px; padding-left:6px\" class=\"big theme middle aligned icon\"></i></div><div class=\"content\"><div class=\"header\">혈액형</div><div><div class=\"ui input\"><input type=\"text\" name=\"blood\"" + (jade.attr("value", "" + (data.blood || '') + "", true, false)) + " placeholder=\"알수없음\"/></div></div></div></div><div class=\"item\"><div class=\"ui blue image label\"><i style=\"width:15px; padding-left:3px\" class=\"big certificate middle aligned icon\"></i></div><div class=\"content\"><div class=\"header\">브랜치</div><div><div class=\"ui input\"><input type=\"text\" name=\"branch\"" + (jade.attr("value", "" + (data.branch || '') + "", true, false)) + " placeholder=\"알수없음\"/></div></div></div></div><div class=\"item\"><div class=\"ui blue image label\"><i style=\"width:15px; padding-left:3px\" class=\"big phone middle aligned icon\"></i></div><div class=\"content\"><div class=\"header\">전화번호</div><div><div class=\"ui input\"><input type=\"text\" name=\"phone\"" + (jade.attr("value", "" + (data.phone || '') + "", true, false)) + "/></div></div></div></div><div class=\"item\"><div class=\"ui blue image label\"><i style=\"width:15px; padding-left:1px\" class=\"big mail middle aligned icon\"></i></div><div class=\"content\"><div class=\"header\">메일</div><div><div class=\"ui input\"><input type=\"text\" name=\"mail\"" + (jade.attr("value", "" + (data.mail || '') + "", true, false)) + " placeholder=\"알수없음\"/></div></div></div></div><div class=\"item\"><div class=\"ui blue image label\"><i style=\"width:15px; padding-left:1px\" class=\"big music middle aligned icon\"></i></div><div class=\"content\"><div class=\"header\">연주 가능 악기</div><div><div class=\"ui input\"><input type=\"text\" name=\"instrument\"" + (jade.attr("value", "" + (data.instrument || '') + "", true, false)) + " placeholder=\"알수없음\"/></div></div></div></div><div class=\"item\"><div class=\"ui blue image label\"><i style=\"width:15px; padding-left:3px\" class=\"big tag middle aligned icon\"></i></div><div class=\"content\"><div class=\"header\">봉사 부서</div><div><div class=\"ui input\"><input type=\"text\" name=\"service\"" + (jade.attr("value", "" + (data.service || '') + "", true, false)) + " placeholder=\"없음\"/></div></div></div></div><div class=\"item\"><div class=\"ui blue image label\"><i style=\"width:15px; padding-left:1px\" class=\"big browser middle aligned icon\"></i></div><div class=\"content\"><div class=\"header\">봉사 이력</div><div><div class=\"ui input\"><input type=\"text\" name=\"serviceHistory\"" + (jade.attr("value", "" + (data.serviceHistory || '') + "", true, false)) + " placeholder=\"없음\"/></div></div></div></div><div class=\"item\"><div class=\"ui blue image label\"><i style=\"width:15px; padding-left:3px\" class=\"big write middle aligned icon\"></i></div><div class=\"content\"><div class=\"header\">학과</div><div><div class=\"ui input\"><input type=\"text\" name=\"major\"" + (jade.attr("value", "" + (data.major || '') + "", true, false)) + " placeholder=\"알수없음\"/></div></div></div></div><div class=\"item\"><div class=\"ui blue image label\"><i style=\"width:15px; padding-left:1px\" class=\"big soccer middle aligned icon\"></i></div><div class=\"content\"><div class=\"header\">좋아하는 운동</div><div><div class=\"ui input\"><input type=\"text\" name=\"likeSports\"" + (jade.attr("value", "" + (data.likeSports || '') + "", true, false)) + " placeholder=\"알수없음\"/></div></div></div></div><div class=\"item\"><div class=\"ui blue image label\"><i style=\"width:15px; padding-left:1px\" class=\"big game middle aligned icon\"></i></div><div class=\"content\"><div class=\"header\">좋아하는 게임</div><div><div class=\"ui input\"><input type=\"text\" name=\"likeGames\"" + (jade.attr("value", "" + (data.likeGames || '') + "", true, false)) + " placeholder=\"알수없음\"/></div></div></div></div><div class=\"item\"><div class=\"ui blue image label\"><i style=\"width:15px; padding-left:6px\" class=\"big male middle aligned icon\"></i></div><div class=\"content\"><div class=\"header\">단짝 친구</div><div><div class=\"ui input\"><input type=\"text\" name=\"likeFriends\"" + (jade.attr("value", "" + (data.likeFriends || '') + "", true, false)) + " placeholder=\"알수없음\"/></div></div></div></div><div class=\"item\"><div class=\"ui blue image label\"><i style=\"width:15px; padding-left:2px\" class=\"big home middle aligned icon\"></i></div><div class=\"content\"><div class=\"header\">거주지</div><div><div class=\"ui input\"><input type=\"text\" name=\"locate\"" + (jade.attr("value", "" + (data.locate || '') + "", true, false)) + " placeholder=\"알수없음\"/></div></div></div></div><div class=\"item\"><div class=\"ui blue image label\"><i style=\"width:15px; padding-left:9px\" class=\"big info middle aligned icon\"></i></div><div class=\"content\"><div class=\"header\">특이사항</div><div><div class=\"ui input\"><input type=\"text\" name=\"attendDesc\"" + (jade.attr("value", "" + (data.attendDesc || '') + "", true, false)) + " placeholder=\"\"/></div></div></div></div></div></h3></div><input id=\"uploadInput\" type=\"file\" name=\"upload\" accept=\"image/*\" onchange=\"ReadURL(this)\" class=\"filebox upload\"/></div></div></div></div></form>");}.call(this,"data" in locals_for_with?locals_for_with.data:typeof data!=="undefined"?data:undefined));;return buf.join("");
}
function bankTable(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (auth, curMoney, off, part, part1, part2, totalBank, totalCur) {
jade_mixins["ShowBankTable"] = jade_interp = function(part2){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<div class=\"computer tablet only row\">");
var sections = ['브랜치 모임', '훈련/회의비', '예산', '소모임/단합친교비', '생일축하 및 상품', '특새', '성탄절/찬양준비/특송', '심방비(경조사)', '팀별/부서사역비', '격려/환송/결혼', '소모품/기타', '성경교재/교육자료', '임원/리더워크숍', '또래/수평모임', '체육행사', '특강비', '겨울수련회', '여름수련회', '야유회', '말씀사경회', '총회', '체육행사', '신입생 OT', '신입생 환영회', '수능 수험생 격려', '소그룹 성경공부', '어생주'];
buf.push("<div class=\"ui main container\"><table class=\"bank ui celled unstackable table\"><thead style=\"text-align:center\"><tr><th>집행 날짜</th><th>부서</th><th>구분</th><th>상세 내역</th><th>No</th><th>수입 금액</th><th>지출 금액</th><th>남은 금액</th><th>비고</th><th>정보</th><th>이체</th><th>삭제</th></tr></thead>");
if ( auth=="manager" || auth=="developer" )
{
buf.push("<tbody>");
var rowNum = 0;
// iterate part2.data
;(function(){
  var $$obj = part2.data;
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var item = $$obj[index];

rowNum++;
buf.push("<input type=\"hidden\"" + (jade.attr("name", "RowKey[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.RowKey) + "", true, false)) + "/><input type=\"hidden\"" + (jade.attr("name", "PartitionKey[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.PartitionKey) + "", true, false)) + "/><input type=\"hidden\"" + (jade.attr("name", "deleteRow[" + (part2.name) + "][" + (index) + "]", true, false)) + " value=\"false\"" + (jade.cls(["delete" + (part2.name) + "" + (index) + ""], [true])) + "/><tr onclick=\"SelectRow()\" href=\"#\"" + (jade.cls(["tr" + (part2.name) + "" + (index) + ""], [true])) + "><td> <div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "date[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.yearString) + "", true, false)) + " style=\"max-width:80px;\"" + (jade.cls(['txt','date',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td><div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "part[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.part) + "", true, false)) + " style=\"max-width:60px;\"" + (jade.cls(['txt','part',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\"" + (jade.attr("name", "section[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.section) + "", true, false)) + "/><i style=\"position:absolute; right:0px\" class=\"dropdown icon\"></i><div class=\"text\"> </div><div class=\"menu\">");
// iterate sections
;(function(){
  var $$obj = sections;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var ss = $$obj[$index];

buf.push("<div" + (jade.attr("data-value", "" + (ss) + "", true, false)) + " style=\"font-size:9px\" class=\"item\">" + (jade.escape((jade_interp = ss) == null ? '' : jade_interp)) + "</div>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var ss = $$obj[$index];

buf.push("<div" + (jade.attr("data-value", "" + (ss) + "", true, false)) + " style=\"font-size:9px\" class=\"item\">" + (jade.escape((jade_interp = ss) == null ? '' : jade_interp)) + "</div>");
    }

  }
}).call(this);

buf.push("</div></div></td><td><div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "content[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.content||'') + "", true, false)) + " style=\"max-width:100px\"" + (jade.cls(['txt','content',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td> <div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "receiptNo[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.receiptNo || '') + "", true, false)) + " style=\"max-width:25px\"" + (jade.cls(['txt','receiptNo',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td> <div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "gain[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.gain || '') + "", true, false)) + " style=\"max-width:70px\"" + (jade.cls(['txt','gain',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td> <div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "spend[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.spend || '') + "", true, false)) + " style=\"max-width:70px\"" + (jade.cls(['txt','spend',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td>" + (jade.escape((jade_interp = item.curMoney || '') == null ? '' : jade_interp)) + "</td><td> <div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "detail[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.detail || item.bankReceive || '') + "", true, false)) + " style=\"max-width:70px\"" + (jade.cls(['txt','detail',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td><i" + (jade.attr("data-content", "계좌번호: " + (item.bankNumber||'') + "(" + (item.bankName||'') + ")", true, false)) + " class=\"ui circular info icon\"></i></td><td><div class=\"ui fitted toggle checkbox\"><input type=\"checkbox\"" + (jade.attr("name", "paid[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("checked", item.paid||off, true, false)) + (jade.attr("value", index, true, false)) + "/><label></label></div></td><td style=\"text-align:center\"><div" + (jade.attr("onclick", "DeleteRow('" + (part2.name) + "', " + (index) + ")", true, false)) + " class=\"small ui red circular ban icon button\"><i class=\"icon ban\"></i></div></td></tr>");
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var item = $$obj[index];

rowNum++;
buf.push("<input type=\"hidden\"" + (jade.attr("name", "RowKey[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.RowKey) + "", true, false)) + "/><input type=\"hidden\"" + (jade.attr("name", "PartitionKey[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.PartitionKey) + "", true, false)) + "/><input type=\"hidden\"" + (jade.attr("name", "deleteRow[" + (part2.name) + "][" + (index) + "]", true, false)) + " value=\"false\"" + (jade.cls(["delete" + (part2.name) + "" + (index) + ""], [true])) + "/><tr onclick=\"SelectRow()\" href=\"#\"" + (jade.cls(["tr" + (part2.name) + "" + (index) + ""], [true])) + "><td> <div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "date[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.yearString) + "", true, false)) + " style=\"max-width:80px;\"" + (jade.cls(['txt','date',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td><div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "part[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.part) + "", true, false)) + " style=\"max-width:60px;\"" + (jade.cls(['txt','part',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\"" + (jade.attr("name", "section[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.section) + "", true, false)) + "/><i style=\"position:absolute; right:0px\" class=\"dropdown icon\"></i><div class=\"text\"> </div><div class=\"menu\">");
// iterate sections
;(function(){
  var $$obj = sections;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var ss = $$obj[$index];

buf.push("<div" + (jade.attr("data-value", "" + (ss) + "", true, false)) + " style=\"font-size:9px\" class=\"item\">" + (jade.escape((jade_interp = ss) == null ? '' : jade_interp)) + "</div>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var ss = $$obj[$index];

buf.push("<div" + (jade.attr("data-value", "" + (ss) + "", true, false)) + " style=\"font-size:9px\" class=\"item\">" + (jade.escape((jade_interp = ss) == null ? '' : jade_interp)) + "</div>");
    }

  }
}).call(this);

buf.push("</div></div></td><td><div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "content[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.content||'') + "", true, false)) + " style=\"max-width:100px\"" + (jade.cls(['txt','content',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td> <div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "receiptNo[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.receiptNo || '') + "", true, false)) + " style=\"max-width:25px\"" + (jade.cls(['txt','receiptNo',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td> <div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "gain[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.gain || '') + "", true, false)) + " style=\"max-width:70px\"" + (jade.cls(['txt','gain',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td> <div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "spend[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.spend || '') + "", true, false)) + " style=\"max-width:70px\"" + (jade.cls(['txt','spend',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td>" + (jade.escape((jade_interp = item.curMoney || '') == null ? '' : jade_interp)) + "</td><td> <div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "detail[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.detail || item.bankReceive || '') + "", true, false)) + " style=\"max-width:70px\"" + (jade.cls(['txt','detail',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td><i" + (jade.attr("data-content", "계좌번호: " + (item.bankNumber||'') + "(" + (item.bankName||'') + ")", true, false)) + " class=\"ui circular info icon\"></i></td><td><div class=\"ui fitted toggle checkbox\"><input type=\"checkbox\"" + (jade.attr("name", "paid[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("checked", item.paid||off, true, false)) + (jade.attr("value", index, true, false)) + "/><label></label></div></td><td style=\"text-align:center\"><div" + (jade.attr("onclick", "DeleteRow('" + (part2.name) + "', " + (index) + ")", true, false)) + " class=\"small ui red circular ban icon button\"><i class=\"icon ban\"></i></div></td></tr>");
    }

  }
}).call(this);

var index = rowNum
while ((index < 15))
{
buf.push("<input type=\"hidden\"" + (jade.attr("name", "part[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (part) + "", true, false)) + "/><tr onclick=\"SelectRow()\" href=\"#\"" + (jade.cls(["tr" + (part2.name) + "" + (index) + ""], [true])) + "><td> <div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "date[" + (part2.name) + "][" + (index) + "]", true, false)) + " value=\"\" style=\"max-width:80px;\"" + (jade.cls(['txt','date',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td><div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "part[" + (part2.name) + "][" + (index) + "]", true, false)) + " value=\"\" style=\"max-width:60px;\"" + (jade.cls(['txt','part',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td class=\"center aligned\"><div class=\"ui selection dropdown\"><input type=\"hidden\"" + (jade.attr("name", "section[" + (part2.name) + "][" + (index) + "]", true, false)) + " value=\"\"/><i style=\"position:absolute; right:0px\" class=\"dropdown icon\"></i><div class=\"text\"> </div><div class=\"menu\">");
// iterate sections
;(function(){
  var $$obj = sections;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var ss = $$obj[$index];

buf.push("<div" + (jade.attr("data-value", "" + (ss) + "", true, false)) + " style=\"font-size:9px\" class=\"item\">" + (jade.escape((jade_interp = ss) == null ? '' : jade_interp)) + "</div>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var ss = $$obj[$index];

buf.push("<div" + (jade.attr("data-value", "" + (ss) + "", true, false)) + " style=\"font-size:9px\" class=\"item\">" + (jade.escape((jade_interp = ss) == null ? '' : jade_interp)) + "</div>");
    }

  }
}).call(this);

buf.push("</div></div></td><td><div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "content[" + (part2.name) + "][" + (index) + "]", true, false)) + " value=\"\" style=\"max-width:100px\"" + (jade.cls(['txt','content',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td> <div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "receiptNo[" + (part2.name) + "][" + (index) + "]", true, false)) + " value=\"\" style=\"max-width:25px\"" + (jade.cls(['txt','receiptNo',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td> <div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "gain[" + (part2.name) + "][" + (index) + "]", true, false)) + " value=\"\" style=\"max-width:70px\"" + (jade.cls(['txt','gain',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td> <div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "spend[" + (part2.name) + "][" + (index) + "]", true, false)) + " value=\"\" style=\"max-width:70px\"" + (jade.cls(['txt','spend',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td> </td><td> <div class=\"ui input\"><input type=\"text\"" + (jade.attr("name", "detail[" + (part2.name) + "][" + (index) + "]", true, false)) + " value=\"\" style=\"max-width:70px\"" + (jade.cls(['txt','detail',"" + (part2.name) + " " + (index) + ""], [null,null,true])) + "/></div></td><td></td><td></td><td style=\"text-align:center\"></td></tr>");
index++;
}
buf.push("</tbody>");
}
else
{
buf.push("<tbody>");
// iterate part2.data
;(function(){
  var $$obj = part2.data;
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var item = $$obj[index];

buf.push("<input type=\"hidden\"" + (jade.attr("name", "RowKey[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.RowKey) + "", true, false)) + "/><input type=\"hidden\"" + (jade.attr("name", "PartitionKey[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.PartitionKey) + "", true, false)) + "/><input type=\"hidden\"" + (jade.attr("name", "deleteRow[" + (part2.name) + "][" + (index) + "]", true, false)) + " value=\"false\"" + (jade.cls(["delete" + (part2.name) + "" + (index) + ""], [true])) + "/><tr onclick=\"SelectRow()\" href=\"#\" style=\"text-align:center\"" + (jade.cls(["tr" + (part2.name) + "" + (index) + ""], [true])) + "><td>" + (jade.escape((jade_interp = item.year) == null ? '' : jade_interp)) + "." + (jade.escape((jade_interp = item.month) == null ? '' : jade_interp)) + "." + (jade.escape((jade_interp = item.day) == null ? '' : jade_interp)) + "</td><td>" + (jade.escape((jade_interp = item.section) == null ? '' : jade_interp)) + "</td><td style=\"max-width:120px\">" + (jade.escape((jade_interp = item.content||'') == null ? '' : jade_interp)) + " </td><td style=\"max-width:25px\">" + (jade.escape((jade_interp = item.receiptNo || '') == null ? '' : jade_interp)) + "</td><td style=\"max-width:70px\">" + (jade.escape((jade_interp = item.gain || '') == null ? '' : jade_interp)) + "</td><td style=\"max-width:70px\">" + (jade.escape((jade_interp = item.spend || '') == null ? '' : jade_interp)) + " </td><td>" + (jade.escape((jade_interp = item.curMoney || '') == null ? '' : jade_interp)) + "</td><td style=\"max-width:70px\">" + (jade.escape((jade_interp = item.detail || item.bankReceive || '') == null ? '' : jade_interp)) + "</td><td colspan=\"3\"><i" + (jade.attr("data-content", "계좌번호: " + (item.bankNumber||'') + "(" + (item.bankName||'') + ")", true, false)) + " class=\"ui circular info icon\"></i></td></tr>");
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var item = $$obj[index];

buf.push("<input type=\"hidden\"" + (jade.attr("name", "RowKey[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.RowKey) + "", true, false)) + "/><input type=\"hidden\"" + (jade.attr("name", "PartitionKey[" + (part2.name) + "][" + (index) + "]", true, false)) + (jade.attr("value", "" + (item.PartitionKey) + "", true, false)) + "/><input type=\"hidden\"" + (jade.attr("name", "deleteRow[" + (part2.name) + "][" + (index) + "]", true, false)) + " value=\"false\"" + (jade.cls(["delete" + (part2.name) + "" + (index) + ""], [true])) + "/><tr onclick=\"SelectRow()\" href=\"#\" style=\"text-align:center\"" + (jade.cls(["tr" + (part2.name) + "" + (index) + ""], [true])) + "><td>" + (jade.escape((jade_interp = item.year) == null ? '' : jade_interp)) + "." + (jade.escape((jade_interp = item.month) == null ? '' : jade_interp)) + "." + (jade.escape((jade_interp = item.day) == null ? '' : jade_interp)) + "</td><td>" + (jade.escape((jade_interp = item.section) == null ? '' : jade_interp)) + "</td><td style=\"max-width:120px\">" + (jade.escape((jade_interp = item.content||'') == null ? '' : jade_interp)) + " </td><td style=\"max-width:25px\">" + (jade.escape((jade_interp = item.receiptNo || '') == null ? '' : jade_interp)) + "</td><td style=\"max-width:70px\">" + (jade.escape((jade_interp = item.gain || '') == null ? '' : jade_interp)) + "</td><td style=\"max-width:70px\">" + (jade.escape((jade_interp = item.spend || '') == null ? '' : jade_interp)) + " </td><td>" + (jade.escape((jade_interp = item.curMoney || '') == null ? '' : jade_interp)) + "</td><td style=\"max-width:70px\">" + (jade.escape((jade_interp = item.detail || item.bankReceive || '') == null ? '' : jade_interp)) + "</td><td colspan=\"3\"><i" + (jade.attr("data-content", "계좌번호: " + (item.bankNumber||'') + "(" + (item.bankName||'') + ")", true, false)) + " class=\"ui circular info icon\"></i></td></tr>");
    }

  }
}).call(this);

buf.push("</tbody>");
}
buf.push("<tfoot><tr style=\"text-align:center\"><th colspan=\"3\">은행 금액: " + (jade.escape((jade_interp = part2.bankMoney) == null ? '' : jade_interp)) + "</th><th colspan=\"2\">은행 합계: " + (jade.escape((jade_interp = totalBank) == null ? '' : jade_interp)) + "</th><th colspan=\"2\">총 지출액: " + (jade.escape((jade_interp = part2.spendSum) == null ? '' : jade_interp)) + "</th><th colspan=\"2\">남은 금액: " + (jade.escape((jade_interp = part2.curMoney) == null ? '' : jade_interp)) + "</th><th colspan=\"3\">금액 합계: " + (jade.escape((jade_interp = totalCur) == null ? '' : jade_interp)) + "           </th></tr></tfoot></table></div></div><div class=\"mobile only row\"><div class=\"ui main container\"><table class=\"ui celled fixed single line structured compact unstackable table\"><thead style=\"text-align:center\"><tr><th style=\"max-width:50px; width:50px;\">날짜</th><th style=\"max-width:50px; width:50px;\">구분</th><th>상세 내역</th><th style=\"max-width:30px; width:30px;\">No</th><th>수입 금액</th><th>지출 금액</th><th>남은 금액</th></tr></thead><tfoot style=\"text-align:center\"><tr><th colspan=\"4\" style=\"font-size:6pt\">은행 금액: " + (jade.escape((jade_interp = part2.bankMoney) == null ? '' : jade_interp)) + "</th><th colspan=\"2\" style=\"font-size:6pt\">총 지출액: " + (jade.escape((jade_interp = part2.spendSum) == null ? '' : jade_interp)) + " </th><th style=\"font-size:6pt\">" + (jade.escape((jade_interp = curMoney) == null ? '' : jade_interp)) + "</th></tr></tfoot><tbody style=\"text-align:center\">");
// iterate part2.data
;(function(){
  var $$obj = part2.data;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var item = $$obj[$index];

buf.push("<tr><td>" + (jade.escape((jade_interp = item.month) == null ? '' : jade_interp)) + "." + (jade.escape((jade_interp = item.day) == null ? '' : jade_interp)) + "</td><td>" + (jade.escape((jade_interp = item.section) == null ? '' : jade_interp)) + "</td><td>" + (jade.escape((jade_interp = item.content) == null ? '' : jade_interp)) + "</td><td>" + (jade.escape((jade_interp = item.receiptNo || '') == null ? '' : jade_interp)) + "</td><td style=\"font-size:6pt\">" + (jade.escape((jade_interp = item.gain || '') == null ? '' : jade_interp)) + "</td><td><i style=\"font-size:6pt\"" + (jade.attr("data-content", "계좌번호: " + (item.bankNumber||'') + "(" + (item.bankName||'') + ")", true, false)) + " class=\"label info\">" + (jade.escape((jade_interp = item.spend || '') == null ? '' : jade_interp)) + "</i></td><td><i style=\"font-size:6pt\"" + (jade.attr("data-content", "계좌번호: " + (item.bankNumber||'') + "(" + (item.bankName||'') + ")", true, false)) + " class=\"label info\">" + (jade.escape((jade_interp = item.curMoney || '') == null ? '' : jade_interp)) + "</i></td></tr>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var item = $$obj[$index];

buf.push("<tr><td>" + (jade.escape((jade_interp = item.month) == null ? '' : jade_interp)) + "." + (jade.escape((jade_interp = item.day) == null ? '' : jade_interp)) + "</td><td>" + (jade.escape((jade_interp = item.section) == null ? '' : jade_interp)) + "</td><td>" + (jade.escape((jade_interp = item.content) == null ? '' : jade_interp)) + "</td><td>" + (jade.escape((jade_interp = item.receiptNo || '') == null ? '' : jade_interp)) + "</td><td style=\"font-size:6pt\">" + (jade.escape((jade_interp = item.gain || '') == null ? '' : jade_interp)) + "</td><td><i style=\"font-size:6pt\"" + (jade.attr("data-content", "계좌번호: " + (item.bankNumber||'') + "(" + (item.bankName||'') + ")", true, false)) + " class=\"label info\">" + (jade.escape((jade_interp = item.spend || '') == null ? '' : jade_interp)) + "</i></td><td><i style=\"font-size:6pt\"" + (jade.attr("data-content", "계좌번호: " + (item.bankNumber||'') + "(" + (item.bankName||'') + ")", true, false)) + " class=\"label info\">" + (jade.escape((jade_interp = item.curMoney || '') == null ? '' : jade_interp)) + "</i></td></tr>");
    }

  }
}).call(this);

buf.push("</tbody></table></div></div>");
};
if ( (part2 != null))
{
buf.push("<div class=\"big ui red tag label\">" + (jade.escape((jade_interp = part2.name) == null ? '' : jade_interp)) + "</div>");
jade_mixins["ShowBankTable"](part2);
}
if ( (part1 != null))
{
buf.push("<div class=\"big ui red tag label\">" + (jade.escape((jade_interp = part1.name) == null ? '' : jade_interp)) + "</div>");
jade_mixins["ShowBankTable"](part1);
}}.call(this,"auth" in locals_for_with?locals_for_with.auth:typeof auth!=="undefined"?auth:undefined,"curMoney" in locals_for_with?locals_for_with.curMoney:typeof curMoney!=="undefined"?curMoney:undefined,"off" in locals_for_with?locals_for_with.off:typeof off!=="undefined"?off:undefined,"part" in locals_for_with?locals_for_with.part:typeof part!=="undefined"?part:undefined,"part1" in locals_for_with?locals_for_with.part1:typeof part1!=="undefined"?part1:undefined,"part2" in locals_for_with?locals_for_with.part2:typeof part2!=="undefined"?part2:undefined,"totalBank" in locals_for_with?locals_for_with.totalBank:typeof totalBank!=="undefined"?totalBank:undefined,"totalCur" in locals_for_with?locals_for_with.totalCur:typeof totalCur!=="undefined"?totalCur:undefined));;return buf.join("");
}