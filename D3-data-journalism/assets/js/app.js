function makeResponsive() {
    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    const svgArea = d3.select('scatter').select('svg')

    // clear svg is not empty
    if (!svgArea.empty()) {
        svgArea.remove()
    }

    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    const svgWidth = window.innerWidth
    const svgHeight = window.innerHeight

    const margin = {
        top: 50,
        bottom: 50,
        right: 50,
        left: 50
    }

    const height = svgHeight - margin.top - margin.bottom
    const width = svgWidth - margin.left - margin.right

    // appending csv element
    const svg = d3
        .select('body')
        .append('svg')
        .attr('height', svgHeight)
        .attr('width', svgWidth)

    // append group element
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    d3.csv('/assets/data/data.csv').then(function(statedata) {
        // parsing the data
        statedata.forEach(function(data) {
            data.healthcareLow = +data.healthcareLow
            data.poverty = +data.poverty
        })

        // creating scales
        const xPovertyScale = d3.scaleLinear()
            .domain(d3.extent(statedata, d => d.poverty))
            .range([0, width])

        const yHealthCareLow = d3.scaleLinear()
            .domain(d3.extent(statedata, d => d.healthcareLow))
            .range([0, height])

        // creating the axis
        const xAxis = d3.axisBottom(xPovertyScale).ticks(26)
        const yAxis = d3.axisLeft(yHealthCareLow).ticks(22)

        // append axes
        chartGroup.append('g')
            .attr('transform', 'translate(0, ${height})')
            .call(xAxis)

        chartGroup.append('g')
            .call(yAxis)

        // Line generator
        const line = d3.line()
            .x(d => xPovertyScale(d.poverty))
            .y(d => yHealthCareLow(d.healthcareLow))

        // append line
        chartGroup.append('path')
            .data([statedata])
            .attr('d', line)
            .attr('fill', 'none')
            .attr('stroke', 'blue')

        // append circles
        const circlesGroup = chartGroup.selectAll('circle')
            .data(statedata)
            .enter()
            .append('circle')
            .attr('cx', d => xPovertyScale(d.poverty))
            .attr('cy', d => yHealthCareLow(d.healthcareLow))
            .attr('r', '10')
            .attr('fill', 'blue')
            .attr('stroke', 'black')

        // Step 1: Initialize Tooltip
        const toolTip = d3.tip()
            .attr('class', 'tooltip')
            .offset([80, -60])
            .html(function(d) {
                return (`<strong>${d.state}<strong>state`)
            })

        // Step 2: Create the tooltip in chartGroup.
        chartGroup.call(toolTip)

        // Step 3: Create "mouseover" event listener to display tooltip
        circlesGroup.on('mouseover', function(d) {
                toolTip.show(d, this)
            })
            // Step 4: Create "mouseout" event listener to hide tooltip
            .on('mouseout', function(d) {
                toolTip.hide(d)
            })
    }).catch(function(error) {
        console.log(error)
    })
}

makeResponsive()

d3.select(window).on('resize', makeResponsive)