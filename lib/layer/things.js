var b = 40

var tops = new Animation({
  img: 'tops.png',
  x: 0,
  y: 0,
})
var rng = new lprng();

var set_pattern = function(c, thing)
{
  if (thing.pattern == null)
  {
    var gfx = new Gfx(100, 100)
    gfx.draw_animation(tops,
      {
        x: rng.random() % (tops.xw - 200) + 100,
        y: rng.random() % (tops.yh - 200) + 100,
      }
    );
    thing.pattern = c.createPattern(gfx.canvas, 'repeat');
  }

  c.fillStyle = thing.pattern
  c.strokeStyle = thing.pattern
}

var things = {
  Grand_tree: function(c, tree)
  {
    var t = b * 1.15
    c.translate(-t, -t)

    c.beginPath();
    c.arc(t, t, t, 0, 2*pi);
    set_pattern(c, tree)
    c.fill();
  },
  bush_tree: function(c, tree)
  {
    var t = b * 0.7
    c.translate(-t, -t)

    if (!tree.atk_cool.is_done())
    {
      c.beginPath();
      c.arc(t, t, b * (0.5 + tree.atk_cool.get_pctdone()), 0, 2*pi);
      set_pattern(c, tree)
      c.fill();
    }

    c.beginPath();
    c.arc(t, t, t, 0, 2*pi);
    set_pattern(c, tree)
    c.fill();
  },
  oak_tree: function(c, tree)
  {
    if (!tree.atk_cool.is_done())
    {
      var theta = Math.atan2(tree.atk_y() , tree.atk_x())
      var pct = tree.atk_cool.get_pctdone() / 4
      c.beginPath();
      c.arc(0, 0, b * 1, theta - pct, theta + pct)
      set_pattern(c, tree)
      c.lineWidth =30
      c.stroke();
    }

    var t = b * 0.65
    c.translate(-t, -t)

    c.beginPath();
    c.arc(t, t, t, 0, 2*pi);
    set_pattern(c, tree)
    c.fill();
  },
  pine_tree: function(c, tree)
  {
    if (!tree.atk_cool.is_done())
    {
      c.beginPath();

      c.arc(b * tree.atk_x(), b * tree.atk_y(), b * 0.1, 0, 2*pi)

      c.lineWidth = 3
      c.strokeStyle = '#976a2d'
      c.fillStyle = '#c2802d'
      c.fill();
      c.stroke();
    }

    var t = b * 0.55
    c.translate(-t, -t)

    c.beginPath();
    c.arc(t, t, t, 0, 2*pi);
    set_pattern(c, tree)
    c.fill();
  },
  spruce_tree: function(c, tree)
  {
    if (!tree.atk_cool.is_done())
    {
      c.beginPath();

      c.moveTo(b*tree.atk_x(.00), b * tree.atk_y(.00))
      c.lineTo(b*tree.atk_x(.02), b * tree.atk_y(.02))
      c.moveTo(b*tree.atk_x(.00), b * tree.atk_y(.02))
      c.lineTo(b*tree.atk_x(.04), b * tree.atk_y(.06))
      c.moveTo(b*tree.atk_x(.03), b * tree.atk_y(.00))
      c.lineTo(b*tree.atk_x(.06), b * tree.atk_y(.03))

      c.lineWidth = 3
      c.strokeStyle = '#228b22'
      c.stroke();
    }

    var t = b * 0.55
    c.translate(-t, -t)

    c.beginPath();
    c.arc(t, t, t, 0, 2*pi);
    set_pattern(c, tree)
    c.fill();
  },
  path: function(c)
  {
    c.fillStyle = '#f4a460'
    c.fillRect(0 - b/2, 0 - b/2, b, b)
  },
};

exports.things = things
