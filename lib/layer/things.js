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
      var theta = Math.atan2(tree.atk_y() , tree.atk_x())
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

exports.things = things
