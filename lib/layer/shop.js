var shop = runtime.add_layer('game.board', { });
var things = require('layer/things').things
var shop_trees = require('state/shop').shop_trees;
var shop_group = require('state/shop').shop_selection

shop.add_animation(new Animation({
  frame_x: 480,
  frame_y: 0,
  xw: runtime.width - 480,
  yh: runtime.height,
  get_gfx: function()
  {
    var self = this;
    var gfx = this.gfx

    gfx.reset()

    var c = gfx.context

    c.translate(0, this.yh)
    c.scale(1, -1);

    c.font = "16px Georgia"
    c.fillStyle = '#446b44'
    c.fillRect(0, 0, gfx.xw(), gfx.yh());

    c.strokeStyle = "rgb(255, 255, 255)"
    c.lineWidth = 4
    var grad = c.createRadialGradient(0, 0, 0, 0, 0, 60)
    grad.addColorStop(0, '#6cb46c');
    grad.addColorStop(1, '#446b44');

    var i = shop_group.current
    c.save();
    c.translate(60, 110 * i + 40)
    c.fillStyle = grad
    c.fillRect(-60, -60, 120, 130)
    c.restore();

    $.each(shop_trees, function(i, tree)
    {
      var f = things[ tree.tree.type + '_tree' ];

      var shop_item = shop_group.get(i)
      if (shop_item.triggers.click == null)
      {
        shop_item.set_trigger(new triggers.click({
          x: self.frame_x,
          y: 100 * i,
          xw: self.xw,
          yh: 100,
        }))
      }

      if ($.isFunction(f))
      {
        c.save();
        c.translate(60, 110 * i + 40)

        c.fillStyle = '#ffffff'
        var m = c.measureText(tree.name)
        c.fillText(tree.name, -m.width / 2, 50)
        f(c, tree.tree);

        c.fillStyle = '#cd853f'
        c.fillRect(70, -10, 20, -15 )
        c.fillRect(70, 10, 20, -15 )
        c.fillStyle = '#8b4513'
        c.fillRect(70, -10, 20, -15 * tree.power)
        c.fillRect(70, 10, 20, -15 * tree.speed)
        c.fillText(tree.price, 70, 30)
        c.restore();
      }
    });

    return gfx;
  }
}));
