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
    url: "/muro/like",
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