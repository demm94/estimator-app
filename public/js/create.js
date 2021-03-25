const socket = io();

const message = document.getElementById('message');

socket.on('test:message', function (response) {
    const time = new Date(response.data.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.querySelector('#time-update span').innerHTML = `Última actualización: ${time}`;
    $("#index-rows").empty(); 
    for (var [name, value] of Object.entries(response.data.bolsa)) {
        let indicador;
        if(value >= 0) indicador = `<span class="badge bg-success">${value}%</span>`;
        else indicador = `<span class="badge bg-danger">${value}%</span>`;
        $('#index-rows').append(`
            <div class="col-6 col-sm-6 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                <div class="card">
                    <div class="card-body">
                    <h6 class="card-title">${name.toUpperCase()}</h6>
                    <p class="card-text">Variación: ${indicador}</p>
                    </div>
                </div>
            </div>
        `);
    }

    $("#estimadores1").empty();
    for (var [name, value] of Object.entries(response.data.estimadores)) {
        let indicador;
        if(value >= 0) indicador = `<span class="badge bg-success">${value}%</span>`;
        else indicador = `<span class="badge bg-danger">${value}%</span>`;
        $('#estimadores1').append(`
            <div class="col-6 col-sm-6 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                <div class="card">
                    <div class="card-body">
                    <h6 class="card-title">${name.toUpperCase()}</h6>
                    <p class="card-text">Variación: ${indicador}</p>
                    </div>
                </div>
            </div>
        `);
    }

    $("#estimadores2").empty();
    for (var [name, value] of Object.entries(response.data.estimadores2)) {
        let indicador;
        if(value >= 0) indicador = `<span class="badge bg-success">${value}%</span>`;
        else indicador = `<span class="badge bg-danger">${value}%</span>`;
        $('#estimadores2').append(`
            <div class="col-6 col-sm-6 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                <div class="card text-white bg-primary">
                    <div class="card-body">
                    <h6 class="card-title">${name.toUpperCase()}</h6>
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
        const time = new Date(response.data.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.querySelector('#time-update span').innerHTML = `Última actualización: ${time}`;
        for (var [name, value] of Object.entries(response.data.bolsa)) {
            let indicador;
            if(value >= 0) indicador = `<span class="badge bg-success">${value}%</span>`;
            else indicador = `<span class="badge bg-danger">${value}%</span>`;
            $('#index-rows').append(`
                <div class="col-6 col-sm-6 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                    <div class="card">
                        <div class="card-body">
                        <h6 class="card-title">${name.toUpperCase()}</h6>
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
                        <h6 class="card-title">${name.toUpperCase()}</h6>
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
                        <h6 class="card-title">${name.toUpperCase()}</h6>
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