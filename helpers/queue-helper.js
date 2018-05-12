function validateQueueName(queueName) {
  var validCharsRegex = /^[\w\.]+$/;
  var length = queueName.length;
  var validChars = validCharsRegex.test(queueName);
  return (length >= 3) && (length <= 20) && validChars;
}

module.exports = {
  validateQueueName: validateQueueName
}