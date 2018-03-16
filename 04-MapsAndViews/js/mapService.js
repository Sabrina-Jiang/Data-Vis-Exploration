let mapService = {
  geoData: undefined,
  geoPath: undefined,
  mapObject: undefined,
  deathData: undefined,
  /**
   * Map service
   *
   * Service will be initialed by external call.
   * In initialization process, base chart will be built.
   * And data injection process will be executed repeatedly
   * during service lifecycle.
   *
   * Communications between services relay on IPC.
   * Do IPCMain.call will send messages to IPC main.
   *
   * Abbreviated state name and full state name conversion
   * could use a hard-coded name hash is built in util.js
   *
   * d.properties.name: state name of current clicked element.
   *
   * @constructor
   */
  init: function () {
    // Build map
    // Width and height of map
    let width = 800
    let height = 500

    // D3 Projection
    let projection = d3.geo.albersUsa()
      .translate([width / 2, height / 2])    // translate to center of screen
      .scale([1000])          // scale things down so see entire US

    // Define path generator
    this.geoPath = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
      .projection(projection)  // tell path generator to use albersUsa projection

    // Create SVG element and append map to the SVG
    this.mapObject = d3.select('#usa-map')
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    // TODO: Add legend
    let legendText = ['Cities Lived', 'States Lived', 'States Visited', 'Nada']

    // Append Div for tooltip to SVG
    let div = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)

    // Load raw geo data
    // TODO: Add text on map.
    d3.json('data/us-states.json', (json) => {
      this.geoData = json

      let textMap = this.mapObject.selectAll('path')
        .data(this.geoData.features)
        .enter()
        .append('path')
        .attr('d', this.geoPath)
        .style('stroke', '#fff')
        .style('stroke-width', '1')
        .style('fill', (d) => {
          return '#fefefe'
        })
        .on('mouseover', (d) => {
          div.transition()
            .duration(200)
            .style('opacity', .9)
          div.text(`${d.properties.name} - ${this.deathData[d.properties.name]}`)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px')
        })
        .on('mouseout', (d) => {
          // fade out tooltip on mouse out
          div.transition()
            .duration(500)
            .style('opacity', 0)
        })
        .on('click', (d) => { IPCMain.send({state: d.properties.name}) })

      this.injectData()
    })
  },
  /**
   * Conditional data injection
   *
   * params receive object
   * By giving object with cause key and state key,
   * will the injection process execute with conditions
   *
   * Map represent data level with red color depth
   * from #f5f5f5 to #ff0000
   *
   * Data distribution among years doesn't change much
   * filter data with years almost changes no color.
   *
   * @param params
   */
  injectData: function (params) {
    let query = {}
    if (!!params) {
      if (!!params.year) query.year = params.year
      if (!!params.cause) query.cause = params.cause
    }

    // Prepare data
    let deathByState = util.deathByState(query)
    let deathMax = d3.max(deathByState, d => d.death)
    let deathMin = d3.min(deathByState, d => d.death)
    this.deathData = deathByState
      .reduce((obj, v) => {
        obj[v.state] = v.death
        return obj
      }, {})

    let colorScale = d3.scale.linear()
      .domain([deathMin, deathMax, deathMax])
      .range(['#f5f5f5', '#ff0000'])
    let data = deathByState
      .reduce((obj, v) => {
        obj[v.state] = colorScale(v.death)
        return obj
      }, {})

    this.mapObject.selectAll('path')
      .transition()
      .duration(1500)
      .style('fill', d => data[d.properties.name])
  }
}
