$(function() {
  var USERNAMEPATTERN = /^[a-zA-z][a-zA-Z0-9_]{3,11}$/,
      // timeout,
      $signupName = $('#signupName'),
      $signupNameForm = $signupName.parent(),
      $signupNameIcon = $signupName.siblings('.glyphicon'),
      $signupNameInfo = $signupName.siblings('p'),
      $signupSubmitButton = $('.sign-up .ajax-submit'),
      lstInput = '';
      bUserNameValid = false;

  $signupName.on('blur', validUserName);

  // $signupSubmitButton.on('click', signupSubmit);

  function resetForm(element, parent, icon, info, text) {
    text = text || '';
    // element.addClass('form-validing');
    parent.removeClass('has-error');
    parent.removeClass('has-success');
    icon.removeClass('glyphicon-ok');
    icon.removeClass('glyphicon-remove');
    info.addClass('hidden');
    info.html(text);
    bUserNameValid = false;
  }

  function userNameValid(element, parent, icon, info, text) {
    element.removeClass('form-validing');
    parent.addClass('has-success');
    icon.addClass('glyphicon-ok');
    bUserNameValid = true;
  }

  function userNameInvalid(element, parent, icon, info, text) {
    element.removeClass('form-validing');
    parent.addClass('has-error');
    icon.addClass('glyphicon-remove');
    info.html(text);
    info.removeClass('hidden');
  }

  function validUserName(e) {
    // clearTimeout(timeout);
    // timeout = setTimeout(function() {
      var $signupNameVal = $signupName.val();
      if(lstInput !== $signupNameVal){
        lstInput = $signupNameVal;
        resetForm($signupName, $signupNameForm, $signupNameIcon, $signupNameInfo);
        if(USERNAMEPATTERN.test($signupNameVal)) {
          $.ajax({
            type: 'get',
            url: '/user/signup?name=' + $signupNameVal
          })
          .done(function(results) {
            if(results.success === 1){
              userNameValid($signupName, $signupNameForm, $signupNameIcon, $signupNameInfo);
            } else {
              var errText = 'User already exists.';
              userNameInvalid($signupName, $signupNameForm, $signupNameIcon, $signupNameInfo, errText);
            }
          });
        } else {
          var errText = 'Does not meet the required format.';
          userNameInvalid($signupName, $signupNameForm, $signupNameIcon, $signupNameInfo, errText);
        }
      } else {
        return;
      }
    // }, 1000);
  }

  // function eventPreventDefault(e) {
  //   e.preventDefault();
  // }

  // function signupSubmit(e) {
  //   $signupSubmitButton.attr('disabled', 'disabled');
  //   $signupCloseButton.attr('disabled', 'disabled');
  //   $document.on('click', eventPreventDefault);
  //   validUserName();
  //   timeout = setTimeout(function() {
  //     if(bUserNameValid) {
  //       $.ajax({
  //         type: 'post',
  //         url: '/user/signup'
  //       })
  //       .done(function(results) {
  //         if(results.success === 1){

  //         } else {
  //           if(results.status && results.status === 5) { // unknown error

  //           }
  //         }
  //       });
  //     } else {
  //       shakeForm();
  //     }
  //   }, 1000);
  // }
});
