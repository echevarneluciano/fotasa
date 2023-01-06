$("Select").select2({
  theme: "classic",
});

const seleccionArchivos = document.querySelector("#imagen"),
  imagenPrevisualizacion = document.querySelector("#preview"),
  cancelar = document.querySelector("#cancelar");

seleccionArchivos.addEventListener("change", () => {
  const archivos = seleccionArchivos.files;
  if (!archivos || archivos.length == 0) {
    imagenPrevisualizacion.src = "";
    return;
  }
  const primerArchivo = archivos[0];
  const objectURL = URL.createObjectURL(primerArchivo);
  imagenPrevisualizacion.src = objectURL;
});

cancelar.addEventListener("click", () => {
  imagenPrevisualizacion.src = "";
});

const seleccionArchivosP = document.querySelector("#imagenpersonal"),
  imagenPrevisualizacionP = document.querySelector("#previewpersonal"),
  cancelarP = document.querySelector("#cancelarpersonal");

seleccionArchivosP.addEventListener("change", () => {
  const archivos = seleccionArchivosP.files;
  if (!archivos || archivos.length == 0) {
    imagenPrevisualizacionP.src = "";
    return;
  }
  const primerArchivo = archivos[0];
  const objectURL = URL.createObjectURL(primerArchivo);
  imagenPrevisualizacionP.src = objectURL;
});

cancelarP.addEventListener("click", () => {
  imagenPrevisualizacionP.src = "";
});

$(":radio").change(function () {
  let ob = { estrellas: this.value, posteoid: this.id };
  $.ajax({
    url: "/like",
    data: ob,
    method: "post",
    dataType: "json",
    success: function (response) {
      console.log(response);
    },
    error: function (error) {
      console.log(error);
    },
  });
});

$(".comentarioform").submit(function () {
  $.ajax({
    type: "POST",
    data: $(this).serialize(),
    url: "/comment",
    success: function (data) {
      console.log(data);
      let comentarioid = document.querySelector(`#comentarios${data.posteoid}`);
      let p = document.createElement("p");
      let comentariotexto = document.createTextNode(data.descripcion);
      p.appendChild(comentariotexto);
      comentarioid.appendChild(p);
    },
  });
  return false;
});

$("#etiqueta1").keyup(function () {
  if ($("#etiqueta1").val().length > 0) {
    $("#etiqueta2").removeAttr("disabled");
  } else {
    $("#etiqueta2").attr("disabled", "disabled");
    $("#etiqueta3").attr("disabled", "disabled");
  }
});

$("#etiqueta2").keyup(function () {
  if ($("#etiqueta2").val().length > 0) {
    $("#etiqueta3").removeAttr("disabled");
  } else {
    $("#etiqueta3").attr("disabled", "disabled");
    $("#etiqueta1").removeAttr("disabled");
  }
});

$("#etiqueta3").keyup(function () {
  if ($("#etiqueta3").val().length > 0) {
    $("#etiqueta2").attr("disabled", "disabled");
    $("#etiqueta1").attr("disabled", "disabled");
  } else {
    $("#etiqueta2").removeAttr("disabled");
  }
});
