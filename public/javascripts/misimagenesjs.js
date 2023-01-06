$("Select").select2({
  theme: "classic",
});

$("#submitBtn").click(function () {
  let checked = document.querySelectorAll('input[type="checkbox"]:checked');
  let usuarioselect = $("#usuarioselect option:selected").val();
  let ob = [];
  checked.forEach((f) => ob.push({ id: f.id, userid: usuarioselect }));
  if (ob.length > 0) {
    $.ajax({
      type: "POST",
      data: JSON.stringify(ob),
      contentType: "application/json",
      url: "/user/transferir",
      success: function (data) {
        if (data > 0) {
          console.log(data);
          checked.forEach(
            (b) =>
              (document.querySelector(`#div${b.id}`).style.display = "none")
          );
        }
      },
    });
  }
});
