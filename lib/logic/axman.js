var Axman = Moo.class(function()
{
  var goal_sub = 20;

  this.has("path", {
    is: "ro",
    required: true,
  })

  this.has("path_i", {
    is: "rw",
  })

  this.has("sub_x", {
    is: "rw",
    default: 0,
  })

  this.has("sub_y", {
    is: "rw",
    default: goal_sub / 2,
  })

  this.has("size", {
    is: "rw",
    default: 1,
  });

  this.has("hp", {
    is: "rw",
    default: 10,
  });

  this.has("hp_tot", {
    is: "rw",
    default: 10,
  });

  this.has("is_done", {
    is: "rw",
    default: false,
  });

  this.has("goal_sub_x", {
    is: "rw",
  });

  this.has("goal_sub_y", {
    is: "rw",
  });

  this.method("BUILD", function()
  {
    this.set_goal()
  })

  this.method("hp_pct", function()
  {
    return this.hp / this.hp_tot
  })

  this.method("grid", function()
  {
    return this.path[this.path_i];
  })

  this.method("x", function()
  {
    return this.grid()[0] + (this.sub_x / goal_sub);
  })

  this.method("y", function()
  {
    return this.grid()[1] + (this.sub_y / goal_sub);
  })

  this.method("set_goal", function()
  {
    if (this.path_i == null)
    {
      this.path_i = 0;
    }
    else
    {
      this.path_i++;
    }

    if (this.sub_x >= goal_sub)
      this.sub_x = 0
    else if (this.sub_x <= 0)
      this.sub_x = goal_sub
    if (this.sub_y >= goal_sub)
      this.sub_y = 0
    else if (this.sub_y <= 0)
      this.sub_y = goal_sub

    if (this.path[this.path_i] == null)
    {
      this.path_i--
      this.is_done = true;
      require('state/board').lose_life()
      return;
    }

    var path = this.path[this.path_i]
    var next = this.path[this.path_i + 1]
    if (next == null)
    {
      next = [ path[0]+1, path[1] ]
    }

    if (path[0] < next[0])
    {
      this.goal_sub_x = goal_sub
    }
    else if (path[0] > next[0])
    {
      this.goal_sub_x = 0
    }
    else
    {
      this.goal_sub_x = goal_sub / 2
    }

    if (path[1] < next[1])
    {
      this.goal_sub_y = goal_sub
    }
    else if (path[1] > next[1])
    {
      this.goal_sub_y = 0
    }
    else
    {
      this.goal_sub_y = goal_sub / 2
    }
  })

  this.method("take_dmg", function(dmg)
  {
     this.hp -= dmg;
     if (this.hp < 0 && !this.is_done)
     {
       this.is_done = true;
       var value = ceil(this.size)
       value = value < 1 ? 1 : value;
       require('state/board').balance += value
     }
  })

  this.method("frame", function()
  {
    if (this.sub_x == this.goal_sub_x && this.sub_y == this.goal_sub_y)
    {
      this.set_goal()
    }

    if (this.sub_x < this.goal_sub_x)
    {
      this.sub_x++
    }
    else if (this.sub_x > this.goal_sub_x)
    {
      this.sub_x--
    }

    if (this.sub_y < this.goal_sub_y)
    {
      this.sub_y++
    }
    else if (this.sub_y > this.goal_sub_y)
    {
      this.sub_y--
    }
  })

});

module.exports = Axman;
