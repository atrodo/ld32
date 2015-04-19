var Tree = require('logic/tree');
exports.shop_trees = [
  { name: 'Holley Shrub', tree: new Tree({type: 'bush',   x: 0, y: 0 }), },
  { name: 'Oak', tree: new Tree({type: 'oak',    x: 0, y: 0 }), },
  { name: 'Pine', tree: new Tree({type: 'pine',   x: 0, y: 0 }), },
  { name: 'Spruce', tree: new Tree({type: 'spruce', x: 0, y: 0 }), },
];

var shop_selection = new ActionGroup({
  layer: runtime.add_layer('game.board', { }),
  next: 'tab',
  prev: 'shift+tab',
})

$.each(exports.shop_trees, function(i, v)
{
  shop_selection.push(new Action(v.tree.type, function() {shop_selection.set_current(this)}));
})

exports.shop_selection = shop_selection
