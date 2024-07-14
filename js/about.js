/////////// Start App //////////////
window.onload = function() {
    $('.loading-screen').fadeOut(500);
    getHomeData();
}








/////////// open sidenav ////////////////
$('.open-close-btn').click(function(){
let widths = $('.nav-tab').outerWidth();
let offset = $('.side-nav-menu').offset().left;
    if(offset === 0){
        $('.side-nav-menu').css({left:`-${widths}px` , transition: 'all 1s'});
        $(".open-close-icon").removeClass("fa-x");
        $(".open-close-icon").addClass("fa-align-justify");
        $('.list-unstyled li').animate({top:300 },500)
    }else {
        $('.side-nav-menu').css({left:0 , transition: 'all 1s'});
        $(".open-close-icon").removeClass("fa-align-justify");
        $(".open-close-icon").addClass("fa-x");
        $('.list-unstyled li').animate({top:0 },1000);
    }
})

/////////// close sidenav ///////////////
function closeSideNav(){
    let widthss = $('.nav-tab').outerWidth();
        $('.side-nav-menu').css({left:-widthss},2000);
        $(".open-close-icon").removeClass("fa-x");
        $(".open-close-icon").addClass("fa-align-justify");
        $('.list-unstyled li').animate({top:300 },500);
}

$('.list-unstyled li').click(function(){
    closeSideNav()
})













//////////// get home data from Api /////////////
async function getHomeData(){
    $('.loading-screen').removeClass('d-none');
    $('.side-nav-menu').addClass('d-none');
    $('.nav-header').animate({left:'80px'},300);
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
    let response = await result.json();
    $('.loading-screen').addClass('d-none');
    $('.side-nav-menu').removeClass('d-none');
    $('.nav-header').animate({left:'0px'},300);
    displayHomeData(response.meals);
}

//////////////// display home data //////////////
async function displayHomeData(data){
    let box=``;
    for(i=0 ; i< data.length ; i++){
        box += `
        <div class="col-md-3 hidenDiv">
                <div onclick="getMealDetails('${data[i].idMeal}')" class="meal overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${data[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2 ">
                        <h3>${data[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }
    document.getElementById("rowData").innerHTML+=box;
}



//////// get details of one meal from Api ///////
async function getMealDetails(id){
    $('.loading-screen').removeClass('d-none');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let response = await result.json();
    $('.loading-screen').addClass('d-none');
    displayMealDetails(response.meals[0]);
}

//////// display details of one meal////////////
async function displayMealDetails(meal){
    closeSideNav()
    // loop and add on li ingredient list 
    let ingredients = ``;
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }


    // if the tag loop not found result 
    let tags = meal.strTags?.split(",");
    if (!tags) tags = [];


    // loop and add on li tags list
    let tagsStr = '' ;
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    } ;


    $('.hidenDiv').addClass('d-none');
    box = `
        <div class="col-md-4 hidenDiv">
            <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="meal-photo"/>
            <h2>${meal.strMeal}</h2>
        </div>
        <div class="col-md-8 hidenDiv">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h3>Area: <span class="fw-bolder">${meal.strArea}</span></h3>
            <h3>Category: <span class="fw-bolder">${meal.strCategory}</span></h3>
            <h3>Recipes: </h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">${ingredients}</ul>
            <h3>Tags: </h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">${tagsStr}</ul>
            <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
        </div>`
    document.getElementById("rowData").innerHTML+=box;
}

















//////// display search page ////////////////
async function disSearchPage(){
    $('.hidenDiv').addClass('d-none');
    let box=``;
        box += `
        <div class="hidenDiv row py-4">
            <div class="col-md-6" >
                <input id="inputone" onchange="dis()" onKeyup="searchByName(this.value)"  class="form-control form-controlOne bg-transparent text-white" type="text" placeholder="Search By Name">
            </div>
            <div class="col-md-6" >
                <input id="inputtwo" onKeyup="searchByFLetter(this.value)"  maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
            </div>
        </div>
        `
    document.getElementById("searchContainer").innerHTML+=box;
}


//////// get search of name from Api ////////
async function searchByName(term) {
    $('.loading-screen').removeClass('d-none');
    document.getElementById("rowData").innerHTML = "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    response = await response.json();
    displayHomeData(response.meals);
    $('.loading-screen').addClass('d-none');
}


//////// get search of latter from Api ///////
async function searchByFLetter(term) {
    $('.loading-screen').removeClass('d-none');
    document.getElementById("rowData").innerHTML = "";
    term == "" ? term = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
    response = await response.json();
    displayHomeData(response.meals);
    $('.loading-screen').addClass('d-none');
}

















//////// get Categories data from Api /////////
async function getCategoryMeals(){
    $('.loading-screen').removeClass('d-none');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let response = await result.json();
    $('.loading-screen').addClass('d-none');
    displayCategoryMeals(response.categories);
}

//////// display Categories data from Api /////
async function displayCategoryMeals(categories){
    $('.hidenDiv').addClass('d-none');
    let box=``;
    for(i=0 ; i< categories.length ; i++){
        box += `
        <div class="hidenDiv col-md-3 position-relative ">
            <div onclick="getCategoryOneMeal('${categories[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer" >
                <img class=" w-100" src="${categories[i].strCategoryThumb}" alt="" srcset="">
                <div class="meal-layer position-absolute text-center text-black p-2" >
                    <h3>${categories[i].strCategory}</h3>
                    <p>${categories[i].strCategoryDescription}</p>
                </div>
            </div>
        </div>
        `
    }
    document.getElementById("rowData").innerHTML+=box;
}



//////// get one Category meal from Api //////
async function getCategoryOneMeal(Category){
    $('.loading-screen').removeClass('d-none');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${Category}`);
    let response = await result.json();
    $('.loading-screen').addClass('d-none');
    displayCategoryOneMeal(response.meals);
}

//////// display categroies of meals ////////
async function displayCategoryOneMeal(data){
    $('.hidenDiv').addClass('d-none');
    let box=``;
    for(i=0 ; i< data.length ; i++){
        box += `
        <div class="col-md-3 hidenDiv">
                <div onclick="getMealDetails('${data[i].idMeal}')" class="meal overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${data[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2 ">
                        <h3>${data[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }
    document.getElementById("rowData").innerHTML+=box;
}












//////// get Areas data from Api //////////
async function getArea(){
    $('.loading-screen').removeClass('d-none');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let response = await result.json();
    $('.loading-screen').addClass('d-none');
    displayAreas(response.meals);
}

//////// display Areas data ///////////////
async function displayAreas(data){
    $('.hidenDiv').addClass('d-none');
    let box=``;
    for(i=0 ; i< data.length ; i++){
        box += `
        <div class="col-md-3 hidenDiv">
            <div onclick="getAreaOneMeal('${data[i].strArea}')" class="rounded-2 text-center cursor-pointer" >
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${data[i].strArea}</h3>
            </div>
        </div>
        `
    }
    document.getElementById("rowData").innerHTML+=box;
}




//////// get one Area meals from Api ///////
async function getAreaOneMeal(Area){
    $('.loading-screen').removeClass('d-none');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${Area}`);
    let response = await result.json();
    $('.loading-screen').addClass('d-none');
    displayAreaOneMeal(response.meals)
}

//////// display meals of Area ////////////
async function displayAreaOneMeal(data){
    $('.hidenDiv').addClass('d-none');
    let box=``;
    for(i=0 ; i< data.length ; i++){
        box += `
        <div class="col-md-3 hidenDiv">
                <div onclick="getMealDetails('${data[i].idMeal}')" class="meal overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${data[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2 ">
                        <h3>${data[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }
    document.getElementById("rowData").innerHTML+=box;
}








//////// get Ingradiants data from Api ////////
async function getIngradiants(){
    $('.loading-screen').removeClass('d-none');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    let response = await result.json();
    $('.loading-screen').addClass('d-none');
    displayIngradiants(response.meals.slice(0, 20));
}

//////// display Ingradiants data /////////////
async function displayIngradiants(data){
    $('.hidenDiv').addClass('d-none');
    let box=``;
    for(i=0 ; i< data.length ; i++){
        box += `
        <div class="col-md-3 hidenDiv">
            <div onclick="getingrOneMeal('${data[i].strIngredient}')" class="rounded-2 text-center cursor-pointer" >
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${data[i].strIngredient}</h3>
                <p>${data[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
            </div>
        </div>
        `
    }
    document.getElementById("rowData").innerHTML+=box;
}




///////// get one ingradiant from Api //////////
async function getingrOneMeal(Ingradiant){
    $('.loading-screen').removeClass('d-none');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${Ingradiant}`);
    let response = await result.json();
    $('.loading-screen').addClass('d-none');
    displayingrOneMeal(response.meals.slice(0, 20));
}

//////// display meals of one ingradiant ///////
async function displayingrOneMeal(data){
    $('.hidenDiv').addClass('d-none');
    let box=``;
    for(i=0 ; i< data.length ; i++){
        box += `
        <div class="col-md-3 hidenDiv">
                <div onclick="getMealDetails('${data[i].idMeal}')" class="meal overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${data[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2 ">
                        <h3>${data[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }
    document.getElementById("rowData").innerHTML+=box;
}










///////////////////// display contact us page /////////////////////////
async function contactUsPage(){
    $('.hidenDiv').addClass('d-none');
    let box=``;
        box += `
        <div class="hidenDiv contact min-vh-100 d-flex justify-content-center align-items-center">
            <div class="container w-75 text-center" >
                <div class="row g-4" >
                    <div class="col-md-6">
                        <input id="nameInput" onkeyup="inputsValidation()"   type="text" class="selectedInput form-control" placeholder="Enter Your Name" />
                        <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                            "special characters and numbers not allowed"
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="emailInput" onkeyup="inputsValidation()"   type="email" class="selectedInput form-control" placeholder="Enter Your Email" />
                        <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                            "Email not valid *example@yyy.zzz"
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="phoneInput" onkeyup="inputsValidation()"   type="text" class="selectedInput form-control" placeholder="Enter Your Phone" />
                        <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                            "Enter valid phone Number"
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="ageInput" onkeyup="inputsValidation()"   type="number" class="selectedInput form-control" placeholder="Enter Your Age" />
                        <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                            "Enter valid age"
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="passwordInput" onkeyup="inputsValidation()"   type="password" class="selectedInput form-control" placeholder="Enter Your password" />
                        <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            "Enter valid password *Minimum eight characters , at least one letter and one number:* "
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="repasswordInput" onkeyup="inputsValidation()"   type="password" class="selectedInput form-control" placeholder="Repassword" />
                        <div  id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none ">
                            "Enter valid repassword"
                        </div>
                    </div>
                </div> 
                <button disabled class="btn btn-outline-danger px-2 mt-3" id="submitBtn" > Submit</button>
            </div>
        </div>
        `
    document.getElementById("rowData").innerHTML+=box;
    let submitBtn = document.getElementById('submitBtn');

    
    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputTouched = true;
    })

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputTouched = true;
    })

    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputTouched = true;
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputTouched = true;
    })

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputTouched = true;
    })

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInputTouched = true;
    })
    
}









////////////////////////// Regex function ///////////////////////////

function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value));
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value));
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value));
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value));
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value));
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value;
}













//////////////////////// variables /////////////////////////////////
let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;




////////////////////////// validation //////////////////////////////
function inputsValidation() {

let nameInput = document.getElementById('nameInput');
let emailInput = document.getElementById('emailInput');
let phoneInput = document.getElementById('phoneInput');
let ageInput = document.getElementById('ageInput');
let passwordInput = document.getElementById('passwordInput');
let repasswordInput = document.getElementById('repasswordInput');
let nameAlert = document.getElementById('nameAlert');
let emailAlert = document.getElementById('emailAlert');
let phoneAlert = document.getElementById('phoneAlert');
let ageAlert = document.getElementById('ageAlert');
let passwordAlert = document.getElementById('passwordAlert');
let repasswordAlert = document.getElementById('repasswordAlert');

    if (nameInputTouched) {
        if (nameValidation()) {
            nameAlert.classList.replace("d-block", "d-none");
            nameInput.classList.add('is-valid');
            nameInput.classList.remove('is-invalid');
        } else {
            nameAlert.classList.replace("d-none", "d-block");
            nameInput.classList.add('is-invalid');
            nameInput.classList.remove('is-valid');
        }
    }

    if (emailInputTouched) {
        if (emailValidation()) {
            emailAlert.classList.replace("d-block", "d-none");
            emailInput.classList.add('is-valid');
            emailInput.classList.remove('is-invalid');
        } else {
            emailAlert.classList.replace("d-none", "d-block");
            emailInput.classList.add('is-invalid');
            emailInput.classList.remove('is-valid');
        }
    }

    if (phoneInputTouched) {
        if (phoneValidation()) {
            phoneAlert.classList.replace("d-block", "d-none");
            phoneInput.classList.add('is-valid');
            phoneInput.classList.remove('is-invalid');
        } else {
            phoneAlert.classList.replace("d-none", "d-block");
            phoneInput.classList.add('is-invalid');
            phoneInput.classList.remove('is-valid');
        }
    }

    if (ageInputTouched) {
        if (ageValidation()) {
            ageAlert.classList.replace("d-block", "d-none");
            ageInput.classList.add('is-valid');
            ageInput.classList.remove('is-invalid');
        } else {
            ageAlert.classList.replace("d-none", "d-block");
            ageInput.classList.add('is-invalid');
            ageInput.classList.remove('is-valid');
        }
    }

    if (passwordInputTouched) {
        if (passwordValidation()) {
            passwordAlert.classList.replace("d-block", "d-none");
            passwordInput.classList.add('is-valid');
            passwordInput.classList.remove('is-invalid');
        } else {
            passwordAlert.classList.replace("d-none", "d-block");
            passwordInput.classList.add('is-invalid');
            passwordInput.classList.remove('is-valid');
        }
    }

    if (repasswordInputTouched) {
        if (repasswordValidation()) {
            repasswordAlert.classList.replace("d-block", "d-none");
            repasswordInput.classList.add('is-valid');
            repasswordInput.classList.remove('is-invalid');
        } else {
            repasswordAlert.classList.replace("d-none", "d-block");
            repasswordInput.classList.add('is-invalid');
            repasswordInput.classList.remove('is-valid');
        }
    }

    // change button status 
    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled");
    } else {
        submitBtn.setAttribute("disabled", true);
    }
}


