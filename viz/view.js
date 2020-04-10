
// Embed the visualization in the container with id `vis`

var opt = {
  width: 800,
  height: 250
}

$(()=> {

  // var salaryData = [
  //   {region: "SE Riket", "kön": "män", "2018": 19600},
  //   {region: "SE Riket", "kön": "kvinnor", "2018": 43600},
  //   {region: "SE11 Stockholm", "kön": "män", "2018": 7000},
  //   {region: "SE11 Stockholm", "kön": "kvinnor", "2018": 15100}
  // ]

  vegaEmbed('#vis', vlSpec, opt).then(function(result) {
    view = result.view

    // view
    //   .insert('salary', salaryData)
    //   .run()
  }).catch(console.error)

 })
