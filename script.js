let your_weather_button = document.querySelector("[user-tab]");
let search_weather_button = document.querySelector("[search-weather-tab]");
let location_granted = document.querySelector(".grant-location");
let search_weather = document.querySelector(".search-weather");
let user_location = document.querySelector(".location-weather");
let error_tab = document.querySelector(".error-handle");


let current_tab = your_weather_button;
const API_KEY = "46a4e2f995c09b113e91733f46c46e87";
current_tab.classList.add("bg-effect");
getfromSessionStorage();



function tabSwitch(clickedTab){
    if(clickedTab != current_tab){
        current_tab.classList.remove("bg-effect");
        current_tab = clickedTab;
        current_tab.classList.add("bg-effect");


        //if search weather is invisible and it is clicked tab for now
        if(!(search_weather.classList.contains("active"))){
            search_weather.classList.add("active");
            user_location.classList.remove("active");
            location_granted.classList.remove("active");
            error_tab.classList.remove("active");
            
        }

        else{
            search_weather.classList.remove("active");
            user_location.classList.remove("active");
            error_tab.classList.remove("active");
         
              //ab main your weather tab me aagya hu, toh weather bhi display karna padega, so let's check local storage first
            //for coordinates, if i haved saved them there.
            getfromSessionStorage();

        }
    }
};


your_weather_button.addEventListener('click',() =>{
    tabSwitch(your_weather_button);
});

search_weather_button.addEventListener('click', () =>{
    tabSwitch(search_weather_button);
});

let loading_page = document.querySelector(".load");

document.addEventListener('DOMContentLoaded', () => {
    getfromSessionStorage(); 
});

//Check if coordinates are available or not
function getfromSessionStorage(){
    let Mycoordinates = sessionStorage.getItem("user-coordinates");

    if(!Mycoordinates){
    //if not => make grant_location visible
    location_granted.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(Mycoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

//fetching userWeather by latitude and longitude
async function fetchUserWeatherInfo(coordinates){

   const{lat ,lon} = coordinates;
   location_granted.classList.remove("active");
   loading_page.classList.add("active");

   try{
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

    const result = await response.json();
    loading_page.classList.remove("active");
   
    renderWeatherInfo(result);
    user_location.classList.add("active");

   }
   catch(e){
    loading_page.classList.remove("active");
   }
}

function renderWeatherInfo(data){

    let cityName = document.querySelector("[Location]");
    let countryFlag = document.querySelector("[CountryFlag]");
    let atmosphere = document.querySelector("[atmosphere]");
    let atmosphereImg = document.querySelector("[ atmpImg]");
    let temp = document.querySelector("[temperature]");
    let windSpeed = document.querySelector("[wSpeed]");
    let humidityPer = document.querySelector("[humid]");
    let cloudPercentage = document.querySelector("[cloudPer]");

    cityName.innerText =  data?.name;
    countryFlag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    atmosphere.innerText = data?.weather?.[0]?.description;
    atmosphereImg.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = data?.main?.temp;
    windSpeed.innerText = `${data?.wind?.speed} m/s`;
    humidityPer.innerText = `${data?.main?.humidity} %`;
    cloudPercentage.innerText = `${data?.clouds?.all} %`;
}

//Check if loacation is present or not by inbuilt geolocation
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert('Location unavailable');
    }
}


function showPosition(position){

    const Usercoordinates = {
        lat:position.coords.latitude,
        lon: position.coords.longitude,

    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(Usercoordinates));
    fetchUserWeatherInfo(Usercoordinates);


}

//grantacess button 
let grantbtn = document.querySelector("[grantAccessBtn]");
grantbtn.addEventListener('click',getLocation);

let weatherSearch = document.querySelector(".search-weather");

weatherSearch.addEventListener('submit',(e) =>{
  e.preventDefault();

 let cityInput = document.querySelector("[city]");
 let cityName = cityInput.value;

 if(cityName == ""){
    return;
 }

 else{
    fetchSearchWeather(cityName);
 }

})



//Handling invalid city error
function Errorhandle(){
   error_tab.classList.add("active");
}



//fetch api for any getweather by cityname
async function  fetchSearchWeather(cityName){
    loading_page.classList.add("active");
    location_granted.classList.remove("active");
    user_location.classList.remove("active");

    try{
        let response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
          );
        
          if (!response.ok) {
            throw new Error();
        }

        let ans = await response.json();

        loading_page.classList.remove("active");
        user_location.classList.add("active");
        error_tab.classList.remove("active");
        renderWeatherInfo(ans);
    }
    catch(err){
        loading_page.classList.remove("active");
        user_location.classList.remove("active");
        

        Errorhandle();
    }

   
}
 





