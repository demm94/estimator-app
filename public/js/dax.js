$(document).ready(function() {
    $.ajax({
        type: 'GET',
        url: '/dax',
        beforeSend: function () {
        },
        success: function (response) {
            $('#dax-spinner').css({display: "none"});
            let indicador;
            if(response.dax >= 0) indicador = `<span class="badge bg-success">${response.dax}%</span>`;
            else indicador = `<span class="badge bg-danger">${response.dax}%</span>`;
            $('#dax-index').append(`<div class="card">
            <div class="card-body">
              <h5 class="card-title">DAX</h5>
              <p class="card-text">Variación: ${indicador}</p>
            </div>
          </div>`);
        },
        complete: function(){
        }
    });

    $.ajax({
        type: 'GET',
        url: '/acwi',
        beforeSend: function () {
        },
        success: function (response) {
            $('#acwi-spinner').css({display: "none"});
            let indicador;
            if(response.acwi >= 0) indicador = `<span class="badge bg-success">${response.acwi}%</span>`;
            else indicador = `<span class="badge bg-danger">${response.acwi}%</span>`;
            $('#acwi-index').append(`<div class="card">
            <div class="card-body">
              <h5 class="card-title">ACWI</h5>
              <p class="card-text">Variación: ${indicador}</p>
            </div>
          </div>`);
        },
        complete: function(){
        }
    });

    $.ajax({
        type: 'GET',
        url: '/sp500',
        beforeSend: function () {
        },
        success: function (response) {
            $('#sp500-spinner').css({display: "none"});
            let indicador;
            if(response.sp500 >= 0) indicador = `<span class="badge bg-success">${response.sp500}%</span>`;
            else indicador = `<span class="badge bg-danger">${response.sp500}%</span>`;
            $('#sp500-index').append(`<div class="card">
            <div class="card-body">
              <h5 class="card-title">SP500</h5>
              <p class="card-text">Variación: ${indicador}</p>
            </div>
          </div>`);
        },
        complete: function(){
        }
    });

    function getNasdaq() {
        $.ajax({
            type: 'GET',
            url: '/nasdaq',
            beforeSend: function () {
            },
            success: function (response) {
                $('#nasdaq-spinner').css({display: "none"});
                console.log(response);
                let indicador;
                if(response.nasdaq >= 0) indicador = `<span class="badge bg-success">${response.nasdaq}%</span>`;
                else indicador = `<span class="badge bg-danger">${response.nasdaq}%</span>`;
                $('#nasdaq-index').append(`<div class="card">
                <div class="card-body">
                  <h5 class="card-title">NASDAQ</h5>
                  <p class="card-text">Variación: ${indicador}</p>
                </div>
              </div>`);
            },
            complete: function(){
            }
        });
    }

    getNasdaq();

});