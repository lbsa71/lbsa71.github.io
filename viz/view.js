
// Embed the visualization in the container with id `vis`

var opt = {
  width: 800,
  height: 250
}

$(()=> { vegaEmbed('#vis', vlSpec, opt).then(function(result) {
    view = result.view
  }).catch(console.error)

 })
