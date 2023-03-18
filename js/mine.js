// =================================Clicks====================================
(function myClicks(){
    $(document).ready(() => {
        searchName("").then(() => {
            $(".loading-screen").fadeOut(500)
            $("body").css("overflow", "visible")
        })})

        $(".links #categories").click(function(){
            ApiCat()
            closeSideNav()
            $("#searchContainer").html(``)})
    $(".links #area").click(function(){
            ApiArea()
            closeSideNav()
            $("#searchContainer").html(``)})
    $(".links #ingredients").click(function(){
            ApiIngredient()
            closeSideNav()
            $("#searchContainer").html(``)})
    $(".side-nav-menu i.open-close-icon").click(() => {
                if ($(".side-nav-menu").css("left") == "0px") {
                    closeSideNav()
                } else {
                    openSideNav()}})
    $("#contactUs").click(function(){
            showContacts()
            closeSideNav()
    $("#searchContainer").html(``)})
    $("#search").click(function(){
            showSearch()
            closeSideNav()
    $("#rowData").html(``)})})();
// =================================Cat api====================================
async function ApiCat(){
    let response = await fetch (`https://www.themealdb.com/api/json/v1/1/categories.php`)
    response = await response.json()
    let CatData = response.categories
    showCat(CatData)
}
function showCat(myCat){
    let myList = "";

    for (let i = 0 ; i < myCat.length ; i++){
        myList += `
        <div class="col-md-3">
        <div onclick="catMeals('${myCat[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img class="w-100" src="${myCat[i].strCategoryThumb}" alt="" srcset="">
            <div class="meal-layer position-absolute text-center text-black p-2">
                <h3>${myCat[i].strCategory}</h3>
                <p>${myCat[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
            </div>
        </div>
    </div>
        `
    }
    $("#rowData").html(myList)
}
// =================================area api====================================
async function ApiArea(){
    let response = await fetch (`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    response = await response.json()
    let areaData = response.meals
    showArea(areaData)
}
function showArea(myArea){
    let myList = "";
    for (let i = 0 ; i < myArea.length ; i++){
        myList += `
        <div class="col-md-3">
        <div onclick="areaMeals('${myArea[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${myArea[i].strArea}</h3>
        </div></div>
        `
    }
    $("#rowData").html(myList)
}
// =================================Ingr api====================================
async function ApiIngredient(){
    let response = await fetch (`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    response = await response.json()
    let ingrData = response.meals


    showIngredient(ingrData.slice(0,20))
}
function showIngredient(myIngredient){
    let myList = "";
    
    for (let i = 0 ; i < myIngredient.length ;i++){
        myList += `
        <div class="col-md-3">
        <div onclick="ingrMeals('${myIngredient[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${myIngredient[i].strIngredient}</h3>
                <p>${myIngredient[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
        </div>
        </div>
        
        `
    }
    $("#rowData").html(myList)
}
// =================================Mesls funcations ====================================
function showMeals(myMeals) {
    let myList = "";

    for (let i = 0; i < myMeals.length; i++) {
        myList += `
        <div class="col-md-3">
                <div onclick="getMealDetails('${myMeals[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${myMeals[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${myMeals[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `}
    $("#rowData").html(myList)
}
async function catMeals(myCatMeal) {
    $("rowData").html("")
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${myCatMeal}`)
    response = await response.json()
    showMeals(response.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)
}
async function areaMeals(myAreaMeal) {
    $("rowData").html("")
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${myAreaMeal}`)
    response = await response.json()
    showMeals(response.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)
}
async function ingrMeals(myIngrMeals) {
    $("rowData").html("")
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${myIngrMeals}`)
    response = await response.json()
    showMeals(response.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)
}
// =================================Details funcations ====================================
async function getMealDetails(mealID) {
    closeSideNav()
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    searchContainer.innerHTML = "";
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    respone = await respone.json();

    displayMealDetails(respone.meals[0])
    $(".inner-loading-screen").fadeOut(300)
}

function displayMealDetails(meal) {
    
    searchContainer.innerHTML = "";


    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal.strTags?.split(",")
    // let tags = meal.strTags.split(",")
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }



    let myList = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`
    $("#rowData").html(myList)
}
// =================================Search funcations ====================================
function showSearch() {
    $("#searchContainer").html(`<div class="row py-4 ">
    <div class="col-md-6 ">
        <input onkeyup="searchName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
    </div>
    <div class="col-md-6">
        <input onkeyup="searchFirst(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
    </div>
</div>`)
    $("#rowData").html = ""
}
async function searchName(mealName) {
    closeSideNav()
    $("rowData").html("")
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
    response = await response.json()
    response.meals ? showMeals(response.meals) : showMeals([])
    $(".inner-loading-screen").fadeOut(300)
}
async function searchFirst(firstChar) {
    closeSideNav()
    $("rowData").html("")
    $(".inner-loading-screen").fadeIn(300)
    firstChar == "" ? firstChar = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${firstChar}`)
    response = await response.json()
    response.meals ? showMeals(response.meals) : showMeals([])
    $(".inner-loading-screen").fadeOut(300)
}
// =================================contactUs funcations ====================================
function showContacts() {
    $("#rowData").html(`<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3" onclick = "clearInputs()">Submit</button>
    </div>
</div>`)
    let submitBtn = $("#submitBtn")
    $("#nameInput").click(function(){nameInputTouched = true})
    $("#nameInput").click(function(){emailInputTouched = true})
    $("#nameInput").click(function(){phoneInputTouched = true})
    $("#nameInput").click(function(){ageInputTouched = true})
    $("#nameInput").click(function(){passwordInputTouched = true})
    $("#nameInput").click(function(){repasswordInputTouched = true})
}
function inputsValidation() {
    if (nameInputTouched) {
        if (nameValidation()) {
            $("#nameAlert").removeClass("d-block")
            $("#nameAlert").addClass("d-none")
        } else {
            $("#nameAlert").removeClass("d-none")
            $("#nameAlert").addClass("d-block")
        }
    }
    if (emailInputTouched) {
        if (emailValidation()) {
            $("#emailAlert").removeClass("d-block")
            $("#emailAlert").addClass("d-none")
        } else {
            $("#emailAlert").removeClass("d-none")
            $("#emailAlert").addClass("d-block")
        }
    }
    if (phoneInputTouched) {
        if (phoneValidation()) {
            $("#phoneAlert").removeClass("d-block")
            $("#phoneAlert").addClass("d-none")
        } else {
            $("#phoneAlert").removeClass("d-none")
            $("#phoneAlert").addClass("d-block")
        }
    }
    if (ageInputTouched) {
        if (ageValidation()) {
            $("#ageAlert").removeClass("d-block")
            $("#ageAlert").addClass("d-none")
        } else {
            $("#ageAlert").removeClass("d-none")
            $("#ageAlert").addClass("d-block")
        }
    }
    if (passwordInputTouched) {
        if (passwordValidation()) {
            $("#passwordAlert").removeClass("d-block")
            $("#passwordAlert").addClass("d-none")
        } else {
            $("#passwordAlert").removeClass("d-none")
            $("#passwordAlert").addClass("d-block")
        }
    }
    if (repasswordInputTouched) {
        if (repasswordValidation()) {
            $("#repasswordAlert").removeClass("d-block")
            $("#repasswordAlert").addClass("d-none")
        } else {
            $("#repasswordAlert").removeClass("d-none")
            $("#repasswordAlert").addClass("d-block")
        }
    }
    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)

    }
}
function clearInputs(){
    $("input").val(``)
}
function nameValidation() {
    return (/^[a-zA-Z ]+$/.test($("#nameInput").val()))
}
function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($("#emailInput").val()))
}
function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test($("#phoneInput").val()))
}
function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test($("#ageInput").val()))
}
function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test($("#passwordInput").val()))
}
function repasswordValidation() {
    return $("#repasswordInput").val() == $("#passwordInput").val()
}
// =================================Nav====================================
function openSideNav() {
    $(".side-nav-menu").animate({
        left: 0
    }, 500)

    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");
    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
}
function closeSideNav() {
    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth()
    $(".side-nav-menu").animate({
        left: -boxWidth
    }, 500)
    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon").removeClass("fa-x");
    $(".links li").animate({
        top: 300
    }, 500)
}
closeSideNav()