//Sistema Geodésico Mundial 1984 (WGS 84)

// This function returns the coordinate
// conversion string in DD to DMS.
const ddToDms = (latx, lngx) => {
    var lat = latx;
    var lng = lngx;
    //var latResult, lngResult, dmsResult;
    var latResult, lngResult;
    lat = parseFloat(lat);  
    lng = parseFloat(lng);
    latResult = (lat >= 0)? 'N' : 'S';
    // Call to getDms(lat) function for the coordinates of Latitude in DMS.
    // The result is stored in latResult variable.
    latResult += getDms(lat);
    lngResult = (lng >= 0)? 'E' : 'W';
    // Call to getDms(lng) function for the coordinates of Longitude in DMS.
    // The result is stored in lngResult variable.
    lngResult += getDms(lng);
    /*
    // Joining both variables and separate them with a space.
    dmsResult = latResult + ' ' + lngResult;
    // Return the resultant string
    return dmsResult;
    */
    return {
        lat: latResult,
        lng: lngResult
    }
}

const getDms = (val) => {
    var valDeg, valMin, valSec, result;
    val = Math.abs(val);
    valDeg = Math.floor(val);
    result = valDeg + "º";
    valMin = Math.floor((val - valDeg) * 60);
    result += valMin + "'";
    valSec = Math.round((val - valDeg - valMin / 60) * 3600 * 1000) / 1000;
    result += valSec + '"';
    return result;
}

export default ddToDms;