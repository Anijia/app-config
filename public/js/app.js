function handleDrop($source, $target, action) {
  var id = $source.data('id');

  $.post('/api/' + action, {
    targetId: id,
    sourceId: CONFIG.appId
  }, function(data) {
    $target.find('p').remove();
    $source.appendTo($target);
  }, 'json');
}


$('.apps-all').droppable({
  accept: '.apps-recommended .app',
  drop: function(event, ui) {
    handleDrop(ui.draggable, $(this), 'recommend/del'); 
  }
});

$('.apps-recommended').droppable({
  accept: '.apps-all .app',
  drop: function(event, ui) {
    handleDrop(ui.draggable, $(this), 'recommend/add'); 
  }
});


$('.app').draggable({
  appendTo: 'body',
  helper: 'clone'
});
