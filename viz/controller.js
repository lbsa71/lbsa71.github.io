var vlSpec = {

  $schema: 'https://vega.github.io/schema/vega-lite/v4.json',

  data: {
    name: "salary",
    url: "data/AM0103AK.csv",
    format: {
      type: "tsv"
    }
  },

  vconcat: [{

    selection: {
      regionLineSelection: {
        type: "multi",
        fields: ["region"],
        on: "mouseover"
      },
      //   regionLegendSelection: {
      //     type: "multi",
      //     fields: ["region"],
      //     bind: "legend"
      //   }
    },
    transform: [{
        fold: ["2014", "2015", "2016", "2017", "2018"],
        as: ["year", "salary"]
      },
      {
        filter: "datum['salary'] > 0"
      }
      // ,
      // {
      //   filter: "datum['region'] == 'SE Riket'"
      // }
    ],
    width: 500,
    mark: {
      type: "line"
    },
    encoding: {

      opacity: {
        condition: {
          selection: "regionLineSelection"
            // {
            //   "or": ["regionLineSelection","regionLegendSelection"]
            // }
            ,
          value: 1
        },
        value: 0.2
      },

      "color": {
        "field": "region",
        "type": "nominal"
      },
      "strokeDash": {
        "field": "kön",
        "type": "nominal"
      },

      y: {
        field: "salary",
        type: "quantitative",
        scale: {
          domain: [135, 165]
        },
        axis: {
          title: 'Lön'
        }
      },

      x: {
        field: "year",
        type: "ordinal"
      }
    }
  }]
}

var vlSpec3 = {
  $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
  resolve: {
    axis: {
      x: "shared"
    }
  },
  signals: [{
    name: "firstCharSignal",
    value: "A",
    bind: {
      "input": "select",
      "options": [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K"
      ]
    }
  }],
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
          interpolate: "linear"
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
      transform: [
        // {
        //   filter: {
        //     field: "countriesAndTerritories",
        //     oneOf: ["Sweden", "Italy", "Norway", "China", "United_States_of_America"]
        //   }
        // },
        {
          calculate: "datum.deaths / datum.popData2018 * 10000000 ",
          as: "deathsPer10M"
        },
        {
          calculate: "substring(datum.countriesAndTerritories,0,1)",
          as: "firstChar"
        },
        {
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
          // Filter out countries that are not yet statistically valid
          filter: "datum.totalDeathsPer10M > 10"
        },
        {
          // Filter out very small countries that screw up statistics
          filter: "datum.popData2018 > 3000000"
        }
        // ,
        // {
        //   filter: {
        //     field: "firstChar",
        //     equal: "A"
        //     //  {
        //     //   signal: "firstCharSignal"
        //     // }
        //   }
        // }
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
              "field": "countriesAndTerritories",
              "type": "nominal"
            },
            {
              "field": "deaths",
              "type": "ordinal"
            },
            {
              "field": "popData2018",
              "type": "nominal"
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
      },
      scale: {
        domain: [{
            year: 2020,
            month: 3
          },
          {
            year: 2020,
            month: 5
          }
        ]
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
      type: 'nominal',
      axis: {
        title: 'Date'
      }
    }
  }
}
