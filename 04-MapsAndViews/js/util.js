/**
 * Utility set, including:
 *
 * 1. Database helper
 * 2.
 *
 */
(function () {
  util.statesHash = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
  }
  util.statesHashInvert = Object.keys(util.statesHash)
    .reduce((obj, v) => {
      obj[util.statesHash[v]] = v
      return obj
    }, {})

  /**
   * Database helper function
   *
   * csv columns were removed from original file:
   * year,113_CAUSE_NAME,cause,state,death,AADR
   *
   * For all element search using query with {}
   * For conditional search using query with {keys: xxx}
   *
   * @param query: condition list
   * @returns {number | string | string | string | number | float}[]
   */
  util.dbHelper = function (query) {
    return database
      .filter(v => {
        if (Object.keys(query).length === 0) return true
        let flag
        for (let key of Object.keys(query)) {
          flag = query[key] === v[key]
          if (!flag) break
        }
        return flag
      })
  }

  /**
   * Get total death number
   *
   * Warning: this function must be executed after viewDidLoad
   *
   * @returns {string | number}
   */
  util.deathByState = function (query) {
    return Object.keys(util.statesHash)
      .map(v => {
        let death = util.dbHelper({state: v, ...query})
          .map(item => item.death)
          .reduce((s, v) => s + v, 0)
        return {
          state: v,
          death: death
        }
      })
  }

  /**
   * Get total death by cause
   *
   * Warning: this function must be executed after viewDidLoad
   *
   * @returns {number}
   */
  util.deathByCause = function (query) {
    return util.dbHelper({...query})
      .reduce((obj, v) => {
        if (obj[v.cause] !== undefined) { obj[v.cause] += v.death }
        else { obj[v.cause] = 0 }
        return obj
      }, {})
  }

  /**
   * Get total death by year
   *
   * Warning: this function must be executed after viewDidLoad
   *
   * @returns {number}
   */
  util.deathByYear = function (query) {
    return util.dbHelper({...query})
      .reduce((obj, v) => {
        if (obj[v.year] !== undefined) { obj[v.year] += v.death }
        else { obj[v.year] = 0 }
        return obj
      }, {})
  }
})()