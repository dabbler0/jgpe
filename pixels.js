(function() {
  var brushing, colour, colourEl, download, downloadType, eraseMainRect, erasing, fillMainRect, getHexAt, heightEl, main, mainCtx, pixelSize, pixelSizeEl, rgbToHex, type, widthEl;

  pixelSize = 10;

  type = 'BRUSH';

  colour = '#000';

  heightEl = $('#height');

  widthEl = $('#width');

  pixelSizeEl = $('#pixel-size');

  download = $('#download');

  colourEl = $('#colour');

  colourEl.ColorPicker({
    color: '#000000',
    onChange: function(hsb, hex, rgb) {
      return colourEl.css('background-color', colour = '#' + hex);
    }
  });

  $('#brush').click(function() {
    return type = 'BRUSH';
  });

  $('#fill').click(function() {
    return type = 'FILL';
  });

  $('#erase').click(function() {
    return type = 'ERASE';
  });

  main = document.getElementById('main');

  mainCtx = main.getContext('2d');

  $('#new').click(function() {
    pixelSize = Number(pixelSizeEl.val());
    main.style.height = (main.height = Number(heightEl.val() * pixelSize)) + 'px';
    main.style.width = (main.width = Number(widthEl.val() * pixelSize)) + 'px';
    return main.style.backgroundSize = pixelSize + 'px';
  });

  colourEl.on('updateVAl', function() {
    colour = colourEl.val();
    return colourEl.css('border-color', colour);
  });

  brushing = erasing = false;

  fillMainRect = function(x, y, c) {
    mainCtx.fillStyle = c;
    return mainCtx.fillRect(Math.floor(x / pixelSize) * pixelSize, Math.floor(y / pixelSize) * pixelSize, pixelSize, pixelSize);
  };

  eraseMainRect = function(x, y, c) {
    return mainCtx.clearRect(Math.floor(x / pixelSize) * pixelSize, Math.floor(y / pixelSize) * pixelSize, pixelSize, pixelSize);
  };

  rgbToHex = function(r, g, b) {
    return (r << 16 | g << 8 | b).toString(16);
  };

  getHexAt = function(ctx, x, y) {
    var p;
    p = ctx.getImageData(x, y, 1, 1).data;
    debugger;
    if (p[3] < 255) {
      return null;
    } else {
      return '#' + ('000000' + rgbToHex(p[0], p[1], p[2])).slice(0, 7);
    }
  };

  main.addEventListener('mousedown', function(e) {
    var coord, firstHex, queue, _results;
    switch (type) {
      case 'BRUSH':
        brushing = true;
        return fillMainRect(e.offsetX, e.offsetY, colour);
      case 'ERASE':
        erasing = true;
        return eraseMainRect(e.offsetX, e.offsetY);
      case 'FILL':
        queue = [
          {
            x: e.offsetX,
            y: e.offsetY
          }
        ];
        firstHex = getHexAt(mainCtx, queue[0].x, queue[0].y);
        if ((firstHex != null ? firstHex.toLowerCase() : void 0) === (colour != null ? colour.toLowerCase() : void 0)) {
          console.log('SAME COLOUR');
          return;
        }
        _results = [];
        while (queue.length > 0) {
          coord = queue.shift();
          if (getHexAt(mainCtx, coord.x, coord.y) === firstHex) {
            fillMainRect(coord.x, coord.y, colour);
            if (coord.x - pixelSize > 0) {
              queue.push({
                x: coord.x - pixelSize,
                y: coord.y
              });
            }
            if (coord.x + pixelSize < main.width) {
              queue.push({
                x: coord.x + pixelSize,
                y: coord.y
              });
            }
            if (coord.y - pixelSize > 0) {
              queue.push({
                x: coord.x,
                y: coord.y - pixelSize
              });
            }
            if (coord.y + pixelSize < main.height) {
              queue.push({
                x: coord.x,
                y: coord.y + pixelSize
              });
            }
            _results.push((function() {
              debugger;
            })());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
    }
  });

  main.addEventListener('mousemove', function(e) {
    if (brushing) {
      return fillMainRect(e.offsetX, e.offsetY, colour);
    } else if (erasing) {
      return eraseMainRect(e.offsetX, e.offsetY);
    }
  });

  document.body.addEventListener('mouseup', function() {
    return brushing = erasing = false;
  });

  downloadType = document.getElementById('download-type');

  download.click(function() {
    return window.open(main.toDataURL(downloadType.value));
  });

}).call(this);

//# sourceMappingURL=pixels.js.map
