function validatePlaceId(placeId) {
    var numberRegex = /^[0-9]+$/;
    return numberRegex.test(placeId);
}

function validatePlaceName(placeName) {
	var validCharsRegex = /^[\w\.]+$/;
    var length = placeName.length;
    var validChars = validCharsRegex.test(placeName);
    return (length >= 3) && (length <= 20) && validChars;	
}

module.exports = {
	validatePlaceId: validatePlaceId,
	validatePlaceName: validatePlaceName
}