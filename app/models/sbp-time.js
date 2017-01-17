// date model

function getYear() {
	var date = new Date();
	var current_year = date.getFullYear();
	var current_month = date.getMonth()+1;
	if (current_month > 7)
		current_year += "-2";
	this.year = current_year;
	return current_year;
} 

function getFullYear() {
	var date = new Date();
	var current_year = date.getFullYear();
	// current_year = 2017;
	return current_year;
} 

module.exports.getYear = getYear;
module.exports.getFullYear = getFullYear;
