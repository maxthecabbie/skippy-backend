function validatePlaceId(placeId) {
  var numberRegex = /^[0-9]+$/;
  return numberRegex.test(placeId);
}

function validatePlaceName(placeName) {
  var validCharsRegex = /^[a-z0-9]+$/i;
  var validChars = validCharsRegex.test(placeName);
  return 3 <= placeName.length <= 20 && validChars;
}

module.exports = {
  validatePlaceId: validatePlaceId,
  validatePlaceName: validatePlaceName
}