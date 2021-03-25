const socket = io();

const message = document.getElementById('message');

socket.on('test:message', function (response) {
    document.querySelector('#time-update span').innerHTML = `Última actualización: ${response.data.time}`;
    $("#index-rows").empty();
    $("#estimadores1").empty();
    $("#estimadores2").empty();
    for (var [name, value] of Object.entries(response.data.bolsa)) {
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

    for (var [name, value] of Object.entries(response.data.estimadores)) {
        let indicador;
        if(value >= 0) indicador = `<span class="badge bg-success">${value}%</span>`;
        else indicador = `<span class="badge bg-danger">${value}%</span>`;
        $('#estimadores1').append(`
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

    for (var [name, value] of Object.entries(response.data.estimadores2)) {
        let indicador;
        if(value >= 0) indicador = `<span class="badge bg-success">${value}%</span>`;
        else indicador = `<span class="badge bg-danger">${value}%</span>`;
        $('#estimadores2').append(`
            <div class="col-6 col-sm-6 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                <div class="card text-white bg-primary">
                    <div class="card-body">
                    <h5 class="card-title">${name.toUpperCase()}</h5>
                    <p class="card-text">Variación: ${indicador}</p>
                    </div>
                </div>
            </div>
        `);
    }
});

$.ajax({
    type: 'GET',
    url: '/data',
    beforeSend: function () {
    },
    success: function (response) {
        document.querySelector('#time-update span').innerHTML = `Última actualización: ${response.data.time}`;
        for (var [name, value] of Object.entries(response.data.bolsa)) {
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

        for (var [name, value] of Object.entries(response.data.estimadores)) {
            let indicador;
            if(value >= 0) indicador = `<span class="badge bg-success">${value}%</span>`;
            else indicador = `<span class="badge bg-danger">${value}%</span>`;
            $('#estimadores1').append(`
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

        for (var [name, value] of Object.entries(response.data.estimadores2)) {
            let indicador;
            if(value >= 0) indicador = `<span class="badge bg-success">${value}%</span>`;
            else indicador = `<span class="badge bg-danger">${value}%</span>`;
            $('#estimadores2').append(`
                <div class="col-6 col-sm-6 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                    <div class="card text-white bg-primary">
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