module.exports = {
	getDate(date) {   	
    	const result = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    	return result;
	},
	getDateUnixTimestamp(date) {
		const result = new Date(date * 1000);
		const hours = result.getHours();
		const minutes = "0" + result.getMinutes();
		const seconds = "0" + result.getSeconds();

		const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
		return formattedTime;
	}
}