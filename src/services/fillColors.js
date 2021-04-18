export default function randoGraph(canvasId, width, height, delay, startings) {
  this.pixels = new Array();
  this.colors = new Array();
  this.timeouts = new Array();
  this.randomFactor = 500;
  this.redFactor = 0.30;
  this.blueFactor = 0.11;
  this.greenFactor = 0.59;
  this.processes = 1;
  this.canvas = document.getElementById(canvasId);
  this.pixelsIn = new Array();
  this.stopped = false;

  this.canvas.width = width;
  this.canvas.height = height;
  this.context = this.canvas.getContext("2d");
  this.context.clearRect(0, 0, width - 1, height - 1);
  this.shadesPerColor = Math.pow(width * height, 1 / 3);
  this.shadesPerColor = Math.round(this.shadesPerColor * 1000) / 1000;

  this.setRandomness = function (randomFactor, redFactor, blueFactor, greenFactor) {
    this.randomFactor = randomFactor;
    this.redFactor = redFactor;
    this.blueFactor = blueFactor;
    this.greenFactor = greenFactor;
  }

  this.setProccesses = function (processes) {
    this.processes = processes;
  }

  this.fill = function () {
    if (this.shadesPerColor > 256 || this.shadesPerColor % 1 > 0) {
      return;
    }
    else {
      var steps = 256 / this.shadesPerColor;
      for (let red = steps / 2; red <= 255;) {
        for (let blue = steps / 2; blue <= 255;) {
          for (let green = steps / 2; green <= 255;) {
            this.colors.push(new Color(Math.round(red), Math.round(blue), Math.round(green)));
            green = green + steps;
          }
          blue = blue + steps;
        }
        red = red + steps;
      }

      for (var i = 0; i < startings; i++) {
        var color = this.colors.splice(randInt(0, this.colors.length - 1), 1)[0];
        var pixel = new Pixel(randInt(0, width - 1), randInt(0, height - 1), color);
        this.addPixel(pixel);
      }

      for (var i = 0; i < this.processes; i++) {
        this.timeouts.push(null);
        this.proceed(i);
      }
    }
  }

  this.proceed = function (index) {
    if (this.pixels.length > 0) {
      this.proceedPixel(this.pixels.splice(randInt(0, this.pixels.length - 1), 1)[0]);
      this.timeouts[index] = setTimeout(function (that) { if (!that.stopped) { that.proceed(); } }, this.delay, this);
    }
  }

  this.proceedPixel = function (pixel) {
    for (var nx = pixel.getX() - 1; nx < pixel.getX() + 2; nx++) {
      for (var ny = pixel.getY() - 1; ny < pixel.getY() + 2; ny++) {
        if (!(this.pixelsIn[nx + "x" + ny] == 1 || ny < 0 || nx < 0 || nx > width - 1 || ny > height - 1 || (nx == pixel.getX() && ny == pixel.getY()))) {
          var color = this.selectRelevantColor(pixel.getColor());
          var newPixel = new Pixel(nx, ny, color);
          this.addPixel(newPixel);
        }
      }
    }
  }

  this.selectRelevantColor = function (color) {
    var relevancies = new Array();
    var relColors = new Array();
    for (var i = 0; i < this.randomFactor && i < this.colors.length; i++) {
      var index = randInt(0, this.colors.length - 1);
      var c = this.colors[index];
      var relevancy = Math.pow(((c.getRed() - color.getRed()) * this.redFactor), 2)
        + Math.pow(((c.getBlue() - color.getBlue()) * this.blueFactor), 2)
        + Math.pow(((c.getGreen() - color.getGreen()) * this.greenFactor), 2);
      relevancies.push(relevancy);
      relColors[relevancy + "Color"] = index;
    }
    return this.colors.splice(relColors[relevancies.min() + "Color"], 1)[0]
  }

  this.addPixel = function (pixel) {
    this.pixels.push(pixel);
    this.pixelsIn[pixel.getX() + "x" + pixel.getY()] = 1;
    var color = pixel.getColor();
    this.context.fillStyle = "rgb(" + color.getRed() + "," + color.getBlue() + "," + color.getGreen() + ")";
    this.context.fillRect(pixel.getX(), pixel.getY(), 1, 1);
  }

  this.clear = function () {
    this.stopped = true;
  }
}

function Color(red, blue, green) {
  this.getRed = function () { return red; }
  this.getBlue = function () { return blue; }
  this.getGreen = function () { return green; }
}

function Pixel(x, y, color) {
  this.getX = function () { return x; }
  this.getY = function () { return y; }
  this.getColor = function () { return color; }
}


function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min
Array.prototype.min = function () {
  return Math.min.apply(null, this);
};

// @see http://stackoverflow.com/questions/5223/length-of-javascript-object-ie-associative-array
Object.size = function (obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};