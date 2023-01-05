$("Select").select2({
  theme: "classic",
});

$("#submitBtn").click(function () {
  let checked = document.querySelectorAll('input[type="checkbox"]:checked');
  var usuarioselect = $("#usuarioselect option:selected").val();
  let ob = [];
  checked.forEach((f) => ob.push({ id: f.id, userid: usuarioselect }));
  console.log(ob);
  $.ajax({
    type: "POST",
    data: JSON.stringify(ob),
    contentType: "application/json",
    url: "/user/transferir",
    success: function (data) {
      console.log(data);
    },
  });
});
