pixelSize = 10

type = 'BRUSH'

colour = '#000'

heightEl = $ '#height'
widthEl = $ '#width'
pixelSizeEl = $ '#pixel-size'

download = $ '#download'

colourEl = $ '#colour'

colourEl.ColorPicker({
  color: '#000000'
  onChange: (hsb, hex, rgb)->
    colourEl.css 'background-color', colour = '#' + hex
})

$('#brush').click -> type = 'BRUSH'
$('#fill').click -> type = 'FILL'
$('#erase').click -> type = 'ERASE'

main = document.getElementById 'main'

mainCtx = main.getContext '2d'

$('#new').click ->
  pixelSize = Number pixelSizeEl.val()
  main.style.height = (main.height = Number heightEl.val() * pixelSize) + 'px'
  main.style.width = (main.width = Number widthEl.val() * pixelSize) + 'px'
  main.style.backgroundSize = pixelSize + 'px'

colourEl.on 'updateVAl', ->
  colour = colourEl.val()
  colourEl.css 'border-color', colour

brushing = erasing = false

fillMainRect = (x, y, c) ->
    mainCtx.fillStyle = c
    mainCtx.fillRect Math.floor(x / pixelSize) * pixelSize, Math.floor(y / pixelSize) * pixelSize, pixelSize, pixelSize

eraseMainRect = (x, y, c) ->
    mainCtx.clearRect Math.floor(x / pixelSize) * pixelSize, Math.floor(y / pixelSize) * pixelSize, pixelSize, pixelSize

rgbToHex = (r, g, b) ->
  return (r << 16 | g << 8 | b).toString 16

getHexAt = (ctx, x, y) ->
  p = ctx.getImageData(x, y, 1, 1).data
  debugger
  if p[3] < 255
    return null
  else
    return '#' + ('000000' + rgbToHex p[0], p[1], p[2])[..6]

main.addEventListener 'mousedown', (e) ->
  switch type
    when 'BRUSH'
      brushing = true
      fillMainRect e.offsetX, e.offsetY, colour

    when 'ERASE'
      erasing = true
      eraseMainRect e.offsetX, e.offsetY

    when 'FILL'
      queue = [{x: e.offsetX, y: e.offsetY}]

      firstHex = getHexAt mainCtx, queue[0].x, queue[0].y

      if firstHex?.toLowerCase() is colour?.toLowerCase()
        console.log 'SAME COLOUR'
        # Abort, nothing needs to be done.
        return

      while queue.length > 0
        coord = queue.shift()
        if getHexAt(mainCtx, coord.x, coord.y) is firstHex
          fillMainRect coord.x, coord.y, colour

          if coord.x - pixelSize > 0
            queue.push {
              x: coord.x - pixelSize
              y: coord.y
            }

          if coord.x + pixelSize < main.width
            queue.push {
              x: coord.x + pixelSize
              y: coord.y
            }

          if coord.y - pixelSize > 0
            queue.push {
              x: coord.x
              y: coord.y - pixelSize
            }

          if coord.y + pixelSize < main.height
            queue.push {
              x: coord.x
              y: coord.y + pixelSize
            }

          debugger

main.addEventListener 'mousemove', (e) ->
  if brushing
    fillMainRect e.offsetX, e.offsetY, colour
  else if erasing
    eraseMainRect e.offsetX, e.offsetY

document.body.addEventListener 'mouseup', ->
  brushing = erasing = false

downloadType = document.getElementById 'download-type'

download.click ->
  window.open main.toDataURL(downloadType.value)
