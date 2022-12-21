"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show story submission on click of 'Submit' button **/
function showSubmit() {
  $('#submission-form').show();
  $favStoriesList.hide();
  $allStoriesList.hide();
  $userStoriesList.hide()
}

$('#nav-submit').on('click', showSubmit);

/** Show/hide favorite stories on click of 'Favorites' button */
function showFavorites() {
  $favStoriesList.show();
  $allStoriesList.hide();
  $userStoriesList.hide();
  $('#submission-form').hide();
}

$('#nav-favorites').on('click', showFavorites);

/** Show/hide user stories on click of 'My Stories' button */
function showUserStories() {
  $favStoriesList.hide();
  $allStoriesList.hide();
  $userStoriesList.show();
  $('#submission-form').hide();
}

$('#nav-user-stories').on('click', showUserStories);