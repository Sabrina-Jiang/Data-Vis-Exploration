let barService = {
  chartObject: undefined,
  barObject: undefined,
  width: 0,
  height: 0,
  xRange: 0,
  yRange: 0,
  xAxis: undefined,
  yAxis: undefined,
  /**
   * Bar chart service
   *
   * Service will be initialed by external call.
   * In initialization process, base chart will be built.
   * And data injection process will be executed repeatedly
   * during service lifecycle.
   *
   * Communications between services relay on IPC.
   * Do IPCMain.call will send messages to IPC main.
   *
   * 1999 + e.x: year of current clicked element
   *
   * @constructor
   */
  init:
    function () {
      // Build chart
      let margin = {top: 20, right: 20, bottom: 30, left: 130}
      this.chartObject = d3.select('#bar-chart > svg')
      this.width = +this.chartObject.attr('width') - margin.left - margin.right
      this.height = +this.chartObject.attr('height') - margin.top - margin.bottom

      // x, y scale
      this.xRange = d3.scale.ordinal().rangeRoundBands([0, this.width], 0.05)
      this.yRange = d3.scale.linear().range([this.height, 0])

      this.xAxis = d3.svg.axis()
        .scale(this.xRange)
        .orient('bottom')

      this.yAxis = d3.svg.axis()
        .scale(this.yRange)
        .orient('left')
        .ticks(10)

      // Add g
      this.barObject = this.chartObject.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      // Filling blank data
      let dataStack = []
      for (let i = 1999; i < 2014; i++) dataStack.push({death: 30, year: i})

      this.xRange.domain(dataStack.map(d => d.year))
      this.yRange.domain([0, d3.max(dataStack, d => d.death)])

      this.barObject.append('g')
        .attr('class', 'bar-axis bar-axis-x')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(this.xAxis)

      this.barObject.append('g')
        .attr('class', 'bar-axis bar-axis-y')
        .call(this.yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Frequency')

      let div = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)

      this.barObject.selectAll('.bar')
        .data(dataStack)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => this.xRange(d.year))
        .attr('y', d => this.yRange(d.death))
        .attr('width', this.xRange.rangeBand())
        .attr('height', d => this.height - this.yRange(d.death))
        .on('click', d => { IPCMain.send({year: d.year}) })
        .on('mouseover', (d) => {
          div.transition()
            .duration(200)
            .style('opacity', .9)
          div.text(d.death)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px')
        })
        .on('mouseout', (d) => {
          // fade out tooltip on mouse out
          div.transition()
            .duration(2000)
            .style('opacity', 0)
        })

      this.injectData()
    }
  ,
  /**
   * Conditional data injection
   *
   * params receive object
   * By giving object with cause key and state key,
   * will the injection process execute with conditions
   *
   * @param params
   */
  injectData: function (params) {
    // params check, condition query build
    let query = {}
    if (!!params) {
      if (!!params.cause) query.cause = params.cause
      if (!!params.state) query.state = params.state
    }

    // Executing query
    let deathByYear = util.deathByYear(query)
    let data = Object.keys(deathByYear)
      .map((v, i) => {return {death: deathByYear[v], year: 1999 + i}})

    // Filter max and min data for Y axis range
    let min = Math.min(...data)
    let max = Math.max(...data)

    // 0.995 is a magic number
    this.yRange.domain([d3.min(data, d => d.death) * 0.99, d3.max(data, d => d.death)])

    this.barObject.selectAll('rect.bar')
      .data(data)
      .transition()
      .duration(1500)
      .attr('y', d => this.yRange(d.death))
      .attr('height', d => this.height - this.yRange(d.death))

    this.barObject.selectAll('.bar-axis-y')
      .transition()
      .call(this.yAxis)

  }
}