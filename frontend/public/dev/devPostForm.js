
selectedTag = null;

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
    const uploadFoodProfileTagPreview  = document.getElementById('uploadFoodProfileTagPreview');
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
                    uploadFoodProfileTagPreview.innerHTML = selectedTag;
                    //summitableCheck(e);

                    setTimeout(function(){
                        foodDataDiv.style.backgroundColor = "rgb(249, 249, 249)";
                        foodDataDiv.style.color = "black";
                    }, 800)
                })
                

                documentFragment.appendChild(foodDataDiv)
            });

            tagContainer.appendChild(documentFragment);
}

async function uploadFoodProfile(){

    const button = document.getElementById('UploadFoodProfileButton');
    const color = button.style.backgroundColor;
    button.innerText = "Uploading...";
    button.style.backgroundColor = 'yellow';
    const response = await fetch(`${apiUrl}/foodTypeExactly?search=${selectedTag}`);
    const foodData = await response.json();
    console.log(foodData);
    if(foodData.length == 1 && selectedImage && selectedTag){
        const formData = new FormData();
        formData.append('tag', selectedTag);
        formData.append('image', selectedImage);
        try{
            await fetch(`${apiUrl}/uploadFoodProfile`, {
                method: 'POST',
                body: formData // Send FormData directly
            });
            console.log('Post Completed');
            button.innerText = "Completed!";
            button.style.backgroundColor = 'green';
        }
        catch(err){
            button.innerText = "Failed!";
            button.style.backgroundColor = 'red';
        }
    }
    else{
        button.style.backgroundColor = 'red';
        if(!selectedImage){
            button.innerText = 'Image Needed';
        }
        else{
            button.innerText = 'Invalid Tag';
        }
    }
    setTimeout(function(){
        button.style.backgroundColor = color;
        button.innerText = 'Upload';
    },1000)

}


var typemode = false;
function typeMode(){
    const tagModeButton = document.getElementById('filterSelectButton');
    if (!typemode){

        typemode = true;
        fetchFoodType();

        tagModeButton.children[0].style.scale = 1.1;
        tagModeButton.style.scale = 0.95;
        tagModeButton.style.opacity = 0.7;
        tagModeButton.style.backgroundColor = 'rgb(255, 116, 36)';
        setTimeout(function(){
            tagModeButton.children[0].style.scale = 1;
            tagModeButton.style.scale = 1;
            tagModeButton.style.opacity = 1;
        },550)
    }
    else{
        typemode = false;
        fetchFoodData("");
        
        tagModeButton.children[0].style.scale = 1.1;
        tagModeButton.style.scale = 0.95;
        tagModeButton.style.opacity = 0.7;
        tagModeButton.style.backgroundColor = 'rgb(152, 152, 152)';
        setTimeout(function(){
            tagModeButton.children[0].style.scale = 1;
            tagModeButton.style.scale = 1;
            tagModeButton.style.opacity = 1;
        },550)
    }
}