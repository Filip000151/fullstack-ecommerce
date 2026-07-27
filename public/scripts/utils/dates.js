export function convertDateToObject(dateString){
    const date = new Date(dateString);

    const day = getNameOfTheDay(date);
    const dayNum = date.getDate();
    const month = getNameOfTheMonth(date);
    const monthNum = date.getMonth() + 1;
    const year = date.getFullYear();

    return {
        day,
        dayNum,
        month,
        monthNum,
        year
    };
}

function getNameOfTheDay(date){
    const day = date.getDay();

    switch(day){
        case 0:
            return 'Sunday';
        case 1:
            return 'Monday';
        case 2:
            return 'Tuesday';
        case 3:
            return 'Wednesday';
        case 4:
            return 'Thursday';
        case 5:
            return 'Friday';
        case 6:
            return 'Saturday';
        default:
            return 'Unknown';
    }
}

function getNameOfTheMonth(date){
    const month = date.getMonth();

    switch(month){
        case 0:
            return 'January';
        case 1:
            return 'February';
        case 2:
            return 'March';
        case 3:
            return 'April';
        case 4:
            return 'May';
        case 5:
            return 'June';
        case 6:
            return 'July';
        case 7:
            return 'August';
        case 8:
            return 'September';
        case 9:
            return 'October';
        case 10:
            return 'November';
        case 11:
            return 'December';
        default:
            return 'Unknown';
    }
}

export default convertDateToObject;