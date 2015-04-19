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

    c.save()
    c.scale(0.8, 0.8)

    var i = shop_group.current
    c.save();
    c.translate(60, 110 * i + 60)
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
        c.translate(60, 110 * i + 60)

        c.fillStyle = '#ffffff'
        var m = c.measureText(tree.name)
        c.fillText(tree.name, -m.width / 2, 50)

        c.fillStyle = '#6b5844'
        c.fillRect(70,   5, 20, -25 )
        c.fillRect(100,  5, 20, -25 )

        c.fillStyle = '#6c9b6c'
        c.fillRect(70,   5, 20, -25 * tree.power)
        c.fillRect(100,  5, 20, -25 * tree.speed)

        c.fillStyle = '#ffffff'
        c.font = "26px Georgia"
        c.fillText('f' + tree.price, 78, 32)
        c.fillText('\u2758', 72, 32)
        c.fillText('\u2012', 72, 27)

        c.font = "10px Georgia"
        c.fillText('Speed    Rate', 63, -25)

        f(c, tree.tree);

        c.restore();
      }

    });
    c.restore()

    return gfx;
  }
}));
