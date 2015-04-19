exports.grid = new Array(12);

$.each(exports.grid, function(i) { exports.grid[i] = new Array(11) })

var path = [
  [ 0, 5],
  [ 1, 5],
  [ 1, 6],
  [ 1, 7],
  [ 1, 8],
  [ 1, 9],
  [ 1,10],
  [ 2,10],
  [ 3,10],
  [ 3, 9],
  [ 3, 8],
  [ 3, 7],
  [ 3, 6],
  [ 3, 5],
  [ 3, 4],
  [ 3, 3],
  [ 2, 3],
  [ 1, 3],
  [ 1, 2],
  [ 1, 1],
  [ 1, 1],
  [ 2, 1],
  [ 3, 1],
  [ 4, 1],
  [ 5, 1],
  [ 5, 0],
  [ 6, 0],
  [ 7, 0],
  [ 8, 0],
  [ 9, 0],
  [10, 0],
  [11, 0],
  [11, 1],
  [11, 2],
  [11, 3],
  [10, 3],
  [ 9, 3],
  [ 8, 3],
  [ 7, 3],
  [ 6, 3],
  [ 6, 4],
  [ 6, 5],
  [ 6, 6],
  [ 6, 7],
  [ 6, 8],
  [ 6, 9],
  [ 7, 9],
  [ 8, 9],
  [ 9, 9],
  [10, 9],
  [11, 9],
  [11, 8],
  [11, 7],
  [10, 7],
  [ 9, 7],
  [ 8, 7],
  [ 8, 6],
  [ 8, 5],
  [ 9, 5],
  [10, 5],
  [11, 5],
]

$.each(path, function(i, v) { exports.grid[v[0]][v[1]] = 'path' });

// Axmen

var all_axmen = [];
var Axman = require('logic/axman');

exports.wave_cooldown = new Cooldown('15s', function(frame_num)
{
  console.log('wave', Date());

  $.each(new Array(3), function(i)
  {
    runtime.once(new Cooldown((i * 3) + 's', function()
    {
      console.log('thing', Date());
      all_axmen.push(new Axman({ path: path}));
    }))
  });
})

exports.wave_cooldown.frames = 1;

runtime.on(exports.wave_cooldown);

runtime.on(function()
{
  all_axmen = $.map(all_axmen, function(axman)
  {
    axman.frame();
    if (axman.is_done)
    {
      return;
    }
    return axman;
  })
  all_axmen = compact_array(all_axmen);
});

exports.axmen = function() { return all_axmen };

// Trees

var Tree = require('logic/tree');
var all_trees = [new Tree({type: 'Grand', x: 12, y: 5})];

all_trees.push(new Tree({type: 'oak',    x: 4, y: 4 }))
all_trees.push(new Tree({type: 'bush',   x: 2, y: 2 }))
all_trees.push(new Tree({type: 'pine',   x: 7, y: 2 }))
all_trees.push(new Tree({type: 'spruce', x: 9, y: 6 }))
all_trees.push(new Tree({type: 'pine',   x: 7, y: 7 }))
all_trees.push(new Tree({type: 'bush',   x: 2, y: 9 }))
all_trees.push(new Tree({type: 'oak',    x: 5, y: 8 }))

runtime.on(function()
{
  all_trees = $.map(all_trees, function(tree)
  {
    tree.frame();
    if (tree.is_done)
    {
      return;
    }
    return tree;
  })
  all_trees = compact_array(all_trees);
});

exports.trees = function() { return all_trees };

exports.place_tree = function(x, y)
{
  var current_tree_at_pos
  $.each(all_trees, function(i, tree)
  {
    if (tree.x == x && tree.y == y)
    {
      current_tree_at_pos = tree
    }
  })

  if (current_tree_at_pos != null)
    return

  var shop_group = require('state/shop').shop_selection
  all_trees.push(
    new Tree({type: shop_group.get_current().action_name, x: x, y: y})
  );
}
