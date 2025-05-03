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


// 除錯
window.onerror = function(message, source, lineno, colno, error) {
  console.error("錯誤訊息:", message, "來源:", source, "行:", lineno, "列:", colno);
};


// nav透明效果
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) { // 捲動超過50px就加透明class
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// render動物卡片
let animals = [
  { id: 1, name: "小花", species: "狗", age: 2, desc: "這是一個簡短描述", status: "尚未領養", img: "image/pig.jpg" },
  { id: 2, name: "小白", species: "貓", age: 3, desc: "旺旺旺旺旺", status: "預約領養", img: "image/pig.jpg" },
  { id: 3, name: "小黑", species: "貓", age: 1, desc: "123456778", status: "預約領養", img: "image/pig.jpg" },
  { id: 4, name: "小黃", species: "豬", age: 4, desc: "簡短好簡短", status: "尚未領養", img: "image/pig.jpg" },
  { id: 5, name: "小白", species: "豬", age: 4, desc: "嘿嘿嘿嘿嘿", status: "預約領養", img: "image/pig.jpg" },
  { id: 6, name: "小黑", species: "豬", age: 4, desc: "懶得打了", status: "預約領養", img: "image/pig.jpg" },
  { id: 7, name: "小黃", species: "豬", age: 4, desc: "這是一個簡短描述", status: "尚未領養", img: "image/pig.jpg" },
  { id: 8, name: "小白", species: "豬", age: 4, desc: "這是一個簡短描述", status: "預約領養", img: "image/pig.jpg" },
  { id: 9, name: "小黑", species: "豬", age: 4, desc: "這是一個簡短描述", status: "預約領養", img: "image/pig.jpg" },
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

// 篩選排序功能
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
    return 0;
  });

  renderCards(filtered);
}

// 新增動物按鈕
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
  const gender = document.querySelector('input[name="animalGender"]:checked')?.value;
  const neutered = document.querySelector('input[name="animalNeutered"]:checked')?.value;
  const vaccine = document.getElementById("animalVaccine").value.trim();
  const feature = document.getElementById("animalFeature").value.trim();
  const desc = document.getElementById("animalDesc").value.trim();

  const imgInput = document.getElementById("animalImage");
  const img = imgInput.files[0] ? URL.createObjectURL(imgInput.files[0]) : "image/default.jpg";

  if (!name || !species || isNaN(age) || !gender || !neutered || !feature || !desc) {
    alert("請填寫所有必填欄位");
    return;
  }

  if (isNaN(age) || age < 0) {
    alert("年齡必須是 0 或以上的數字");
    return;
  }

  const newAnimal = {
    id: generateId(),
    name,
    species,
    age,
    gender,
    neutered,
    vaccine,
    feature: feature.slice(0, 10), // 保證不超過10字
    desc, // 留下完整說明但不在卡片顯示
    status: "尚未領養", // 固定值，不讓使用者輸入
    img,
  };

  animals.push(newAnimal);
  filterAndSort();

  showToast("新增成功！");
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

// 新增領養動物圖片預覽
document.getElementById('animalImage').addEventListener('change', function (event) {
  const file = event.target.files[0];
  const preview = document.getElementById('previewImage');

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.classList.remove('d-none'); // 移除 d-none 類別來顯示圖片
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = '';
    preview.classList.add('d-none'); // 若未選擇圖片，則隱藏預覽
  }
});


