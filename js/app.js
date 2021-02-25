var btnmenu = document.getElementById('btn-menu');
var nav = document.getElementById('nav');

$(document).ready(function () {
    if (btnmenu && nav) {
        btnmenu.addEventListener('click', function (e) {
            e.preventDefault();
            nav.classList.toggle('show');
        })
    }
    $("#form-dashboard").hide()
    $("#form-edit").hide()
    $("#form-category").hide()

    productosBanner();
    cargarProductos();
    cargarCategorias();
    productSelect();

    $("input").keydown(function (e) {
        // Capturamos qué telca ha sido
        var keyCode = e.which;
        // Si la tecla es el Intro/Enter
        if (keyCode == 13) {
            // Evitamos que se ejecute eventos
            event.preventDefault();
            // Devolvemos falso
            return false;
        }
    });

    $("#btnLogin").click(function () {
        var data = $('#form-login').serialize()
        $.ajax({
            url: 'http://localhost:3000/admin',
            method: 'post',
            datatype: 'json',
            data: data,
            success: function (response) {
                console.log(response);
                if (response.code === 201) {
                    window.location.href = '/admin/dashboard.html'
                } else {
                    alert(response.message)
                }
            }
        })
    });

    $("#btnSalir").click(function () {
        window.location.href = '/index.html'
    });

    function cargarDatos(id) {
        $.ajax({
            url: 'http://localhost:3000/products',
            method: 'get',
            datatype: 'json',
            success: function (response) {
                let idImage
                for (let i = 0; i < response.data.length; i++) {
                    const categoria = response.data[i];
                    $.each(categoria.listProducts, function (key, value) {
                        if (value._id == id) {
                            for (let x = 0; x < value.images.length; x++) {
                                const image = value.images[x];
                                imageId = image._id;
                            }
                            console.log(categoria._id + "-" + value._id);
                            $("#category-id").val(categoria._id)
                            $("#product-id").val(value._id)
                            $("#edit-name").val(value.name)
                            $("#edit-description").val(value.description)
                            $("#image-id").val(imageId)
                        }
                    })
                }
            }
        })
    }
    function productSelect() {
        $.ajax({
            url: 'http://localhost:3000/products',
            method: 'get',
            datatype: 'json',
            success: function (response) {
                for (let i = 0; i < response.data.length; i++) {
                    const data = response.data[i];
                    $.each(data.listProducts, function (index, value) {
                        $("#product").append(`<option value='${value._id}'>${value.name}</option>`)
                    })
                }
            }
        })
    }

    function cargarCategorias() {
        $.ajax({
            url: 'http://localhost:3000/products',
            method: 'get',
            datatype: 'json',
            success: function (response) {
                for (let i = 0; i < response.data.length; i++) {
                    const categoria = response.data[i];
                    $("#id-category").append(`<option value='${categoria._id}'>${categoria.category}</option>`)
                }
            }
        })
    }

    function cargarProductos() {
        $("#tbody-dashboard").empty()
        $.ajax({
            url: 'http://localhost:3000/products',
            method: 'get',
            datatype: 'json',
            success: function (response) {
                let cont = 1
                for (let i = 0; i < response.data.length; i++) {
                    const pro = response.data[i];
                    $.each(pro.listProducts, function (index, value) {
                        $("#tbody-dashboard").append(`
                                                        <tr>
                                                            <td>${cont}</td>
                                                            <td>${value.name}</td>
                                                            <td>${value.description}</td>
                                                            <td>${pro.category}</td>
                                                            <td>${formatFecha(value.created)}</td>
                                                            <td>
                                                                <a id='btnEditar' href="#" data-product='${value._id}'><i class="fa fa-pen-square" aria-hidden="true"></i>Edit</a>
                                                                <a id='btnBorrar' href="#" data-category='${pro._id}' data-product='${value._id}'><i class="fa fa-trash-alt" aria-hidden="true"></i>Delete</a>
                                                            </td>
                                                        </tr>
                                                    `)
                        cont++;
                    });
                }
            }
        })
    }

    $(document).on("click", "#btnBorrar", function (e) {
        e.preventDefault();
        let product = $(this).data('product')
        let category = $(this).data('category')
        $.ajax({
            url: 'http://localhost:3000/product',
            method: 'delete',
            data: { idCategory: category, idProduct: product },
            success: function (response) {
                console.log(response);
                cargarProductos()
            }
        })
    })

    $("#form-edit").on("submit", function (e) {
        e.preventDefault();
        var data = new FormData(document.getElementById("form-edit"));
        data.append("dato", "valor");
        $.ajax({
            url: 'http://localhost:3000/product',
            method: 'post',
            datatype: 'json',
            data: data,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log(response);
            }
        })
        $("#form-dashboard")[0].reset();

        return false
    })

    $(document).on("click", "#btnEditar", function (e) {
        e.preventDefault();
        $("#table").hide()
        $("#form-dashboard").hide()
        $("#form-edit").show()
        let product = $(this).data('product')
        cargarDatos(product);

    })
    $("#home").click(function () {
        cargarProductos
        $("#table").show();
        $("#form-dashboard").hide()
        $("#form-edit").hide()
        $("#form-category").hide()
    })
    $("#register-product").click(function () {
        $("#table").hide();
        $("#form-edit").hide()
        $("#form-category").hide()
        $("#form-dashboard").show();
    })
    $("#register-category").click(function () {
        $("#table").hide();
        $("#form-edit").hide();
        $("#form-dashboard").hide();
        $("#form-category").show();
    })

    $("#btnSaveCategory").click(function () {
        var data = $('#form-category').serialize()
        $.ajax({
            url: 'http://localhost:3000/category',
            method: 'post',
            datatype: 'json',
            data: data,
            success: function (response) {
                console.log(response);
                cargarCategorias();
            }
        })
        $("#form-category")[0].reset();
    })

    $('#form-dashboard').on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(document.getElementById("form-dashboard"));
        formData.append("dato", "valor");
        $.ajax({
            url: 'http://localhost:3000/new-product',
            method: 'post',
            datatype: 'json',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.code === 200) {
                    $("#mensaje-saved").html('<div class="alert alert-success">"' + response.message + '"</div>')
                    $("#mensaje-saved").show(1000);
                    $("#mensaje-saved").hide(1000);
                    cargarProductos();
                } else {
                    $("#mensaje-saved").html('<div class="alert alert-success">"' + response.status + '"</div>');
                    $("#mensaje-saved").show(1000);
                    $("#mensaje-saved").hide(1000);
                }
            }
        })
        $("#form-dashboard")[0].reset();

        return false
    })
    function productosBanner() {
        $.ajax({
            url: 'http://localhost:3000/products',
            method: 'get',
            datatype: 'json',
            success: function (response) {

                for (let i = 0; i < response.data.length; i++) {
                    const data = response.data[i];
                    for (let x = 0; x < data.listProducts.length; x++) {
                        const products = data.listProducts[x];
                        for (let y = 0; y < products.images.length; y++) {
                            const images = products.images[y];
                            $("#info-banner").append(`
                                                        <article class="info__columna">
                                                            <img class="info__img" src="http://localhost:3000${images.path}" height="400px" width="400px" alt="Imagen genovessa">
                                                            <a href="#" id="product-detail" data-idpro="${data._id}" data-name="${products.name}"><h2 class="info__title">${products.name}</h2></a>
                                                            <h3 class="info__title">${data.category}</h3>
                                                        </article>
                                                    `)
                        }
                    }
                }
            }
        })
    }
    $(document).on("click", "#product-detail", function (e) {
        e.preventDefault();
        let idproduct = $(this).data("idpro")
        let nameproduct = $(this).data("name")
        console.log(idproduct);
        $.ajax({
            url: `http://localhost:3000/product/${idproduct}/${nameproduct}`,
            method: 'get',
            datatype: 'json',
            success: function (response) {
                for (let i = 0; i < response.data.length; i++) {
                    const data = response.data[i];
                    for (let x = 0; x < data.listProducts.length; x++) {
                        const product = data.listProducts[x];
                        $.each(product.images, function (index, value) {
                            $("#product-detail").append(`
                                                            <article class="info__columna">
                                                                <img class="info__img" src="http://localhost:3000${value.path}" height="200px" width="200px" alt="Imagen genovessa">
                                                                <p class="info__text">${product.description}</p>
                                                            </article>
                                                        `)
                        })
                    }
                }
            }
        })
    })
    $("#btnContactUs").click(function () {
        var data = $('#contact').serialize()
        $.ajax({
            url: 'http://localhost:3000/contact-us',
            method: 'post',
            datatype: 'json',
            data: data,
            success: function (response) {
                console.log(response);
            }
        })
        $("#contact")[0].reset();
    })

});

function formatFecha(fecha) {

    var date = new Date(fecha)

    var months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    var dia = date.getDay()
    var mes = months[date.getMonth()]
    var anio = date.getFullYear()

    return anio + " " + mes + " " + dia
}