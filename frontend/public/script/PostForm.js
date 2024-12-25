const imageInput = document.getElementById('image-input');
const imagePreview = document.getElementById('image-preview');
const imagePreviewFoodpreview = document.getElementById('imagePreviewFoodpreview');
const foodPreview = document.getElementById('FoodPreview');
const foodInputBlocker = document.getElementById('foodInputBlocker');
const uploadStatus = document.getElementById('uploadStatus');
let selectedImage = null; // Variable to store the selected image
let selectedTag = "";

function saveAndPerviewImage(event) {
    const file = event.target.files[0];

    if (file) {
        selectedImage = file; // Store the selected image for later use
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" id="imageformDisplay" alt="Uploaded Image">`;
            imagePreviewFoodpreview.innerHTML =  `<img src="${e.target.result}" class = 'foodDataImage' alt="Uploaded Image">`
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.innerHTML = '';
        selectedImage = null; // Clear the stored image if none is selected
    }
};

async function post(e) {
    e.preventDefault();
    const dataName = document.getElementById('foodDataName').value;
    const dataCal = document.getElementById('foodDataCal').value;
    const dataLoc = document.getElementById('foodDataLoc').value;
    const postButton = document.getElementById('postButton');

    if (dataName !== "" && dataCal !== "" && dataLoc !== "" && selectedImage && selectedTag !== "") {
        // Use FormData to include the image and other data
        const formData = new FormData();
        formData.append('name', dataName);
        formData.append('cal', dataCal);
        formData.append('loc', dataLoc);
        formData.append('tag', selectedTag);
        formData.append('image', selectedImage); // Add the image file

        // Set load animation
        foodPreview.classList.add('pulse-opacity');
        foodInputBlocker.style.display = 'block';
        uploadStatus.innerHTML = "Posting...";
        uploadStatus.style.color = 'rgb(255, 116, 36)';

        try {
            // Post the data to the server
            await fetch(`${apiUrl}/addFoodData`, {
                method: 'POST',
                body: formData // Send FormData directly
            });

            // Remove the load animation
            foodPreview.classList.remove('pulse-opacity');
            foodInputBlocker.style.display = 'none';
            uploadStatus.innerHTML = "Post completed";

            foodPreview.classList.add('flow-out');

            // Clear the input fields and preview
            document.getElementById('foodDataName').value = '';
            document.getElementById('foodDataCal').value = '';
            document.getElementById('foodDataLoc').value = '';
            selectedTag = '';
            imagePreview.innerHTML = '';
            imagePreviewFoodpreview.innerHTML = '';
            postButton.style.backgroundColor = 'rgb(152, 152, 152)';
            window.scrollTo({top: 0,});
            selectedImage = null;
            summitableCheck(e);
            fetchFoodType();

            setTimeout(function(){
                foodPreview.classList.remove('flow-out');
                foodPreview.classList.add('flow-in');
            },500)
            setTimeout(function(){
                foodPreview.classList.remove('flow-in');
            },1000)

        }
        catch (error) {
            uploadStatus.innerHTML = "Post failed";
            uploadStatus.style.color = 'red';

            // Remove the load animation
            foodPreview.classList.remove('pulse-opacity');
            foodInputBlocker.style.display = 'none';

            // Error animation
            foodPreview.classList.add('vibrate-horizontal');
            setTimeout(function(){
                foodPreview.classList.remove('vibrate-horizontal');
            },500)
        }
   
    } else {
        postButton.style.backgroundColor = 'red';
        postButton.classList.add('vibrate-horizontal');
        uploadStatus.innerHTML = "Please fill the form";
        uploadStatus.style.color = 'red';
        setTimeout(function(){
            postButton.classList.remove('vibrate-horizontal');
            postButton.style.backgroundColor = 'rgb(152, 152, 152)';
            uploadStatus.style.color = 'rgba(77, 77, 77, 0.507)';
        },500)

        // for fucture animation

        //--
    }
}

// add button and search
const addButton = document.getElementById('addButton');
const searchBar = document.getElementById('searchBar');
const TagSearch = document.getElementById('TagSearch');
const foodDataForm = document.getElementById('foodDataForm');

const foodNamePreview = document.getElementById('foodNamePreview');
const foodCalPreview = document.getElementById('FoodCalPreview');
const foodLocPreview = document.getElementById('FoodLocPreview');
const foodTagLable = document.getElementById('foodTagPreview');

function summitableCheck(e){
    e.preventDefault();
    const dataName = document.getElementById('foodDataName').value;
    const dataCal = document.getElementById('foodDataCal').value;
    const dataLoc = document.getElementById('foodDataLoc').value;
    const postButton = document.getElementById('postButton');
    
    //console.log('cc')
    if (dataName != "")
        foodNamePreview.innerHTML = dataName;
    else
        foodNamePreview.innerHTML = "Name";
    if (dataCal != "")
        foodCalPreview.innerHTML = dataCal;
    else
        foodCalPreview.innerHTML = "000";
    if (dataLoc != "")
        foodLocPreview.innerHTML = dataLoc;
    else
        foodLocPreview.innerHTML = "Location";
    if (selectedTag != "")
        foodTagLable.innerHTML = `# ${selectedTag}`;
    else
        foodTagLable.innerHTML = "# Tag";

    if (dataName !== "" && dataCal !== "" && dataLoc !== "" && selectedImage && selectedTag !== ""){
        postButton.style.backgroundColor = 'rgb(255, 116, 36)';
        
        uploadStatus.innerHTML = "Ready to post";
        uploadStatus.style.color = 'rgb(255, 116, 36)';
    }
    else {
        postButton.style.backgroundColor = 'rgb(152, 152, 152)';
        
        uploadStatus.innerHTML = "Please fill the form";
        uploadStatus.style.color = 'rgba(77, 77, 77, 0.507)';
    }
}

var addmode = false;
function addMode() {
    const foodDataForm = document.getElementById('foodDataForm');
    const addButton = document.getElementById('addButton');
    if (!addmode){
        foodDataForm.style.bottom = "70px";
        foodDataForm.style.scale = 1;
        foodDataForm.style.filter = "";
        foodDataForm.style.opacity= 1;
        foodDataForm.style.pointerEvents = "all";

        addmode = true;

        addButton.children[0].style.scale = 1.1;
        addButton.style.scale = 0.95;
        addButton.style.opacity = 0.7;
        setTimeout(function(){
            addButton.children[0].style.scale = 1;
            addButton.style.scale = 1;
            addButton.style.opacity = 1;
        },550)
    }
    else{
        foodDataForm.style.bottom = "-600px";
        foodDataForm.style.scale = 0.8;
        foodDataForm.style.filter = "blur(60px)";
        foodDataForm.style.opacity= 0;
        foodDataForm.style.pointerEvents = "none";
        
        addmode = false;

        addButton.children[0].style.scale = 1.1;
        addButton.style.scale = 0.95;
        addButton.style.opacity = 0.7;
        setTimeout(function(){
            addButton.children[0].style.scale = 1;
            addButton.style.scale = 1;
            addButton.style.opacity = 1;
        },550)
    }
}

searchBar.addEventListener('input', function(){
    fetchFoodType();
})

// tag form
TagSearch.addEventListener('input', function(){
    fetchFoodTag();
})

 async function fetchFoodTag() {
    const search = document.getElementById('TagSearch').value;
    const response = await fetch(`${apiUrl}/foodType?search=${search}`);
    console.log(response)
    const foodData = await response.json();
    const nameText = currentUser
 
    displayFoodTags(foodData, nameText);
    //window.scroll(0, document.body.scrollHeight);
    //console.log(messages);
 }

 function displayFoodTags(foodData, nameText) {
    const tagContainer = document.getElementById('tagContainer');
    tagContainer.innerHTML = ''; // Clear previous messages
    const documentFragment = document.createDocumentFragment();
            foodData.forEach(msg => {
                const foodDataDiv = document.createElement('div');
                foodDataDiv.className = 'foodTags';
                foodDataDiv.id = msg.imagePath;
                foodDataDiv.dataset.select = '0';
                //console.log(msg.name)
                foodDataDiv.innerHTML = `${msg.name}`;

                foodDataDiv.addEventListener('click', function (e){
                    foodDataDiv.style.backgroundColor = "rgb(255, 116, 36)";
                    foodDataDiv.style.color = "white";
                    selectedTag = foodDataDiv.innerHTML;
                    summitableCheck(e);

                    setTimeout(function(){
                        foodDataDiv.style.backgroundColor = "rgb(249, 249, 249)";
                        foodDataDiv.style.color = "black";
                    }, 800)
                })
                

                documentFragment.appendChild(foodDataDiv)
            });

            tagContainer.appendChild(documentFragment);
}