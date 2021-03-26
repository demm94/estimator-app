const socket = io();

const message = document.getElementById('message');

socket.on('test:message', function (response) {
    $("#index-rows").empty(); 
        const time = new Date(response.data.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.querySelector('#time-update span').innerHTML = `Última actualización: ${time}`;
        for (var [name, object] of Object.entries(response.data.bolsa)) {
            let indicador;
            if(object.value >= 0) indicador = `<span class="badge bg-success shadow-lg">${object.value}% <i class="bi bi-caret-up-fill"></i></span>`;
            else indicador = `<span class="badge bg-danger">${object.value}% <i class="bi bi-caret-down-fill"></i></span>`;
            $('#index-rows').append(`
                <div class="col-3 col-sm-6 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                    <div class="card text-center h-100">
                        <div class="card-body py-2 px-0">
                        <h6 class="card-title">${object.name}</h6>
                        ${indicador}
                        </div>
                    </div>
                </div>
            `);
        }

        $("#estimadores1").empty();
        for (var [name, object] of Object.entries(response.data.estimadores)) {
            let indicador;
            if(object.value >= 0) indicador = `<span class="badge bg-success">${object.value}%</span>`;
            else indicador = `<span class="badge bg-danger">${object.value}%</span>`;
            $('#estimadores1').append(`
                <div class="col-6 col-sm-6 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                    <div class="card">
                        <div class="card-body">
                        <h6 class="card-title">${object.name}</h6>
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

const updateData = () => {
    $.ajax({
        type: 'GET',
        url: '/data',
        beforeSend: function () {
        },
        success: function (response) {
            console.log(response);
            $("#index-rows").empty(); 
            const time = new Date(response.data.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            document.querySelector('#time-update span').innerHTML = `Última actualización: ${time}`;
            for (var [name, object] of Object.entries(response.data.bolsa)) {
                let indicador;
                if(object.value >= 0) indicador = `<span class="badge bg-success shadow-lg">${object.value}% <i class="bi bi-caret-up-fill"></i></span>`;
                else indicador = `<span class="badge bg-danger">${object.value}% <i class="bi bi-caret-down-fill"></i></span>`;
                $('#index-rows').append(`
                    <div class="col-3 col-sm-6 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                        <div class="card text-center h-100">
                            <div class="card-body py-2 px-0">
                            <h6 class="card-title">${object.name}</h6>
                            ${indicador}
                            </div>
                        </div>
                    </div>
                `);
            }
    
            $("#estimadores1").empty();
            for (var [name, object] of Object.entries(response.data.estimadores)) {
                let indicador;
                if(object.value >= 0) indicador = `<span class="badge bg-success">${object.value}%</span>`;
                else indicador = `<span class="badge bg-danger">${object.value}%</span>`;
                $('#estimadores1').append(`
                    <div class="col-6 col-sm-6 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                        <div class="card">
                            <div class="card-body">
                            <h6 class="card-title">${object.name}</h6>
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
        },
        complete: function(){
        }
    });
};

updateData();

const btnUpdate = document.getElementById('btn-update');

btnUpdate.addEventListener('click', () => {
    console.log("click");
    updateData();
});