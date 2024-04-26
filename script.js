const URL = "https://teachablemachine.withgoogle.com/models/JDFhgCXd4/";

let model, imageContainer, diagnosisSection, recommendationsSection, maxPredictions;
let uploadedImage;
let diagnoses = []; 

document.getElementById("upload").addEventListener("change", handleFileSelect);

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    imageContainer = document.getElementById("imageContainer");
    diagnosisSection = document.getElementById("diagnosisSection");
    recommendationsSection = document.querySelector(".recommendations-section");
}

function handleFileSelect(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            uploadedImage = new Image();
            uploadedImage.src = e.target.result;
            uploadedImage.onload = function () {
                displayImage();
                predict();
            };
        };
        reader.readAsDataURL(file);
    }
}

function displayImage() {
    imageContainer.innerHTML = ""; 
    const imgElement = document.createElement("img");
    imgElement.src = uploadedImage.src;
    imgElement.style.maxWidth = "100%";
    imageContainer.appendChild(imgElement);
}

async function predict() {
    diagnoses = []; 

    // Predictions
    const prediction = await model.predict(uploadedImage);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = {
            className: prediction[i].className,
            probability: prediction[i].probability
        };
        diagnoses.push(classPrediction); 
    }

    updateDiagnoses(); 
}

function updateDiagnoses() {
    diagnosisSection.innerHTML = ""; 

    
    diagnoses.sort((a, b) => b.probability - a.probability);

  
    const highestProbabilityDiagnosis = diagnoses[0];
    const labelElement = document.createElement("p");
    labelElement.innerHTML = `The diagnosis for this ECG is ${(highestProbabilityDiagnosis.probability * 100 ).toFixed(2)}% ${highestProbabilityDiagnosis.className}`;
    diagnosisSection.appendChild(labelElement);

    displayRecommendation(highestProbabilityDiagnosis.className); 
}

function displayRecommendation(diagnosis) {
    recommendationsSection.innerHTML = ""; 

   
    const recommendationMapping = {
        "Normal": "This ECG appears to be normal. Good for you. Continue with regular check-ups.",
        "abnormal heartbeat ": "This ECG appears to be abnormal. Consult immediatly with a healthcare professional for further evaluation.",
        "Myocardial Infarction": "This ECG suggests signs of myocardial infarction, you should monitor your cholestrol level, check your blood pressure regularly and take good care of your blood surgar. also you must seek immediate medical attention.",
        " History of MI": "This ECG indicates a history of myocardial infarction. Follow-up with your cardiologist for further management."
    };

   
    const recommendation = recommendationMapping[diagnosis];
    const recommendationElement = document.createElement("p");
    recommendationElement.textContent = recommendation;
    recommendationsSection.appendChild(recommendationElement);
}

function handleUpload() {
    document.getElementById("upload").click();
}

init(); 
