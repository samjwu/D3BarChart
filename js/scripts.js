document.addEventListener('DOMContentLoaded', function () {
    var svgContainer = d3
        .select('.graph')
        .append('svg')
        .attr('width', graphWidth + 100)
        .attr('height', graphHeight + 60);

    var tooltip = d3
        .select('.graph')
        .append('div')
        .attr('id', 'tooltip')
        .style('opacity', 0);

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

            var xAxis = d3.axisBottom().scale(xScale);

            svgContainer
                .append('g')
                .call(xAxis)
                .attr('id', 'x-axis')
                .attr('transform', 'translate(60, 400)');

            // y
            var GDP = jsonData.data.map(function (item) {
                return item[1];
            });

            var scaledGDP = [];

            var yMax = d3.max(GDP);

            var linearScale = d3.scaleLinear().domain([0, yMax]).range([0, graphHeight]);

            scaledGDP = GDP.map(function (item) {
                return linearScale(item);
            });

            var yScale = d3.scaleLinear().domain([0, yMax]).range([graphHeight, 0]);

            var yAxis = d3.axisLeft(yScale);

            svgContainer
                .append('g')
                .call(yAxis)
                .attr('id', 'y-axis')
                .attr('transform', 'translate(60, 0)');
        });
});
