function validatePlaceId(placeId) {
    var numberRegex = /^[0-9]+$/;
    return numberRegex.test(placeId);
}

module.exports = {
	validatePlaceId: validatePlaceId
}