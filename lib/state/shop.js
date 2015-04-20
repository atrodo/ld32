var Tree = require('logic/tree');
exports.shop_trees = [
  {
    name: 'Holly Shrub',
    power: 0.7,
    speed: 0.3,
    price: 40,
    tree: new Tree({type: 'bush',   x: 0, y: 0 }),
  },
  {
    name: 'Oak',
    power: 0.9,
    speed: 0.1,
    price: 50,
    tree: new Tree({type: 'oak',    x: 0, y: 0 }),
  },
  {
    name: 'Pine',
    power: 0.2,
    speed: 0.8,
    price: 10,
    tree: new Tree({type: 'pine',   x: 0, y: 0 }),
  },
  {
    name: 'Spruce',
    power: 0.5,
    speed: 0.5,
    price: 20,
    tree: new Tree({type: 'spruce', x: 0, y: 0 }),
  },
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
