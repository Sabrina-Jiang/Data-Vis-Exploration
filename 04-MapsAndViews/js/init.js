/**
 * Init database, load CSV data via fetch
 * and reformat CSV into a JSON object
 *
 * @constructor
 */
(function () {
  d3.csv('data/leading_cause_death.csv', (err, data) => {
    database = data
      .map(v => {
        v.year = parseInt(v.year)
        v.death = parseInt(v.death)
        v.AADR = parseFloat(v.AADR)
        // v.state = util.statesHash[v.state]
        return v
      })
      .filter(v => !isNaN(v.death))
    viewDidLoad()
  })
})()