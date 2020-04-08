var vlSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
  resolve: {
    axis: {
      x: "shared"
    }
  },
  layer: [{
      transform: [{
        calculate: "datum.deaths * 10000000 / datum.popData2018",
        as: "deathsPer10M"
      }],
      transform: [{
        calculate: "time(datum.dateRep)",
        as: "timestamp"
      }],
      data: {
        name: "deathsPerDaySweden",
        url: "data/deathsPerDaySweden.tsv",
        format: {
          type: "tsv",
          parse: {
            dateRep: "date:'%m/%d/%Y'"
          }
        }
      },
      layer: [{
        mark: {
          type: "line",
          strokeDash: [6, 4],
          clip: "true",
          interpolate: "basis"
        },
        encoding: {
          y: {
            field: "Dead",
            type: "quantitative"
          }
        }
      }]
    },
    {
      data: {
        name: "raw",
        url: "data/covid-19.csv",
        // url: "https://opendata.ecdc.europa.eu/covid19/casedistribution/csv",
        format: {
          type: "csv",
          parse: {
            dateRep: "date:'%d/%m/%Y'"
          }
        }
      },
      transform: [{
          filter: {
            field: "countriesAndTerritories",
            oneOf: ["Sweden", "Italy", "Norway", "China", "United_States_of_America"]
          }
        },
        {
          calculate: "datum.deaths * 10000000 / datum.popData2018",
          as: "deathsPer10M"
        },{
          calculate: "time(datum.dateRep)",
          as: "timestamp"
        },
        {
          groupby: ["countriesAndTerritories"],
          sort: [{
            "field": "dateRep"
          }],
          window: [{
            "op": "sum",
            "field": "deathsPer10M",
            "as": "totalDeathsPer10M"
          }],
          frame: [null, 0]
        },
        {
          groupby: ["countriesAndTerritories"],
          sort: [{
            "field": "dateRep"
          }],
          window: [{
            "op": "min",
            "field": "timestamp",
            "as": "firstTimestamp"
          }],
          frame: [null, null]
        },
        {
          filter: "datum.totalDeathsPer10M > 0"
        }
      ],
      layer: [{
        mark: {
          type: "line",
          clip: "true",
          interpolate: "basis"
        },
        selection: {
          countriesAndTerritories: {
            type: "multi",
            fields: ["countriesAndTerritories"],
            bind: "legend"
          }
        },
        encoding: {
          tooltip: [{
              "field": "dateRep",
              "type": "ordinal"
            },
            {
              "field": "totalDeathsPer10M",
              "type": "quantitative"
            }
          ],
          color: {
            field: 'countriesAndTerritories',
            type: 'nominal'
          },
          opacity: {
            condition: {
              "selection": "countriesAndTerritories",
              "value": 1
            },
            value: 0.2
          },
          y: {
            field: "deathsPer10M",
            type: "quantitative",
            axis: {
              title: 'Deaths'
            }
          }
        }
      }]
    }
  ],

  encoding: {
    x: {
      field: 'dateRep',
      type: 'temporal',
      axis: {
        title: 'Date'
      }
    },
  }
}

// ---

var vlSpec2 = {
  $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
  resolve: {
    axis: {
      x: "shared"
    }
  },
  data: [{
    name: "raw",
    url: "data/covid-19.csv",
    // url: "https://opendata.ecdc.europa.eu/covid19/casedistribution/csv",
    format: {
      type: "csv",
      parse: {
        dateRep: "date:'%d/%m/%Y'"
      }
    }
  }],
  layer: [{
      data: {
        name: "deathsPerDaySweden",
        url: "data/deathsPerDaySweden.tsv",
        format: {
          type: "tsv",
          parse: {
            dateRep: "date:'%m/%d/%Y'"
          }
        }
      },
      mark: "line",
      encoding: {

        y: {
          field: "Dead",
          type: "quantitative"
        }
      }
    },
    {
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
      filter: {
        field: "countriesAndTerritories",
        oneOf: ["Sweden", "Italy", "Norway "]
      }
    },
    {
      filter: "datum.cases > 0"
    },
    {
      groupby: ["countriesAndTerritories"],
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
    x: {
      field: 'timestamp',
      type: 'numeric',
      axis: {
        title: 'Date'
      }
    }
  }
}
