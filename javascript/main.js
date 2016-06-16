$(function () {
  $('a.main.item').click(function () {
    $('a.main.item').removeClass('active');
    $(this).addClass('active');
  })
  
  $('a.sub.item').click(function () {
    $('a.sub.item').removeClass('active');
    $(this).addClass('active');
  })
  
  $('button.blue.item').click(function () {
    $('button.blue.item').removeClass('active');
    $(this).addClass('active');
  })
  
  $('.ui.accordion')
    .accordion();

});
