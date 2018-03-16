let color, arc, pie, outerArc, key, radius, div

let donutService = {
  donutObject: undefined,
  /**
   * Donut chart service
   *
   * Service will be initialed by external call.
   * In initialization process, base chart will be built.
   * And data injection process will be executed repeatedly
   * during service lifecycle.
   *
   * Communications between services relay on IPC.
   * Do IPCMain.call will send messages to IPC main.
   *
   * e.id: cause of current clicked element.
   *
   * @constructor
   */
  init: function () {
    let width = 1200,
      height = 450
    radius = Math.min(width, height) / 2

    this.donutObject = d3.select('#donut-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')

    this.donutObject.append('g')
      .attr('class', 'slices')
    this.donutObject.append('g')
      .attr('class', 'labels')
    this.donutObject.append('g')
      .attr('class', 'lines')

    pie = d3.layout.pie()
      .sort(null)
      .value(function (d) {
        return d.value
      })

    arc = d3.svg.arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4)

    outerArc = d3.svg.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)

    this.donutObject.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

    key = function (d) { return d.data.label }

    let causes = ['Unintentional Injuries', 'Alzheimer\'s disease', 'Homicide', 'Stroke',
      'Chronic liver disease and cirrhosis', 'CLRD', 'Diabetes', 'Diseases of Heart',
      'Essential hypertension and hypertensive renal disease', 'Influenza and pneumonia',
      'Suicide', 'Cancer', 'Kidney Disease', 'Parkinson\'s disease', 'Pneumonitis due to solids and liquids',
      'Septicemia']

    color = d3.scale.ordinal()
      .domain(causes)
      .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00',
        '#0f8d95', '#11a2ad', '#14b8c4', '#16cedb', '#22dce9', '#39dfeb', '#50e3ed', '#04292b', '#021415'])

    div = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)

    this.injectData()
  },
  change: function (data) {
    /* ------- PIE SLICES -------*/
    let slice = this.donutObject.select('.slices').selectAll('path.slice')
      .data(pie(data), key)

    slice.enter()
      .insert('path')
      .style('fill', function (d) { return color(d.data.label) })
      .attr('class', 'slice')
      .on('click', d => { IPCMain.send({cause: d.data.label}) })
      .on('mouseover', (d) => {
        div.transition()
          .duration(200)
          .style('opacity', .9)
        div.text(d.data.value)
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px')
      })
      .on('mouseout', (d) => {
        // fade out tooltip on mouse out
        div.transition()
          .duration(1500)
          .style('opacity', 0)
      })

    slice
      .transition().duration(1000)
      .attrTween('d', function (d) {
        this._current = this._current || d
        let interpolate = d3.interpolate(this._current, d)
        this._current = interpolate(0)
        return function (t) {
          return arc(interpolate(t))
        }
      })

    slice.exit()
      .remove()

    /* ------- TEXT LABELS -------*/

    let text = this.donutObject.select('.labels').selectAll('text')
      .data(pie(data), key)

    text.enter()
      .append('text')
      .attr('dy', '.35em')
      .text(function (d) {
        return d.data.label
      })

    function midAngle (d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2
    }

    text.transition().duration(1000)
      .attrTween('transform', function (d) {
        this._current = this._current || d
        let interpolate = d3.interpolate(this._current, d)
        this._current = interpolate(0)
        return function (t) {
          let d2 = interpolate(t)
          let pos = outerArc.centroid(d2)
          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1)
          return 'translate(' + pos + ')'
        }
      })
      .styleTween('text-anchor', function (d) {
        this._current = this._current || d
        let interpolate = d3.interpolate(this._current, d)
        this._current = interpolate(0)
        return function (t) {
          let d2 = interpolate(t)
          return midAngle(d2) < Math.PI ? 'start' : 'end'
        }
      })

    text.exit()
      .remove()

    /* ------- SLICE TO TEXT POLYLINES -------*/

    let polyline = this.donutObject.select('.lines').selectAll('polyline')
      .data(pie(data), key)

    polyline.enter()
      .append('polyline')

    polyline.transition()
      .duration(1000)
      .attrTween('points', function (d) {
        this._current = this._current || d
        let interpolate = d3.interpolate(this._current, d)
        this._current = interpolate(0)
        return function (t) {
          let d2 = interpolate(t)
          let pos = outerArc.centroid(d2)
          pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1)
          return [arc.centroid(d2), outerArc.centroid(d2), pos]
        }
      })

    polyline.exit()
      .remove()
  },
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
    let query = {}
    if (!!params) {
      if (!!params.year) query.year = params.year
      if (!!params.state) query.state = params.state
    }

    let deathByCause = util.deathByCause(query)
    let data = Object.keys(deathByCause)
      .map(v => [v, deathByCause[v]])
      .filter(v => v[0] !== 'All Causes')

    for (let i = 0; i < 4; i++) {
      let tmp = data.pop()
      data.splice(5, 0, tmp)
    }

    this.change(data.map(v => {
      return {label: v[0], value: v[1]}
    }))
  }
}
