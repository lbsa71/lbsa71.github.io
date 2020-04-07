var vlSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v4.json',

  data: {
    name: "raw",
    // url: "data/covid-19.csv",
    url: "https://opendata.ecdc.europa.eu/covid19/casedistribution/csv",
    format: {
      type: "csv",
      parse: {
        dateRep: "date:'%d/%m/%Y'"
      }
    }
  },
  layer: [{
      mark: "line",
      encoding: {
        y: {
          field: "totalDeathsPer10M",
          type: "quantitative"
        }
      }
    },
    {
      mark: {
        "type": "rule",
        "opacity": 1
      },
      selection: {
        "highlighted": {
          "type": "single",
          "on": "mouseover",
          "encodings": ["x"],
          "empty": "none",
          "nearest": true
        }
      },
      encoding: {
        "opacity": {
          "condition": {
            "selection": "highlighted",
            "value": 1
          },
          "value": 0
        }
      }
    },
    {
      "mark": {
        "type": "point",
        "opacity": 1,
        "size": 100,
        "fill": "white"
      },
      "encoding": {
        "y": {
          "field": "totalDeathsPer10M",
          "type": "quantitative"
        },
        "opacity": {
          "condition": {
            "selection": "highlighted",
            "value": 1
          },
          "value": 0
        }
      }
    }
  ],
  transform: [{
      calculate: "datum.deaths * 10000000 / datum.popData2018",
      as: "newDeathsPer10M"
    },
    {
      filter:
      {
        field: "countriesAndTerritories", "oneOf": ["Sweden", "Italy"]
      }
    },
    {
      filter: "datum.cases > 0"
    },
    {
      groupby: [ "countriesAndTerritories" ],
      sort: [{
        "field": "dateRep"
      }],
      window: [{
        "op": "sum",
        "field": "newDeathsPer10M",
        "as": "totalDeathsPer10M"
      }],
      frame: [null, 0]
    }
  ],

  encoding: {
    color: {
      field: 'countriesAndTerritories',
      type: 'nominal'
    },
    // y: {
    //   field: 'deathsPer10M',
    //   type: 'quantitative'
    // },
    x: {
      field: 'dateRep',
      type: 'temporal',
      axis: {
        title: 'Date'
      },
      condition: {
        selection: "dates"
      }
    }
  }
}
