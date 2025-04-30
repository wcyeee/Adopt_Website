const filterType = document.getElementById("filterType");
const sortOption = document.getElementById("sortOption");
const animalContainer = document.getElementById("animalContainer");
const addBtn = document.getElementById("addAnimalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formDiv = document.getElementById("addAnimalForm");
const animalForm = document.getElementById("animalForm");
const overlay = document.getElementById("overlay");
const statuses = ["尚未領養", "預約領養"];
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) { // 捲動超過50px就加透明class
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

let animals = [
  { id: 1, name: "小花", species: "狗", age: 2, range: "北部", desc: "3個月／母", status: "尚未領養", img: "image/pig.jpg" },
  { id: 2, name: "小白", species: "貓", age: 3, range: "中部", desc: "1歲5個月／公", status: "預約領養", img: "image/pig.jpg" },
  { id: 3, name: "小黑", species: "貓", age: 1, range: "南部", desc: "3個月／母", status: "預約領養", img: "image/pig.jpg" },
  { id: 4, name: "小黃", species: "豬", age: 4, range: "中部", desc: "1歲5個月／公", status: "尚未領養", img: "image/pig.jpg" },
  { id: 5, name: "小白", species: "豬", age: 4, range: "中部", desc: "1歲5個月／公", status: "預約領養", img: "image/pig.jpg" },
  { id: 6, name: "小黑", species: "豬", age: 4, range: "中部", desc: "1歲5個月／公", status: "預約領養", img: "image/pig.jpg" },
  { id: 7, name: "小黃", species: "豬", age: 4, range: "中部", desc: "1歲5個月／公", status: "尚未領養", img: "image/pig.jpg" },
  { id: 8, name: "小白", species: "豬", age: 4, range: "中部", desc: "1歲5個月／公", status: "預約領養", img: "image/pig.jpg" },
  { id: 9, name: "小黑", species: "豬", age: 4, range: "中部", desc: "1歲5個月／公", status: "預約領養", img: "image/pig.jpg" },
];

function generateId() {
  return animals.length ? Math.max(...animals.map(a => a.id)) + 1 : 1;
}

function renderCards(data) {
  animalContainer.innerHTML = "";
  data.forEach(animal => {
    const statuses = ["尚未領養", "預約領養"];
    const statusHtml = statuses.map(status => {
      const activeClass = (status === animal.status) ? "active" : "";
      return `<span class="status-${status} ${activeClass}">${status}</span>`;
    }).join("／");

    const col = document.createElement("div");
    col.className = "col-md-3 animal-card";
    col.dataset.id = animal.id;

    col.innerHTML = `
      <div class="card h-100 d-flex flex-column">
        <img src="${animal.img}" class="card-img-top" alt="${animal.name}">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h2 class="card-title">${animal.name}</h2>
            <p class="card-text">${animal.desc}</p>
            <p class="status-container">${statusHtml}</p>
          </div>
          <div>
            <a href="animal_detail.html?id=${animal.id}" class="btn btn-primary w-100 mb-2">詳細資訊</a>
          </div>
        </div>
      </div>
    `;
    animalContainer.appendChild(col);
  });
}

function filterAndSort() {
  const type = filterType.value;
  const sort = sortOption.value;

  let filtered = animals;

  if (type) {
    filtered = filtered.filter(a => a.species === type);
  }

  filtered.sort((a, b) => {
    if (sort === "ageAsc") return a.age - b.age;
    if (sort === "ageDesc") return b.age - a.age;
    if (sort === "rangeAsc") return a.range.localeCompare(b.range);
    if (sort === "rangeDesc") return b.range.localeCompare(a.range);
    return 0;
  });

  renderCards(filtered);
}

addBtn.addEventListener("click", () => {
  formDiv.style.display = "block";
  overlay.style.display = "block";

  setTimeout(() => {
    formDiv.classList.add("show");
    overlay.classList.add("show"); // 讓遮罩也有動畫
  }, 10);
});

cancelBtn.addEventListener("click", closeForm);
overlay.addEventListener("click", closeForm);

function closeForm() {
  formDiv.classList.remove("show");
  overlay.classList.remove("show");

  formDiv.removeEventListener("transitionend", onFormTransitionEnd);
  formDiv.addEventListener("transitionend", onFormTransitionEnd, { once: true });

  overlay.removeEventListener("transitionend", onOverlayTransitionEnd);
  overlay.addEventListener("transitionend", onOverlayTransitionEnd, { once: true });
}

function onFormTransitionEnd() {
  if (!formDiv.classList.contains("show")) {
    formDiv.style.display = "none";
    animalForm.reset();
  }
}

function onOverlayTransitionEnd() {
  if (!overlay.classList.contains("show")) {
    overlay.style.display = "none";
  }
}

animalForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("animalName").value.trim();
  const species = document.getElementById("animalType").value.trim();
  const age = Number(document.getElementById("animalAge").value.trim());
  const range = document.getElementById("animalRange").value.trim();
  const desc = document.getElementById("animalDesc").value.trim();
  const img = document.getElementById("animalImage").value.trim() || "default.jpg";

  if (!name || !species || !age || !range) {
    alert("請填寫所有必填欄位");
    return;
  }

  const newAnimal = {
    id: generateId(),
    name,
    species,
    age,
    range,
    desc,
    img,
  };

  animals.push(newAnimal);
  filterAndSort();

  showToast("新增成功！"); // 顯示成功小提示
  closeForm();
});


function onTransitionEnd() {
  if (!formDiv.classList.contains("show")) {
    formDiv.style.display = "none";
    animalForm.reset();
  }
}

// 顯示小提示訊息
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000); // 2秒後自動消失
}

filterType.addEventListener("change", filterAndSort);
sortOption.addEventListener("change", filterAndSort);

filterAndSort();
