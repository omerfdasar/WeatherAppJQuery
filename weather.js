const formJQuery = $(".top-banner form").eq(0);
const formJS = document.querySelector(".top-banner form");
const inputJQuery = $(".top-banner input").first();

const msg = $(".top-banner span").eq(0);
const list = $(".cities").eq(0);

$(document).ready(() => {
  localStorage.setItem(
    "apikey",
    EncryptStringAES("5fe5f6b3301f8311fe998acd9061f372")
  );
});
formJQuery.on("submit", (e) => {
  e.preventDefault();
  getWeatherDataFromApi();
});

const getWeatherDataFromApi = () => {
  let apikey = DecryptStringAES(localStorage.getItem("apikey"));

  let inputVal = inputJQuery.val();
  let units = "metric";
  let urlApi = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apikey}&units=${units}`;
  $.ajax({
    url: urlApi,
    type: "GET",
    dataType: "json",
    success: (response) => {
      const { main, name, sys, weather } = response;
      //   querySelector == find;
      const cityListItem = list.find(".city");
      const cityArray = cityListItem.get();
      console.log(cityArray);
      if (cityArray.length > 0) {
        const filteredArray = cityArray.filter(
          (card) => $(card).find(".city-name span").text() == name
        );
        if (filteredArray.length > 0) {
          msg.text(
            `you already know the weather for ${name}, please search for another city `
          );
          msg.css({ color: "yellow", "text-decoration": "underline" });

          formJS.reset();
          inputJQuery.focus();
          return;
        }
      }

      const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;
      //   creating element
      const createdLi = $(document.createElement("li"));
      createdLi.addClass("city");
      createdLi.html(`
        <h2 class="city-name" data-name="${name}, ${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
            <img class="city-icon" src="${iconUrl}">
            <figcaption>${weather[0].description}</figcaption>
        </figure>`);
      list.prepend(createdLi);
      formJS.reset();
      inputJQuery.focus();
      return;
    },
    beforeSend: (request) => {},
    complete: () => {},
    error: (XMLHttpRequest) => {
      console.log(XMLHttpRequest);
      msg.text(XMLHttpRequest.status + " " + XMLHttpRequest.statusText);
      msg.css({ color: "red", "text-decoration": "underline" });
      setTimeout(() => {
        msg.text("");
      }, 5000);
      formJS.reset();
      inputJS.focus();
    },
  });
};
