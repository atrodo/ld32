var board = runtime.add_layer('game.board', { });
var grid = require('state/board').grid
var things = require('layer/things').things

var b = 40

exports.grass = new Animation({
  img: 'grass.png',
  x: 0,
  y: 0,
})
board.add_animation(exports.grass)

var board_anim = new Animation({
  frame_x: 0,
  frame_y: 0,
  xw: 480,
  yh: runtime.height,
  get_gfx: function()
  {
    var self = this;
    var gfx = this.gfx

    gfx.reset()

    var c = gfx.context

    var m = {
      r: (151 - 255),
      g: (106 -  50),
      b: ( 45 -  20),
    }
    var select_color = function(percent)
    {
      var result = [
        'rgb(',
        (m.r * percent + 255) | 0, ',',
        (m.g * percent +  50) | 0, ',',
        (m.b * percent +  20) | 0,
        ')',
      ].join('')
      return result
    }

    var set_click = function(n, x, y, xw, yh)
    {
    }

    c.translate(0, this.yh)
    c.scale(1, -1);

    c.font = "24px Georgia"

    /*
    c.fillStyle = '#5c8b5c'
    c.fillRect(0, 0, gfx.xw(), gfx.yh());

    c.strokeStyle = "rgb(255, 255, 255)"
    c.lineWidth = 4

    /*
    $.each(grid, function(x, row)
    {
      $.each(row, function(y, item)
      {
        c.strokeRect(x * b, y * b, b, b)
      })
    })
    */

    $.each(grid, function(x, row)
    {
      $.each(row, function(y, item)
      {
        if (item != null)
        {
          var f = things[ item ];

          if ($.isFunction(f))
          {
            c.save();
            c.translate(x * b + (b/2), y * b + (b/2))
            f(c);
            c.restore();
          }
        }
      })
    })

    c.fillStyle = '#b8860b'
    $.each(require('state/board').axmen(), function(i, axman)
    {
      var size = axman.size * 10
      c.fillStyle = select_color(axman.hp_pct())
      c.fillRect(axman.x() * b - size/2, axman.y() * b - size/2, size, size)
    });

    $.each(require('state/board').trees(), function(i, tree)
    {
      var f = things[ tree.type + '_tree' ];

      if ($.isFunction(f))
      {
        c.save();
        c.translate(tree.x * b + (b/2), tree.y * b + (b/2))
        f(c, tree);
        c.restore();
      }
    });

    c.fillStyle = '#ffffff'
    c.fillText('Fertilizer (   ): ' + require('state/board').balance, 170, 470);
    c.fillText('f', 288, 470)
    c.fillText('\u2758', 282, 470)
    c.fillText('\u2012', 282, 464)

    var lives = require('state/board').lives
    var m = c.measureText(lives)
    c.fillText(lives, 480 - m.width, 470);

    c.fillStyle = '#6c9b6c'
    var height = 40 * require('state/board').wave_cooldown.get_pctdone()
    c.fillRect(0, 480 - height, 150, height);
    c.fillStyle = '#ffffff'
    c.fillText('Wave: ' + require('state/board').wave, 30, 470);

    return gfx
  },

})

board.add_animation(board_anim)

var place_tree_input = new Input({
  layer: board
})

var place_tree_action = new Action(function()
{
  var mouse_pos = runtime.get_mouse_pos()
  var x = (mouse_pos.x / b) | 0
  var y = (mouse_pos.y / b) | 0
  require('state/board').place_tree(x, y)
})

place_tree_action.set_trigger(new triggers.click({
  x: board_anim.frame_x,
  y: board_anim.frame_x,
  xw: board_anim.xw,
  yh: board_anim.yh,
}))

var next_wave_action = new Action(function()
{
  require('state/board').wave_cooldown.frames = 0
})

next_wave_action.set_trigger(new triggers.click({
  x: 0,
  y: 440,
  xw: 150,
  yh: 40,
}))

place_tree_input.add_action('place_tree', place_tree_action)
place_tree_input.add_action('next_wave', next_wave_action)
