/* global $, render, api */
'use strict';
/**
 * EVENT HANDLERS (callback methods for jQuery events listeners)
 * 
 * Primary Job:
 * - Prevent default actions on HTML elements
 * - Validate input
 * - Updates STATE/STORE
 * - Call API methods
 * - Call render methods
 * 
 * 
 * Rule of Thumb:
 * - Never manipulation DOM directly
 * - Never make fetch/AJAX calls directly
 * - Updates to STATE/STORE allowed
 * 
 */

var handle = {
  signup: function (event) {
    event.preventDefault();
    const state = event.data;
    const el = $(event.target);
    const username = el.find('[name=username]').val().trim();
    const password = el.find('[name=password]').val().trim();
    el.trigger('reset');

    api.signup(username, password)
      .then(() => {
        state.view = 'login';
        render.page(state);
      })
      .catch(err => {
        if (err.reason === 'ValidationError') {
          console.error(err.reason, err.message);
        } else {
          console.error(err);
        }
      });
  },

  login: function (event) {
    event.preventDefault();
    const state = event.data;
    const el = $(event.target);
    const username = el.find('[name=username]').val().trim();
    const password = el.find('[name=password]').val().trim();

    api.login(username, password)
      .then(response => {
        state.token = response.authToken;
        localStorage.setItem('authToken', state.token);
        state.view = (state.backTo) ? state.backTo : 'search';
        render.page(state);
      })
      .catch(err => {
        if (err.reason === 'ValidationError') {
          console.error(err.reason, err.message);
        } else {
          console.error(err);
        }
      });
  },

  search: function (event) {
    event.preventDefault();
    const state = event.data;
    const el = $(event.target);
    const query = {
      name: el.find('[name=name]').val()
    };

    api.search(query)
      .then(response => {
        state.list = response;
        render.results(state);

        state.view = 'search';
        render.page(state);
      })
      .catch(err => {
        console.error(err);
      });
  },

  create: function (event) {
    event.preventDefault();
    const state = event.data;
    const el = $(event.target);

    const document = {
      name: el.find('[name=name]').val()
    };
    api.create(document, state.token)
      .then(response => {
        state.item = response;
        state.list = null; //invalidate cached list results
        render.detail(state);
        state.view = 'detail';
        render.page(state);
      })
      .catch(err => {
        if (err.code === 401) {
          state.backTo = state.view;
          state.view = 'signup';
          render.page(state);
        }
        console.error(err);
      });
  },

  update: function (event) {
    event.preventDefault();
    const state = event.data;
    const el = $(event.target);

    const document = {
      id: state.item.id,
      name: el.find('[name=name]').val()
    };
    api.update(document, state.token)
      .then(response => {
        state.item = response;
        state.list = null; //invalidate cached list results
        render.detail(state);
        state.view = 'detail';
        render.page(state);
      })
      .catch(err => {
        if (err.code === 401) {
          state.backTo = state.view;
          state.view = 'signup';
          render.page(state);
        }
        console.error(err);
      });
  },

  details: function (event) {
    event.preventDefault();
    const state = event.data;
    const el = $(event.target);

    const id = el.closest('li').attr('id');
    api.details(id)
      .then(response => {
        state.item = response;
        render.detail(state);
        state.view = 'detail';
        render.page(state);
      })
      .catch(err => {
        state.error = err;
        render.error(state);
      });
  },

  remove: function (event) {
    event.preventDefault();
    const state = event.data;
    const id = $(event.target).closest('li').attr('id');

    api.remove(id, state.token)
      .then(() => {
        state.list = null; //invalidate cached list results
        return handle.search(event);
      })
      .catch(err => {
        if (err.code === 401) {
          state.backTo = state.view;
          state.view = 'signup';
          render.page(state);
        }
        console.error(err);
      });
  },
  viewCreate: function (event) {
    event.preventDefault();
    const state = event.data;
    state.view = 'create';
    render.page(state);
  },
  viewLogin: function (event) {
    event.preventDefault();
    const state = event.data;
    state.view = 'login';
    render.page(state);
  },
  viewSignup: function (event) {
    event.preventDefault();
    const state = event.data;
    state.view = 'signup';
    render.page(state);
  },
  viewSearch: function (event) {
    event.preventDefault();
    const state = event.data;
    if (!state.list) {
      handle.search(event);
      return;
    }
    state.view = 'search';
    render.page(state);
  },
  viewEdit: function (event) {
    event.preventDefault();
    const state = event.data;
    render.edit(state);

    state.view = 'edit';
    render.page(state);
  }
};
