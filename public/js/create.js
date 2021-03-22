const socket = io();

const message = document.getElementById('message');

socket.on('test:message', function (response) {
    $("#index-rows").empty();
    for (var [name, value] of Object.entries(response.data)) {
        let indicador;
        if(value >= 0) indicador = `<span class="badge bg-success">${value}%</span>`;
        else indicador = `<span class="badge bg-danger">${value}%</span>`;
        $('#index-rows').append(`
            <div class="col-6 col-sm-6 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                <div class="card">
                    <div class="card-body">
                    <h5 class="card-title">${name.toUpperCase()}</h5>
                    <p class="card-text">Variación: ${indicador}</p>
                    </div>
                </div>
            </div>
        `);
    }
});

socket.on('estimatorA', function (response) {
    $('#estimatorA').empty();
    if(response.data >= 0) indicador = `<span class="badge bg-success">${response.data}%</span>`;
    else indicador = `<span class="badge bg-danger">${response.data}%</span>`;
    $('#estimatorA').append(`
        <div class="col-12 col-sm-6 col-md-3 col-lg-3 my-1 px-1 px-md-3">
            <div class="card text-white bg-primary">
                <div class="card-body">
                    <h5 class="card-title">Estimador A1</h5>
                    <p class="card-text">Variación: ${indicador}</p>
                </div>
            </div>
        </div>
    `);
});



$(document).ready(function() {
    $.ajax({
        type: 'GET',
        url: '/data',
        beforeSend: function () {
        },
        success: function (response) {
            const data = response.data;
            for (var [name, value] of Object.entries(data)) {
                let indicador;
                if(value >= 0) indicador = `<span class="badge bg-success">${value}%</span>`;
                else indicador = `<span class="badge bg-danger">${value}%</span>`;
                $('#index-rows').append(`
                    <div class="col-6 col-sm-6 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                        <div class="card">
                            <div class="card-body">
                            <h5 class="card-title">${name.toUpperCase()}</h5>
                            <p class="card-text">Variación: ${indicador}</p>
                            </div>
                        </div>
                    </div>
                `);
            }
        },
        complete: function(){
        }
    });

    $.ajax({
        type: 'GET',
        url: '/estimatorA',
        beforeSend: function () {
        },
        success: function (response) {
            let indicador;
            if(response.data >= 0) indicador = `<span class="badge bg-success">${response.data}%</span>`;
            else indicador = `<span class="badge bg-danger">${response.data}%</span>`;
            $('#estimatorA').append(`
                <div class="col-12 col-sm-6 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                    <div class="card text-white bg-primary">
                        <div class="card-body">
                            <h5 class="card-title">Estimador A1</h5>
                            <p class="card-text">Variación: ${indicador}</p>
                        </div>
                    </div>
                </div>  
            `);
        },
        complete: function(){
        }
    });
});