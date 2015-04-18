var board = runtime.add_layer('game.board', { });
var grid = require('state/board').grid

var b = 40

var things = {
  Grand_tree: function(c)
  {
    c.strokeStyle = "rgb(255, 255, 255)"
    c.strokeWidth = 2
    c.beginPath();
    c.arc(0, 0, b * 1.15, 0, 2*pi);
    c.stroke();
  },
  bush_tree: function(c, tree)
  {
    if (!tree.atk_cool.is_done())
    {
      c.beginPath();
      c.strokeStyle = "rgb(255, 0, 0)"
      c.arc(0, 0, b * (0.5 + tree.atk_cool.get_pctdone()), 0, 2*pi);
      c.stroke();
    }

    c.strokeStyle = "rgb(255, 255, 255)"
    c.strokeWidth = 2
    c.beginPath();
    c.arc(0, 0, b * 0.7, 0, 2*pi);
    c.stroke();
  },
  oak_tree: function(c, tree)
  {
    if (!tree.atk_cool.is_done())
    {
      var theta = Math.atan2(tree.atk_x() , tree.atk_y())
      var pct = tree.atk_cool.get_pctdone() / 2
      c.beginPath();
      c.strokeStyle = "rgb(255, 0, 0)"
      c.arc(0, 0, b * 1, theta - pct, theta + pct)
      c.stroke();
    }

    c.strokeStyle = "rgb(255, 255, 255)"
    c.strokeWidth = 2
    c.beginPath();
    c.arc(0, 0, b * 0.65, 0, 2*pi);
    c.stroke();
  },
  pine_tree: function(c, tree)
  {
    if (!tree.atk_cool.is_done())
    {
      c.beginPath();
      c.strokeStyle = "rgb(255, 0, 0)"
      c.arc(b * tree.atk_x(), b * tree.atk_y(), b * 0.1, 0, 2*pi)
      c.stroke();
    }

    c.strokeStyle = "rgb(255, 255, 255)"
    c.strokeWidth = 2
    c.beginPath();
    c.arc(0, 0, b * 0.55, 0, 2*pi);
    c.stroke();
  },
  spruce_tree: function(c, tree)
  {
    if (!tree.atk_cool.is_done())
    {
      c.beginPath();
      c.strokeStyle = "rgb(255, 0, 0)"
      c.arc(b * tree.atk_x(), b * tree.atk_y(), b * 0.1, 0, 2*pi)
      c.stroke();
    }

    c.strokeStyle = "rgb(255, 255, 255)"
    c.strokeWidth = 2
    c.beginPath();
    c.arc(0, 0, b * 0.5, 0, 2*pi);
    c.stroke();
  },
  path: function(c)
  {
    c.fillStyle = '#f4a460'
    c.fillRect(0 - b/2, 0 - b/2, b, b)
  },
};

board.add_animation(new Animation({
  frame_x: 0,
  frame_y: 0,
  xw: runtime.width,
  yh: runtime.height,
  get_gfx: function()
  {
    var self = this;
    var gfx = this.gfx

    gfx.reset()

    var c = gfx.context

    var m = {
      r: ( 59 - 186),
      g: (112 - 186),
      b: (180 -  63),
    }
    var select_color = function(percent)
    {
      var result = [
        'rgb(',
        (m.r * percent + 186) | 0, ',',
        (m.g * percent + 186) | 0, ',',
        (m.b * percent +  63) | 0,
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

    c.fillStyle = '#5c8b5c'
    c.fillRect(0, 0, gfx.xw(), gfx.yh());

    c.strokeStyle = "rgb(255, 255, 255)"
    c.lineWidth = 4

    $.each(grid, function(x, row)
    {
      $.each(row, function(y, item)
      {
        c.strokeRect(x * b, y * b, b, b)
      })
    })

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
      c.fillRect(axman.x() * b - 5, axman.y() * b - 5, 10, 10)
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

    return gfx
  },

}));
