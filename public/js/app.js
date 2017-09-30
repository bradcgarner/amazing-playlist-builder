/* global jQuery, handle */
'use strict';
/**
 * EVENT LISTENERS
 * 
 * Primary Job:
 * - Listen for user events like `click`, and call event handler methods
 * - Pass the "STORE" and the event objects and the event handlers
 * 
 * Setup:
 * jQuery's document ready "starts" the app
 * Event listeners are wrapped in jQuery's document.ready function
 * STORE is inside document.ready so it is protected
 * 
 * 
 * Rule of Thumb:
 * - Never manipulation DOM directly
 * - Never make fetch/AJAX calls directly
 * - Updates to STATE/STORE allowed
 * 
 */

// Make STORE global so it can be easily qu
var STORE;
//on document ready bind events
jQuery(function ($) {

  STORE = {
    view: 'search', // signup | login | search | create | details | edit 
    backTo: null,
    query: {},      // search query values
    list: null,     // search result - array of objects (documents)
    item: null,     // currently selected document
    token: localStorage.getItem('authToken') // jwt token
  };

  // Setup all the event listeners, passing STATE and event to handlers
  $('#signup').on('submit', STORE, handle.signup);
  $('#login').on('submit', STORE, handle.login);
  $('#create').on('submit', STORE, handle.create);
  $('#search').on('submit', STORE, handle.search);
  $('#edit').on('submit', STORE, handle.update);

  $('#result').on('click', '.detail', STORE, handle.details);
  $('#result').on('click', '.remove', STORE, handle.remove);

  $('#search').on('click', '.viewCreate', STORE, handle.viewCreate);
  $('#signup').on('click', '.viewLogin', STORE, handle.viewLogin);
  $('#login').on('click', '.viewSignup', STORE, handle.viewSignup);  
  $('#detail').on('click', '.viewSearch', STORE, handle.viewSearch);
  $('#detail').on('click', '.edit', STORE, handle.viewEdit);

  // start app by triggering a search
  $('#search').trigger('submit');
});
