document.addEventListener('DOMContentLoaded', function () {
    var tooltip = d3
        .select('.graph')
        .append('div')
        .attr('id', 'tooltip')
        .style('opacity', 0);

    var overlay = d3
        .select('.graph')
        .append('div')
        .attr('class', 'overlay')
        .style('opacity', 0);

    var svgContainer = d3
        .select('.graph')
        .append('svg')
        .attr('width', graphWidth + 100)
        .attr('height', graphHeight + 100);

    d3.json(dataSource)
        .then((jsonData) => {
            // x
            var dateObjects = jsonData.data.map(function (item) {
                return new Date(item[0]);
            });

            var dateStrings = jsonData.data.map(function (item) {
                var year = item[0].substring(0, 4);
                var month = item[0].substring(5, 7);
                var quarter;

                if (month === '01') {
                    quarter = 'Q1';
                } else if (month === '04') {
                    quarter = 'Q2';
                } else if (month === '07') {
                    quarter = 'Q3';
                } else if (month === '10') {
                    quarter = 'Q4';
                }

                return year + ' ' + quarter;
            });

            var xMax = new Date(d3.max(dateObjects));
            xMax.setMonth(xMax.getMonth());

            var xScale = d3
                .scaleTime()
                .domain([d3.min(dateObjects), xMax])
                .range([0, graphWidth]);

            var xAxis = d3.axisBottom()
                .scale(xScale);

            svgContainer
                .append('g')
                .call(xAxis)
                .attr('id', 'x-axis')
                .attr('transform', 'translate(60, 410)');

            // y
            var GDP = jsonData.data.map(function (item) {
                return item[1];
            });

            var yMax = d3.max(GDP);

            var linearScale = d3.scaleLinear()
                .domain([0, yMax])
                .range([0, graphHeight]);

            var scaledGDP = GDP.map(function (item) {
                return linearScale(item);
            });

            var yScale = d3.scaleLinear()
                .domain([0, yMax])
                .range([graphHeight, 0]);

            var yAxis = d3.axisLeft(yScale);

            svgContainer
                .append('g')
                .call(yAxis)
                .attr('id', 'y-axis')
                .attr('transform', 'translate(60, 10)');

            d3.select('svg')
                .selectAll('rect')
                .data(scaledGDP)
                .enter()
                .append('rect')
                .attr('data-date', function (d, i) {
                    return jsonData.data[i][0];
                })
                .attr('data-gdp', function (d, i) {
                    return jsonData.data[i][1];
                })
                .attr('class', 'bar')
                .attr('x', function (d, i) {
                    return xScale(dateObjects[i]);
                })
                .attr('y', function (d) {
                    return graphHeight - d;
                })
                .attr('width', barWidth)
                .attr('height', function (d) {
                    return d;
                })
                .attr('transform', 'translate(60, 10)')
                .attr('index', (d, i) => i)
                .on('mouseover', function (event, d) {
                    var i = this.getAttribute('index');
                    var barX = xScale(dateObjects[i]) + 60;

                    overlay
                        .transition()
                        .duration(0)
                        .style('height', d + 'px')
                        .style('width', barWidth + 'px')
                        .style('opacity', 0.9)
                        .style('left', barX + 'px')
                        .style('top', graphHeight + 10 - d + 'px');
                    tooltip.transition().duration(200).style('opacity', 0.9);
                    tooltip
                        .html(
                            dateStrings[i] +
                            '<br>' +
                            '$' +
                            Math.floor(GDP[i]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '') +
                            ' Billion'
                        )
                        .attr('data-date', jsonData.data[i][0])
                        .style('left', barX + 30 + 'px')
                        .style('top', graphHeight - 100 + 'px');
                })
                .on('mouseout', function () {
                    tooltip.transition().duration(200).style('opacity', 0);
                    overlay.transition().duration(200).style('opacity', 0);
                });
        })
        .catch((e) => console.log(e));
});
