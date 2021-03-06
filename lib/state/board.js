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

exports.wave = 0;

exports.wave_cooldown = new Cooldown('20s', function(frame_num)
{
  //console.log('wave', Date());
  exports.wave++

  var effective_wave = exports.wave
  if (exports.wave % 10 == 0)
    effective_wave *= 2.5

  $.each(new Array(5), function(i)
  {
    runtime.once(new Cooldown((i * 2) + 's', function()
    {
      //console.log('thing', Date());
      var size = log(effective_wave/3 + 3.5) - 1
      all_axmen.push(new Axman({
        size: size,
        hp: (10 * (size + 1)) | 0,
        hp_tot: (10 * (size + 1)) | 0,
        path: path
      }));
    }))
  });
})

exports.wave_cooldown.frames = 30 * runtime.fps;

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

/*
all_trees.push(new Tree({type: 'oak',    x: 4, y: 4 }))
all_trees.push(new Tree({type: 'bush',   x: 2, y: 2 }))
all_trees.push(new Tree({type: 'pine',   x: 7, y: 2 }))
all_trees.push(new Tree({type: 'spruce', x: 9, y: 6 }))
all_trees.push(new Tree({type: 'pine',   x: 7, y: 7 }))
all_trees.push(new Tree({type: 'bush',   x: 2, y: 9 }))
all_trees.push(new Tree({type: 'oak',    x: 5, y: 8 }))
*/

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

exports.balance = 100;

exports.place_tree = function(x, y)
{
  if (x >= exports.grid.length || y >= exports.grid[x].length)
    return
  if (exports.grid[x][y] != null)
    return
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
  var shop_trees = require('state/shop').shop_trees

  var shop_tree = shop_trees[shop_group.current]

  if (shop_tree.price > exports.balance)
    return

  exports.balance -= shop_tree.price

  all_trees.push(
    new Tree({type: shop_group.get_current().action_name, x: x, y: y})
  );
}

exports.lives = 'IIIII IIIII'
exports.lose_life = function()
{
  exports.lives = exports.lives.replace(/I ?/, '')

  if (exports.lives.length == 0)
  {
    runtime.find_layer('game.board').deactivate()
    runtime.find_layer('game.shop').deactivate()

    var winning = runtime.add_layer('game.winning', { });
    winning.add_animation(require('layer/board').grass)
    winning.add_animation(new Animation({
      frame_x: runtime.width / 4,
      frame_y: runtime.height / 4,
      xw: runtime.width / 2,
      yh: runtime.height / 2,
      get_gfx: function()
      {
        var self = this;
        var gfx = this.gfx

        gfx.reset()

        var c = gfx.context
        c.translate(0, this.yh)
        c.scale(1, -1);

        c.font = "24px Georgia"

        c.fillStyle = '#ffffff'
        c.fillText("Game Over", 70, 130)

        return gfx
      }
    }))
  }
}
