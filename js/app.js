document.addEventListener( 'DOMContentLoaded', function () {
  var form = document.querySelector( '.form' );
  Module.init( {form : form} );
})

var Module = (function () {
  var options = {};
  var classError = {};
  var regPatterns = {
    text:"([0-9a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\.\-\(\)\s])+",
    account-number:"[PL]*[0-9]{2}\s?([0-9]{4}\s?){5}([0-9]{4})",
    amount:"(?!0|\.00)[0-9]+(\s\d{3})*([\.|\,][0-9]{0,2})",
    date:"(0[1-9]|[12][0-9]|3[01])[-/.](0[1-9]|1[012])[- /.](19|20\d\d)"
  };

  var showFieldValidation = function ( input, isValid ) {
    if ( !isValid ) {
      // if ( !input.parentNode.className
        // || input.parentNode.className.indexOf( options.classError ) === -1 ) {
        // input.parentNode.className += ' ' + options.classError;
      if ( !input.className
        || input.className.indexOf( options.classError ) === -1 ) {
        input.className += ' ' + options.classError;
      }
    } else {
      var regError = new RegExp( '(\\s|^)' + options.classError + '(\\s|$)' );
      console.log(regError);
      // input.parentNode.className = input.parentNode.className.replace( regError, '' );
      input.className = input.className.replace( regError, '' );
    }
  }

  var validateInputText = function ( input ) {
    var isValid = true;
    var pattern = '^' + input.getAttribute( 'pattern' ) + '$';

    if ( pattern != null ) {
      var reg = new RegExp( pattern, 'gi' );
      if ( !reg.test( input.value ) ) {
        isValid = false;
      }
    } else {
      if ( input.value === '' ) {
        isValid = false;
      }
    }
    console.log("valid?: ", isValid);

    if ( isValid ) {
      showFieldValidation( input, true );
      return true;
    } else {
      showFieldValidation( input, false );
      return false;
    }
  }

  var prepareElements = function () {
    //znajdź elementy które mają dataset 'data-validation'
    var elements = options.form.querySelectorAll( 'input[required], textarea[required], select[required]' );
    // console.log( elements );

    //https://css-tricks.com/snippets/javascript/loop-queryselectorall-matches/
    var forEach = function ( array, callback, scope ) {
      for ( var i = 0; i < array.length; i++ ) {
        callback.call( scope, i, array[i] ); // passes back stuff we need
      }
    };

    forEach( elements, function ( index, element ) {
      // console.log('element: ', element); // passes index + value back!
      element.removeAttribute( 'required' );
      element.className += ' required';
      if ( element.nodeName.toUpperCase() === 'INPUT' ) {
        // console.log( element );
        var dataType = element.dataset.type;

        if ( !dataType ) {
          dataType = element.type.toUpperCase();
        } else {
          dataType = element.dataset.type.toUpperCase();
        }

        if ( dataType === 'TEXT') {
          element.addEventListener( 'keyup', function () { validateInputText(element) } );
          element.addEventListener( 'blur', function () { validateInputText(element) } );
        }
        if ( dataType === 'NUMBER') {
          console.log('dataType: ', element.name, dataType );
          element.addEventListener( 'keyup', function () { console.log( element.value ); } );
          element.addEventListener( 'blur', function () { console.log( element.value ); } );
        }
        if ( dataType === 'DATE') {
          console.log('dataType: ', element.name, dataType );
          element.addEventListener( 'keyup', function () { console.log( element.value ); } );
          element.addEventListener( 'blur', function () { console.log( element.value ); } );
        }
        if (dataType == 'CHECKBOX') {
          console.log('dataType: ', element.name, dataType );
          element.addEventListener( 'click', function () { console.log( element.value ); } );
        }
        if (dataType == 'RADIO') {
          console.log('dataType: ', element.name, dataType );
          element.addEventListener( 'click', function () { console.log( element.value ); } );
        }
      }
      if ( element.nodeName.toUpperCase() === 'TEXTAREA' ) {
        element.addEventListener( 'keyup', function () { console.log( element.value ); } );
        element.addEventListener( 'blur', function () { console.log( element.value ); } );
      }
      if ( element.nodeName.toUpperCase() === 'SELECT' ) {
        element.addEventListener( 'change', function () { console.log( element.value ); } );
      }
    });
  }

  var init = function ( _options ) { // to jest parametr z Module.init({form : form});
    options = {
      form: _options.form || null, //przekazany parametr - form znaleziony w DOMie, lub null jeżeli nieznaleziony
      classError: _options.classError || 'error'
    }
    //jeżeli nie ma forma to daj warn w konsoli
    //sprawdza w funkcji init -> options -> form
    if ( options.form === null
      || options.form === undefined
      || options.form.length === 0 ) {
            console.warn( 'Module: Źle przekazany formularz' );
            return false;
        }

    prepareElements();
  }

  return {
    init: init
  }

})();
