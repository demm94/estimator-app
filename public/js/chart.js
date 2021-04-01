
var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ['D'],
        datasets: [{
            label: 'aefp A',
            borderColor: 'rgb(255, 102, 0)',
            data: [1]
        },{
            label: 'EstActiva A',
            borderColor: 'rgb(147, 112, 216)',
            data: [3]
        }]
    },

    // Configuration options go here
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    callback: function(value, index, values) {
                        return `${value}%`;
                    }
                }
            }],
            xAxes: [{
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                        return `${value}`;
                    }
                }
            }]
        }
    }
});

socket.on('data:chart', function (response) {
    //console.log(response.data.map((item) => item.aefpa));
    chart.data.labels = response.data.map((item) => new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    chart.data.datasets[0].data = response.data.map((item) => item.aefpa);
    chart.data.datasets[1].data = response.data.map((item) => item.estacta);
    chart.update();
});

const updateDataChart = () => {
    $.ajax({
        type: 'GET',
        url: '/fondos',
        beforeSend: function () {
        },
        success: function (response) {
            chart.data.labels = response.data.map((item) => new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            chart.data.datasets[0].data = response.data.map((item) => item.aefpa);
            chart.data.datasets[1].data = response.data.map((item) => item.estacta);
            chart.update();
        },
        complete: function(){
        }
    });
};

updateDataChart();
