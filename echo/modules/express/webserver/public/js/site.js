$(document).ready(() => {
  $('.show').click(() => {
    $('.show-hide').removeClass('--collapsed');
  });
  $('.hide').click(() => {
    $('.show-hide').addClass('--collapsed');
  });
});
