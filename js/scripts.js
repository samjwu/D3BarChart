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
});
