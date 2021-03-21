$(document).ready(function() {
    $.ajax({
        type: 'GET',
        url: '/data',
        beforeSend: function () {
        },
        success: function (response) {
            const data = response.data;
            $('#sp500-spinner').css({display: "none"});
            for (var [name, value] of Object.entries(data)) {
                let indicador;
                if(value >= 0) indicador = `<span class="badge bg-success">${value}%</span>`;
                else indicador = `<span class="badge bg-danger">${value}%</span>`;
                $('#index-rows').append(`
                    <div class="col-6 col-sm-6 col-md-3 col-lg-3 my-1 px-1 px-md-3" id="acwi-index">
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
});