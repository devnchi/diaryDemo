// I worked on this project with Ryan F.T.

let search = document.getElementById("sendSearch");
let trash = document.getElementsByClassName("fa fa-trash");
let update = document.getElementsByClassName("update");
let updateTwo = document.getElementsByClassName("updateTwo");


      search.addEventListener('click', function(){
        let date = document.getElementById("dateSelector").value;
        // const name = this.parentNode.parentNode.childNodes[1].innerText
        // const msg = this.parentNode.parentNode.childNodes[3].innerText
        // const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch(`date/${date}`, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Accept':'application/json; odata=verbose'
          }
        })
        .then(response => {
          // console.log(response);
          return response
          // if (response.ok) return response.json()
        })
        .then((data) => {
          // console.log(data)
          window.location.replace(data.url)
        })
      });
// });
//
Array.from(update).forEach(function(element) {
  let entryId = element.dataset.id;
      element.addEventListener('click', function(){
        const date = document.querySelector(`form[data-id="${entryId}"] input[name="updateDate"]`).value;
        const ent = document.querySelector(`form[data-id="${entryId}"] textarea[name="updateEnt"]`).value;
        const id = document.querySelector(`form[data-id="${entryId}"] input[name="entId"]`).value;
        // const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        console.log(date, ent, id)
        fetch('messagesDown', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'updateDate': date,
            'updateEnt': ent,
            'entId': id
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});


Array.from(updateTwo).forEach(function(element) {
  let entryId = element.dataset.id;
      element.addEventListener('click', function(){
        let form = document.querySelector(`form[data-id="${entryId}"]`)
        form.classList.remove("hide");
        form.classList.add("show");
        element.classList.add("hide");

      });
});

console.log(trash.length);

Array.from(trash).forEach(function(element) {
  var entryId = element.dataset.id;
      element.addEventListener('click', function(){
        console.log(document.querySelector(`form[data-id = "${entryId}"]`));
        console.log(`form [data-id = "${entryId}"]`);
        const date = document.querySelector(`form[data-id="${entryId}"] input[name="updateDate"]`).value;
        const ent = document.querySelector(`form[data-id="${entryId}"] textarea[name="updateEnt"]`).value;
        const id = document.querySelector(`form[data-id="${entryId}"] input[name="entId"]`).value;

        console.log(date, ent, id)
        fetch('messages', {
          method: 'delete',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'updateDate': date,
            'updateEnt': ent,
            'entId': id
          })
        })
        .then(response => {
          if (response.ok) return
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});
