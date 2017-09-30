/* global $ */
'use strict';
/**
 * RENDER METHODS
 * 
 * Primary Job: Direct DOM Manipulation
 * 
 * Rule of Thumb:
 * - Direct DOM manipulation OK
 * - Never update state/store
 * 
 */

var render = {
  page: function (state) {
    $('.view').hide();
    $('#' + state.view).show();
  },
  results: function (state) {
    const listItems = state.list.map((item) => {
      return `<li id="${item.id}">
                <a href="" class="detail">Name: ${item.name}</a>
                <a href="#" class="remove">X</a>
              </li>`;
    });
    $('#result').empty().append('<ul>').find('ul').append(listItems);
  },
  edit: function (state) {
    const el = $('#edit');
    const item = state.item;
    el.find('[name=name]').val(item.name);
  },
  detail: function (state) {
    const el = $('#detail');
    const item = state.item;
    el.find('.name').text(item.name);
  }
};