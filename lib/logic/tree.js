var ai = {
  bush: {
    distance: 1,
    cool_per: 1,
    dmg: 2,
    aoe: true
  },
  oak:  {
    distance: 1,
    dmg: 4,
    cool_per: 2,
    delay: '1s'
  },
  pine:  {
    distance: 8,
    dmg: 3,
    cool_per: 0.4,
    delay: '1s'
  },
  spruce:  {
    distance: 10,
    dmg: 1,
    cool_per: 0.1,
    delay: '1s'
  },
}

var Tree = Moo.class(function()
{
  var goal_sub = 20;

  this.has("type", {
    is: "ro",
    required: true,
  })

  this.has("x", {
    is: "rw",
    required: true,
  })

  this.has("y", {
    is: "rw",
    required: true,
  })

  this.has("pattern", {
    is: "rw",
  })

  this.has("is_done", {
    is: "rw",
    default: false,
  });

  this.has("atk", {
    is: "rw",
  });

  this.has("atk_cool", {
    is: "rw",
    default: function() { return new Cooldown(0) },
  });

  this.has("atk_delay", {
    is: "rw",
    default: function() { return new Cooldown(0) },
  });

  this.has("ai", {
    is: "rw",
    default: 1,
    coerce: function()
    {
      if (ai[this.type] == null)
        return { distance: 1, cool_per: 1 }
      return ai[this.type]
    },
  });

  this.method("BUILD", function()
  {
    this.ai = {}
  });

  this.method("atk_x", function(pct)
  {
    pct = pct || 0
    return (this.atk.x() - this.x - 0.5) * (this.atk_cool.get_pctdone() - pct)
  })

  this.method("atk_y", function(pct)
  {
    pct = pct || 0
    return (this.atk.y() - this.y - 0.5) * (this.atk_cool.get_pctdone() - pct)
  })

  this.method("frame", function()
  {
    if (!this.atk_cool.is_done())
    {
      this.atk_cool.frame();

      if (this.atk_cool.is_done())
      {
        var dmg = this.ai.dmg
        if (this.ai.aoe)
        {
          var distance = this.ai.distance
          var tree = this

          $.each(require('state/board').axmen(), function(i, axman)
          {
            var x_diff = axman.x() - tree.x
            var y_diff = axman.y() - tree.y
            var diff = sqrt(x_diff*x_diff + y_diff*y_diff)

            if (diff <= distance)
            {
              axman.take_dmg(dmg);
            }
          });
        }
        else
        {
          this.atk.take_dmg(dmg);
        }
      }
    }

    if (!this.atk_delay.is_done())
    {
      this.atk_delay.frame();
    }

    if (!this.atk_cool.is_done() || !this.atk_delay.is_done())
    {
      return
    }

    var distance = this.ai.distance
    var min_axman = [ 1000 ];

    var tree = this;

    $.each(require('state/board').axmen(), function(i, axman)
    {
      var x_diff = axman.x() - tree.x
      var y_diff = axman.y() - tree.y
      var diff = sqrt(x_diff*x_diff + y_diff*y_diff)

      if (diff <= distance && diff < min_axman[0] )
      {
        min_axman = [diff, axman]
      }
    });

    if (min_axman[1] != null)
    {
      var cool_time = min_axman[0] * this.ai.cool_per;
      if (this.ai.aoe)
      {
        cool_time = ceil(min_axman[0]) * this.ai.cool_per;
      }
      this.atk = min_axman[1]
      this.atk_cool = new Cooldown( cool_time * runtime.fps);
      this.atk_delay = new Cooldown( this.ai.delay || 0);
    }
  })

});

module.exports = Tree;
