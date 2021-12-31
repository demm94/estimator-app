const socket = io();

const message = document.getElementById('message');

socket.on('test:message', function (response) {
    $("#index-rows").empty(); 
        const time = new Date(response.data.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.querySelector('#time-update span').innerHTML = `Última actualización: ${time}`;
        for (var [name, object] of Object.entries(response.data.bolsa)) {
            let indicador;
            let clock;

            if(object.isClose == true) clock = `<i style="font-size: 0.8rem; color: red;" class="bi bi-clock"></i>`;
            else if(object.isClose == false) clock = `<i style="font-size: 0.8rem; color: green" class="bi bi-clock"></i>`;
            else clock = "";

            if (object.value) {
                if(object.value >= 0) indicador = `<span class="badge bg-success shadow-lg">${object.value.toFixed(2)}% <i class="bi bi-caret-up-fill"></i></span>`;
                else indicador = `<span class="badge bg-danger">${object.value.toFixed(2)}% <i class="bi bi-caret-down-fill"></i></span>`;
            } else {
                if (object.value != null) {
                    indicador = `<span class="badge bg-secondary shadow-lg">${object.value}%</span>`
                } else {
                    indicador = `No Data 😫`
                }
            }

            let link = (object.url) ? `<a href=${object.url} class="stretched-link"></a>`: '';
            $('#index-rows').append(`
                <div class="col-3 col-sm-4 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                    <div id="index-${name}" class="card text-center h-100">
                        <div class="card-body py-2 px-0">
                        <h6 class="card-title">${object.name}</h6>
                        ${indicador}
                        ${clock}
                        ${link}
                        </div>
                    </div>
                </div>
            `);
        }

        $("#estimadores1").empty();
            let promAcfondos = 0;
            for (var [name, object] of Object.entries(response.data.estimadores)) {
                let indicador;
                if(object.value >= 0) indicador = `<span class="badge bg-success">${object.value.toFixed(2)}% <i class="bi bi-caret-up-fill"></i></span>`;
                else indicador = `<span class="badge bg-danger">${object.value.toFixed(2)}% <i class="bi bi-caret-down-fill"></i></span>`;
                if(/acfondos/.test(name)){
                    promAcfondos+=object.value/2;
                }
                $('#estimadores1').append(`
                    <div class="col-4 col-sm-4 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                            <h6 class="card-title">${object.name}</h6>
                            <p class="card-text">${indicador}</p>
                            </div>
                        </div>
                    </div>
                `);
            }

            // ***************** SACAR DESPÚES *******************
            let indicador;
            if(promAcfondos >= 0) indicador = `<span class="badge bg-success">${promAcfondos.toFixed(2)}% <i class="bi bi-caret-up-fill"></i></span>`;
                else indicador = `<span class="badge bg-danger">${promAcfondos.toFixed(2)}% <i class="bi bi-caret-down-fill"></i></span>`;

            $('#estimadores1 > div:nth-child(4)').after(`<div class="col-4 col-sm-4 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                            <h6 class="card-title">Promedio C</h6>
                            <p class="card-text">${indicador}</p>
                            </div>
                        </div>
                    </div>`);

            // ***************************************************

    $("#estimadores2").empty();
    for (var [name, object] of Object.entries(response.data.estimadores2)) {
        let indicador;
        if(object.value >= 0) indicador = `<span class="badge bg-success">${object.value}% <i class="bi bi-caret-up-fill"></i></span>`;
        else indicador = `<span class="badge bg-danger">${object.value}% <i class="bi bi-caret-down-fill"></i></span>`;
        $('#estimadores2').append(`
            <div class="col-6 col-sm-6 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                <div class="card text-center text-white bg-primary">
                    <div class="card-body">
                    <h6 class="card-title">${object.name}</h6>
                    <p class="card-text">${indicador}</p>
                    </div>
                </div>
            </div>
        `);
    }

    getDolarValue();
});

const updateData = () => {
    $.ajax({
        type: 'GET',
        url: '/data',
        beforeSend: function () {
        },
        success: function (response) {
            $("#index-rows").empty(); 
            const time = new Date(response.data.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            document.querySelector('#time-update span').innerHTML = `Última actualización: ${time}`;
            for (var [name, object] of Object.entries(response.data.bolsa)) {
                let indicador;
                let clock;

                if(object.isClose == true) clock = `<i style="font-size: 0.8rem; color: red;" class="bi bi-clock"></i>`;
                else if(object.isClose == false) clock = `<i style="font-size: 0.8rem; color: green" class="bi bi-clock"></i>`;
                else clock = "";
                
                if (object.value) {
                    if(object.value >= 0) indicador = `<span class="badge bg-success shadow-lg">${object.value.toFixed(2)}% <i class="bi bi-caret-up-fill"></i></span>`;
                    else indicador = `<span class="badge bg-danger">${object.value.toFixed(2)}% <i class="bi bi-caret-down-fill"></i></span>`;
                } else {
                    if (object.value != null) {
                        indicador = `<span class="badge bg-secondary shadow-lg">${object.value}%</span>`
                    } else {
                        indicador = `No Data 😫`
                    }
                }

                let link = (object.url) ? `<a href=${object.url} class="stretched-link"></a>`: '';
                $('#index-rows').append(`
                    <div class="col-3 col-sm-4 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                        <div id="index-${name}" class="card text-center h-100">
                            <div class="card-body py-2 px-0">
                            <h6 class="card-title">${object.name}</h6>
                            ${indicador}
                            ${clock}
                            ${link}
                            </div>
                        </div>
                    </div>
                `);
            }
    
            $("#estimadores1").empty();
            let promAcfondos = 0;
            for (var [name, object] of Object.entries(response.data.estimadores)) {
                let indicador;
                if(object.value >= 0) indicador = `<span class="badge bg-success">${object.value.toFixed(2)}% <i class="bi bi-caret-up-fill"></i></span>`;
                else indicador = `<span class="badge bg-danger">${object.value.toFixed(2)}% <i class="bi bi-caret-down-fill"></i></span>`;
                if(/acfondos/.test(name)){
                    promAcfondos+=object.value/2;
                }
                $('#estimadores1').append(`
                    <div class="col-4 col-sm-4 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                            <h6 class="card-title">${object.name}</h6>
                            <p class="card-text">${indicador}</p>
                            </div>
                        </div>
                    </div>
                `);
            }

            // ***************** SACAR DESPÚES *******************

            let indicador;
            if(promAcfondos >= 0) indicador = `<span class="badge bg-success">${promAcfondos.toFixed(2)}% <i class="bi bi-caret-up-fill"></i></span>`;
                else indicador = `<span class="badge bg-danger">${promAcfondos.toFixed(2)}% <i class="bi bi-caret-down-fill"></i></span>`;

            $('#estimadores1 > div:nth-child(4)').after(`<div class="col-4 col-sm-4 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                            <h6 class="card-title">Promedio C</h6>
                            <p class="card-text">${indicador}</p>
                            </div>
                        </div>
                    </div>`);

            // ***************************************************
    
            $("#estimadores2").empty();
            for (var [name, object] of Object.entries(response.data.estimadores2)) {
                let indicador;
                if(object.value >= 0) indicador = `<span class="badge bg-success">${object.value}% <i class="bi bi-caret-up-fill"></i></span>`;
                else indicador = `<span class="badge bg-danger">${object.value}% <i class="bi bi-caret-down-fill"></i></span>`;
                $('#estimadores2').append(`
                    <div class="col-6 col-sm-6 col-md-3 col-lg-3 my-1 px-1 px-md-3">
                        <div class="card text-center text-white bg-primary">
                            <div class="card-body">
                            <h6 class="card-title">${object.name}</h6>
                            <p class="card-text">${indicador}</p>
                            </div>
                        </div>
                    </div>
                `);
            }
        },
        complete: function(){
            getDolarValue();
        }
    });
};

const getDolarValue = () => {
    $.ajax({
        type: 'GET',
        url: 'https://apps.bolchile.com/api/v1/dolarstatd2/#',
        beforeSend: function () {
        },
        success: function (response) {
            const data = response[0];
            let card = document.querySelector('#index-usdClp > .card-body h6');
            card.innerHTML = `USD/CLP <span class="badge rounded-pill bg-primary"> $${data.cp}</span>`;         
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
    getDolarValue();
    updateDataChart();
});


