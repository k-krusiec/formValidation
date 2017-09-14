document.addEventListener('DOMContentLoaded', function() {
  var form = document.querySelector('.form');
  Module.init({form: form});
})

var Module = (function() {
  var options = {};
  var classError = {};

  var errorMsg = {
    empty: 'This field is required',
    text: {
      badFormat: 'Incorrect text format',
      toLong: 'Text should be no longer than 100 characters'
    },
    accountNumber: {
      badFormat: 'Incorrect account number format',
      toShort: 'Account number is to short',
      toLong: 'Account number is to long'
    },
    amount: {
      badValue: 'Incorrect value',
      notEnoughCash: 'You do not have enough funds in your account'
    },
    date: {
      badFormat: 'Incorrect date format',
      badValue: 'Incorrect date'
    }
  };

  var setTodaysDate = function() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();

    return (day < 10 ? '0' : '') + day + "." + (month < 10 ? '0' : '') + month + '.' + d.getFullYear();
  };

  var showFieldValidation = function(input, isValid, eMsg) {
    var inputParent = input.parentNode;
    var errTemplate = '<p class="error-sausage err-' + input.id +'">' + eMsg + '</p>';
    if (!isValid) {
      // if (!input.parentNode.className
        // || input.parentNode.className.indexOf(options.classError) === -1) {
        // input.parentNode.className += ' ' + options.classError;
      if (!input.className || input.className.indexOf(options.classError) === -1) {
        input.className += ' ' + options.classError;
      }
      if (inputParent.lastChild.nodeName !== 'P') {
        inputParent.insertAdjacentHTML('beforeend', errTemplate);
      } else {
        inputParent.lastChild.innerText = eMsg;
      }

    } else {
      var regError = new RegExp('(\\s|^)' + options.classError + '(\\s|$)');
      // input.parentNode.className = input.parentNode.className.replace(regError, '');
      input.className = input.className.replace(regError, '');
      inputParent.lastChild.outerHTML  = ''; //wywapa okienko z błędem
    }
  };

  var testInputText = function(input) {
    var inputValue = input.value;
    var pattern = /^([0-9a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\.\-\"\(\)\s])+$/;
    var isValid = true;
    var eMsg;

    if (!inputValue) {
      isValid = false;
      eMsg = errorMsg.empty;
    } else if (inputValue.length > 100) {
      isValid = false;
      eMsg = errorMsg.text.toLong;
    } else if (!pattern.test(inputValue)) {
      isValid = false;
      eMsg = errorMsg.text.badFormat;
    }

    if (isValid) {
      showFieldValidation(input, true, eMsg);
      return true;
    } else {
      showFieldValidation(input, false, eMsg);
      return false;
    }
  };

  var testAccNumber = function(input) {
    var inputValue = input.value.replace(/\s/g,'');
    var pattern = /^[0-9]{2}\s?([0-9]{4}\s?){5}([0-9]{4})$/;
    var isValid = true;
    var eMsg;

    if (!inputValue) {
      isValid = false;
      eMsg = errorMsg.empty;
    } else if ((!pattern.test(inputValue) && isNaN(inputValue)) || (inputValue.length > 0 && inputValue.length !== 26)) {
        isValid = false;
        eMsg = errorMsg.accountNumber.badFormat;
      }

    if (isValid) {
      showFieldValidation(input, true, eMsg);
      return true;
    } else {
      showFieldValidation(input, false, eMsg);
      return false;
    }
  };

  var testAmountValue = function(input) {
    var inputValue = input.value;
    var pattern = /^[0-9\s?]{1,}([\s\.|\,]?){1}[0-9]{0,2}$/;
    var isValid = true;
    var eMsg;

    if (!inputValue) {
      isValid = false;
      eMsg = errorMsg.empty;
    } else if (!pattern.test(inputValue)) {
      isValid = false;
      eMsg = errorMsg.amount.badValue;
    } else if (inputValue.charAt(0) === ',' || inputValue.charAt(0) === '.') {
      isValid = false;
      eMsg = errorMsg.amount.badValue;
    } else if (inputValue.length > 0 || inputValue.indexOf(',') !== -1) {
        inputValue = parseFloat(inputValue.replace(/\s/g,'').replace(/\,/g,'.')).toFixed(2);
        if (inputValue <= 0) {
          isValid = false;
          eMsg = errorMsg.amount.badValue
        }
    }

    if (isValid) {
      showFieldValidation(input, true, eMsg);
      return true;
    } else {
      showFieldValidation(input, false, eMsg);
      return false;
    }
  };

  var testDateValue = function(input) {
    var inputValue = input.value;
    var pattern = /^(0[1-9]|[12][0-9]|3[01])[-/.](0[1-9]|1[012])[- /.](19|20\d\d)$/;
    var isValid = true;
    var usersDate;
    var today = setTodaysDate();
    var eMsg;

    inputValue = inputValue.replace(/\s/g,'').replace(/\,/g,'.').replace(/\-/g,'').replace(/\//g,'.');

    usersDate = inputValue.split('.');
    usersDate = new Date(usersDate[2],usersDate[1]-1,usersDate[0]);
    usersDate = usersDate.getTime() / 1000;

    today = today.split('.');

    todaySec = new Date(today[2],today[1]-1,today[0]);
    todaySec = todaySec.getTime() / 1000;

    if (!inputValue) {
      isValid = false;
      eMsg = errorMsg.empty;
    } else if (!pattern.test(inputValue)) {
      isValid = false;
      eMsg = errorMsg.date.badFormat;
    } else if (todaySec > usersDate) {
      isValid = false;
      eMsg = errorMsg.date.badValue;
    }

    if (isValid) {
      showFieldValidation(input, true, eMsg);
      return true;
    } else {
      showFieldValidation(input, false, eMsg);
      return false;
    }
  };

  var prepareElements = function() {
    //znajdź elementy które mają dataset 'data-validation'
    var elements = options.form.querySelectorAll('input[required], textarea[required], select[required]');
    var dateInput = options.form.querySelector('input[data-type="date"]').value = setTodaysDate();

    //https://css-tricks.com/snippets/javascript/loop-queryselectorall-matches/
    var forEach = function(array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]); // passes back stuff we need
      }
    };

    forEach(elements, function(index, element) {
      element.removeAttribute('required');
      element.className += ' required';
      if (element.nodeName.toUpperCase() === 'INPUT') {
        var dataType = element.dataset.type;

        if (!dataType) {
          dataType = element.type.toUpperCase();
        } else {
          dataType = element.dataset.type.toUpperCase();
        }

        //standars input validations
        if (dataType === 'TEXT') {
          element.addEventListener('keyup', function() {testInputText(element)});
          element.addEventListener('blur', function() {testInputText(element)});
        }
        // if (dataType === 'NUMBER') {
        //   element.addEventListener('keyup', function() {console.log(element.value);});
        //   element.addEventListener('blur', function() {console.log(element.value);});
        // }
        // if (dataType == 'CHECKBOX') {
        //   element.addEventListener('click', function() {console.log(element.value);});
        // }
        // if (dataType == 'RADIO') {
        //   element.addEventListener('click', function() {console.log(element.value);});
        // }

        //custom input validations

        if (dataType === 'ACCOUNT-NUMBER') {
          element.addEventListener('keyup', function() {testAccNumber(element)});
          element.addEventListener('blur', function() {testAccNumber(element)});
        }
        if (dataType === 'AMOUNT') {
          element.addEventListener('keyup', function() {testAmountValue(element)});
          element.addEventListener('blur', function() {testAmountValue(element)});
        }
        if (dataType === 'DATE') {
          element.addEventListener('keyup', function() {testDateValue(element)});
          element.addEventListener('blur', function() {testDateValue(element)});
        }
      }
      // if ( element.nodeName.toUpperCase() === 'TEXTAREA' ) {
      //   element.addEventListener('keyup', function() {console.log(element.value);});
      //   element.addEventListener('blur', function() {console.log(element.value);});
      // }
      // if ( element.nodeName.toUpperCase() === 'SELECT' ) {
      //   element.addEventListener( 'change', function () { console.log( element.value ); } );
      // }
    });
  };

  var formSubmit = function() {
    options.form.addEventListener('submit', function(e) {
      e.preventDefault();

      var validated = true;
      var elements = options.form.querySelectorAll('.required');
      var forEach = function(array, callback, scope) {
        for (var i = 0; i < array.length; i++) {
          callback.call(scope, i, array[i]); // passes back stuff we need
        }
      };

      forEach(elements, function(index, element) {
        if (element.nodeName.toUpperCase() == 'INPUT') {
          var dataType = element.dataset.type;

          if (!dataType) {
            dataType = element.type.toUpperCase();
          } else {
            dataType = element.dataset.type.toUpperCase();
          }

          if (dataType == 'TEXT') {
            if (!testInputText(element)) validated = false;
          }
          if (dataType == 'ACCOUNT-NUMBER') {
            if (!testAccNumber(element)) validated = false;
          }
          if (dataType == 'AMOUNT') {
            if (!testAmountValue(element)) validated = false;
          }
          if (dataType == 'DATE') {
            if (!testDateValue(element)) validated = false;
          }
        }
        // if (element.nodeName.toUpperCase() == 'TEXTAREA') {
        //   if (!testInputText(element)) validated = false;
        // }
        // if (element.nodeName.toUpperCase() == 'SELECT') {
        //   if (!testInputSelect(element)) validated = false;
        // }
      });

      if (validated) {
        this.submit();
      } else {
        return false;
      }

    });
  };

  var init = function(_options) { // to jest parametr z Module.init({form : form});
    options = {
      form: _options.form || null, //przekazany parametr - form znaleziony w DOMie, lub null jeżeli nieznaleziony
      classError: _options.classError || 'error'
    }
    //jeżeli nie ma forma to daj warn w konsoli
    //sprawdza w funkcji init -> options -> form
    if ( options.form === null || options.form === undefined || options.form.length === 0 ) {
      console.warn('Module: Źle przekazany formularz');
      return false;
    }

    prepareElements();
    formSubmit();
  };

  return {
    init: init
  };

})();
