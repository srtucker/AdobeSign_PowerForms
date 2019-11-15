
export default {
  isValidEmail: function(email) {
    var regex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-](\.?[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-])*\@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(\.[a-zA-Z](?:[a-zA-Z-]{0,61}[a-zA-Z]))$/;

    if (!email) {
      return false
    }

    if (email.length > 254) {
      return false
    }

    if (!regex.test(email)) {
      return false
    }
    var emailParts = email.split("@");
    if (emailParts[0].length > 64) {
      return false
    }

    return !emailParts[1].split(".").some(emailPart => {
      return emailParts.length > 63
    });
  },
}
