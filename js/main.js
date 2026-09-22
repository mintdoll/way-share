const routes = [
  { title: "Прогулка по центру", category: "walk", categoryName: "Прогулка", location: "Площадь Ленина", budget: 500, duration: 2 },
  { title: "Вечерняя набережная", category: "walk", categoryName: "Прогулка", location: "Нижняя набережная", budget: 0, duration: 3 },
  { title: "Где поесть в центре", category: "food", categoryName: "Еда", location: "Улица Карла Маркса", budget: 1500, duration: 2 },
  { title: "История города", category: "culture", categoryName: "Культура", location: "Краеведческий музей", budget: 800, duration: 3 },
  { title: "Тихий день в парке", category: "nature", categoryName: "Природа", location: "Парк", budget: 0, duration: 4 }
];

function showRoutes(list, element) {
  if (!element) return;
  element.innerHTML = list.map(route => `
    <article class="route-card">
      <h3>${route.title}</h3>
      <p>${route.location}</p>
      <p class="route-meta">${route.categoryName} · ${route.duration} ч · ${route.budget === 0 ? "Бесплатно" : route.budget + " ₽"}</p>
    </article>
  `).join("");
}

const homeRoutes = document.querySelector("#feed-routes");
const mapRoutes = document.querySelector("#map-routes");
const profileRoutes = document.querySelector("#profile-routes");

showRoutes(routes, homeRoutes);
showRoutes(routes, profileRoutes);
showRoutes(routes, mapRoutes);

const search = document.querySelector("#map-search");
const category = document.querySelector("#map-category");

function filterRoutes() {
  const text = search ? search.value.toLowerCase() : "";
  const type = category ? category.value : "all";

  const result = routes.filter(route =>
    route.title.toLowerCase().includes(text) &&
    (type === "all" || route.category === type)
  );

  showRoutes(result, mapRoutes);
}

if (search) search.addEventListener("input", filterRoutes);
if (category) category.addEventListener("change", filterRoutes);

const count = document.querySelector("#profile-route-count");
if (count) count.textContent = routes.length;

const form = document.querySelector("#route-form");
const message = document.querySelector("#form-message");

if (form) {
  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    message.textContent = "Маршрут заполнен и готов к публикации.";
  });
}
