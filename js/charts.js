// Department of Treasury and Finance — Infrastructure Division / Data Analytics Team
// Chart rendering: D3.js + Chart.js, drawing from Victorian public budget & population data.

document.addEventListener('DOMContentLoaded', function () {
  drawPopulation();
  drawGII();
  drawBudget();
  drawDebt();
});

// D3: population line chart
function drawPopulation() {
  var el = document.getElementById('pop-chart');
  if (!el || !window.d3) return;
  var d3 = window.d3;
  var data = [
    { year: 2024, value: 6.98, type: 'actual' },
    { year: 2025, value: 7.10, type: 'actual' },
    { year: 2051, value: 10.3, type: 'projected' }
  ];
  var width = el.clientWidth || 480;
  var height = 260;
  var margin = { top: 16, right: 20, bottom: 30, left: 40 };

  var svg = d3.select(el).append('svg')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('width', '100%')
    .attr('height', height);

  var x = d3.scaleLinear().domain([2024, 2051]).range([margin.left, width - margin.right]);
  var y = d3.scaleLinear().domain([6, 11]).range([height - margin.bottom, margin.top]);

  svg.append('g')
    .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
    .call(d3.axisBottom(x).tickValues([2024, 2025, 2051]).tickFormat(d3.format('d')))
    .call(function (g) { g.selectAll('text').attr('font-size', 11).attr('fill', '#5c6570'); })
    .call(function (g) { g.selectAll('line,path').attr('stroke', '#dfe3e8'); });

  svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',0)')
    .call(d3.axisLeft(y).ticks(5))
    .call(function (g) { g.selectAll('text').attr('font-size', 11).attr('fill', '#5c6570'); })
    .call(function (g) { g.selectAll('line,path').attr('stroke', '#dfe3e8'); });

  var line = d3.line().x(function (d) { return x(d.year); }).y(function (d) { return y(d.value); }).curve(d3.curveMonotoneX);
  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#0060a8')
    .attr('stroke-width', 3)
    .attr('d', line);

  svg.selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', function (d) { return x(d.year); })
    .attr('cy', function (d) { return y(d.value); })
    .attr('r', 5)
    .attr('fill', function (d) { return d.type === 'projected' ? '#6b3fa0' : '#0060a8'; })
    .attr('stroke', '#fff')
    .attr('stroke-width', 2);

  svg.selectAll('.lbl')
    .data(data)
    .join('text')
    .attr('class', 'lbl')
    .attr('x', function (d) { return x(d.year); })
    .attr('y', function (d) { return y(d.value) - 14; })
    .attr('text-anchor', function (d) { return d.year === 2051 ? 'end' : 'middle'; })
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .attr('fill', '#1a1f29')
    .text(function (d) { return d.value + 'M'; });
}

// Chart.js: government infrastructure investment bar chart
function drawGII() {
  var canvas = document.getElementById('gii-chart');
  if (!canvas || !window.Chart) return;
  new window.Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['2023-24', '2025-26', '2029-30'],
      datasets: [{
        label: 'Infrastructure investment ($bn)',
        data: [24.2, 21.4, 15.3],
        backgroundColor: ['#0060a8', '#3d7ec4', '#6b3fa0'],
        borderRadius: 6,
        maxBarThickness: 70
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: function (ctx) { return '$' + ctx.parsed.y + 'bn'; } } }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: '#eef0f2' }, ticks: { callback: function (v) { return '$' + v + 'bn'; }, color: '#5c6570', font: { size: 11 } } },
        x: { grid: { display: false }, ticks: { color: '#5c6570', font: { size: 11 } } }
      }
    }
  });
}

// D3: budget aggregates grouped bars
function drawBudget() {
  var el = document.getElementById('budget-chart');
  if (!el || !window.d3) return;
  var d3 = window.d3;
  var groups = [
    { label: '2025-26', values: [{ key: 'Revenue', v: 108.3 }, { key: 'Expenditure', v: 107.7 }] },
    { label: '2028-29', values: [{ key: 'Expenditure', v: 115.4 }] }
  ];
  var width = el.clientWidth || 480;
  var height = 260;
  var margin = { top: 16, right: 20, bottom: 30, left: 40 };

  var svg = d3.select(el).append('svg')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('width', '100%')
    .attr('height', height);

  var x0 = d3.scaleBand().domain(groups.map(function (g) { return g.label; })).range([margin.left, width - margin.right]).paddingOuter(0.3).paddingInner(0.4);
  var x1 = d3.scaleBand().domain(['Revenue', 'Expenditure']).range([0, x0.bandwidth()]).padding(0.15);
  var y = d3.scaleLinear().domain([0, 130]).range([height - margin.bottom, margin.top]);
  var color = { Revenue: '#0060a8', Expenditure: '#6b3fa0' };

  svg.append('g')
    .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
    .call(d3.axisBottom(x0))
    .call(function (g) { g.selectAll('text').attr('font-size', 11).attr('fill', '#5c6570'); })
    .call(function (g) { g.selectAll('line,path').attr('stroke', '#dfe3e8'); });

  svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',0)')
    .call(d3.axisLeft(y).ticks(5).tickFormat(function (d) { return '$' + d + 'bn'; }))
    .call(function (g) { g.selectAll('text').attr('font-size', 11).attr('fill', '#5c6570'); })
    .call(function (g) { g.selectAll('line,path').attr('stroke', '#dfe3e8'); });

  var group = svg.selectAll('.grp')
    .data(groups)
    .join('g')
    .attr('transform', function (d) { return 'translate(' + x0(d.label) + ',0)'; });

  group.selectAll('rect')
    .data(function (d) { return d.values; })
    .join('rect')
    .attr('x', function (d) { return x1(d.key); })
    .attr('width', x1.bandwidth())
    .attr('y', function (d) { return y(d.v); })
    .attr('height', function (d) { return y(0) - y(d.v); })
    .attr('rx', 5)
    .attr('fill', function (d) { return color[d.key]; });

  group.selectAll('.val')
    .data(function (d) { return d.values; })
    .join('text')
    .attr('class', 'val')
    .attr('x', function (d) { return x1(d.key) + x1.bandwidth() / 2; })
    .attr('y', function (d) { return y(d.v) - 8; })
    .attr('text-anchor', 'middle')
    .attr('font-size', 11)
    .attr('font-weight', 600)
    .attr('fill', '#1a1f29')
    .text(function (d) { return '$' + d.v + 'bn'; });

  svg.append('g')
    .attr('transform', 'translate(' + (width - margin.right - 150) + ',' + margin.top + ')')
    .call(function (g) {
      Object.keys(color).forEach(function (key, i) {
        var row = g.append('g').attr('transform', 'translate(' + (i * 78) + ',0)');
        row.append('rect').attr('width', 10).attr('height', 10).attr('rx', 2).attr('fill', color[key]);
        row.append('text').attr('x', 15).attr('y', 9).attr('font-size', 11).attr('fill', '#5c6570').text(key);
      });
    });
}

// Chart.js: net debt to GSP line chart
function drawDebt() {
  var canvas = document.getElementById('debt-chart');
  if (!canvas || !window.Chart) return;
  new window.Chart(canvas, {
    type: 'line',
    data: {
      labels: ['Jun 2027', 'Jun 2028', 'Jun 2029'],
      datasets: [{
        label: 'Net debt to GSP (%)',
        data: [25.2, 25.0, 24.9],
        borderColor: '#6b3fa0',
        backgroundColor: 'rgba(107,63,160,0.12)',
        pointBackgroundColor: '#6b3fa0',
        pointRadius: 5,
        borderWidth: 3,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: function (ctx) { return ctx.parsed.y + '%'; } } }
      },
      scales: {
        y: { min: 24, max: 26, grid: { color: '#eef0f2' }, ticks: { callback: function (v) { return v + '%'; }, color: '#5c6570', font: { size: 11 } } },
        x: { grid: { display: false }, ticks: { color: '#5c6570', font: { size: 11 } } }
      }
    }
  });
}
