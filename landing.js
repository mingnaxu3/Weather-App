// selects the form element that is within this section, called form 
const form = document.querySelector(".top-banner form");
const input = form.querySelector("input[type='text']");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
const apiKey = "6620455ba4db98d383449a15a422e13c"

form.addEventListener("submit", e => {
  //prevents the form from submitting and page reloading
  e.preventDefault();
  //grabs the input value from the form 
  let inputVal = input.value;

  //check if there is already a city 
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0 ) {
    const filteredArray = listItemsArray.filter ( el => {
      let content = "";
      //if the input is a city, country example
      if (inputVal.includes(",")){
        //check for an invalid entry 
        if(inputVal.split(",")[1].length > 3) {
          //just keep the city value 
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }

      } else { //just the city, no country specified 
        content = el.querySelector(".city-name").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();

    });
    if (filteredArray.length > 0) {
      msg.textContent = 'You already know the weather for ${filteredArray[0].querySelector(".city-name span").textContent}...otherwise be more specific by providing the country code as well';
      form.reset();
      input.focus();
      return;
    }
  }


//ajax request 
const url= `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=imperial`;

//fetch the url 
fetch(url) //returns a promise tha contains the response object, but need to format it as a json
  .then(response => response.json())
  //returns another promise, when fulfilled, data available for manipulation
  .then(data => {
    //do something w the data 
    const { main, name, sys, weather} = data;
    const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
      }.svg`;
    const li = document.createElement("li");
    li.classList.add("city");
    const markup = `<h2 class ="city-name" data-name="${name},${sys.country}"><span>${name}</span><sup>${sys.country}</sup></h2> <div class="city-temp">${Math.round(main.temp)}<sup>°F</sup></div> <figure><img class="city-icon" src="${icon}" alt="${weather[0]["description"]}"><figcaption>${weather[0]["description"]}</figcaption></figure>`;
    li.innerHTML = markup;
    list.appendChild(li);
  })
  //display message on screen if the url fetch doesn't suceed
  .catch( () => {
    msg.textContent = "Please search for a valid city"

  });
  msg.textContent = "";
  form.reset();
  input.focus();
  });



