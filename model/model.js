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
    
    const URL = "https://teachablemachine.withgoogle.com/models/yztGideBc/";
    let model, webcam, ctx, labelContainer, maxPredictions;

    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        model = await tmPose.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const size = 200;
        const flip = true; 
        webcam = new tmPose.Webcam(size, size, flip); 
        await webcam.setup(); 
        await webcam.play();
        window.requestAnimationFrame(loop);

     
        const canvas = document.getElementById("canvas");
        canvas.width = size; canvas.height = size;
        ctx = canvas.getContext("2d");
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
         
        }
    }

    async function loop(timestamp) {
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
    }

    async function predict() {
        const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
        const prediction = await model.predict(posenetOutput);

        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;

            if(prediction[1].probability.toFixed(2) == 1.00){
                window.alert("Emergency! " + name + " has fallen!");
                fallen();
              }
        }

        drawPose(pose);
    }

    function drawPose(pose) {
        if (webcam.canvas) {
            ctx.drawImage(webcam.canvas, 0, 0);
            if (pose) {
                const minPartConfidence = 0.5;
                tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
                tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
            }
        }
    }






