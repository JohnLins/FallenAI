var email;
var name;

function inputData() {
    email = document.getElementById("emailText").value;
    document.getElementById("email").innerHTML = email;

    name = document.getElementById("nameText").value;
    document.getElementById("name").innerHTML = name;
  }


function fallen() {
  
  var message = `${encodeURIComponent(name)} has fallen, please call 911. View Camera: http://localhost:8080/camera.html`
  var url = `http://localhost:8080/sendEmail?email=${encodeURIComponent(email)}&msg=${encodeURIComponent(message)}`

  var request = new XMLHttpRequest()
  request.open("GET", url)
  request.onload = () => {
      var response = JSON.parse(request.responseText) 
      document.querySelector("#sentOutput").querySelector("span").innerText = response

  }
  
  request.send()
    
}
