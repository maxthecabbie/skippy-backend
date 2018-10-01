function validateQueueName(queueName) {
  var validCharsRegex = /^[\w\.]+$/;
  var validChars = validCharsRegex.test(queueName);
  return 1 <= queueName.length <= 20 && validChars;
}

module.exports = {
  validateQueueName: validateQueueName
}