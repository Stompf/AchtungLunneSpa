import moment = require('moment');

module Utils {
    export function getFormatedDateWithTime(dateString: string) {
        return moment(moment(dateString).format('YYYY-MM-DD HH:mm:ss')).toDate();
    }

    export function appendNewLine(koString: KnockoutObservable<string>, newLine: string, includeTimeStamp: boolean = true) {
        if (includeTimeStamp) {
            newLine = (moment().format('HH:mm:ss') + ' - ' + newLine);
            koString(newLine + '<br>' + koString());
        }
    }

	export function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}
export = Utils;