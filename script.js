    // 篩選與排序
    const filterType = document.getElementById("filterType");
    const sortOption = document.getElementById("sortOption");
    const animalContainer = document.getElementById("animalContainer");
    let cards = Array.from(animalContainer.getElementsByClassName("animal-card"));

    function filterAndSort() {
      const type = filterType.value;
      const sort = sortOption.value;

      let filteredCards = cards;

      // 篩選
      if (type) {
        filteredCards = filteredCards.filter((card) => card.dataset.type === type);
      }

      // 排序
      filteredCards.sort((a, b) => {
        if (sort === "ageAsc") {
          return Number(a.dataset.age) - Number(b.dataset.age);
        } else if (sort === "ageDesc") {
          return Number(b.dataset.age) - Number(a.dataset.age);
        } else if (sort === "rangeAsc") {
          return a.dataset.range.localeCompare(b.dataset.range);
        } else if (sort === "rangeDesc") {
          return b.dataset.range.localeCompare(a.dataset.range);
        }
        return 0;
      });

      // 清空容器，依篩選排序結果重新排版
      animalContainer.innerHTML = "";
      filteredCards.forEach((card) => {
        animalContainer.appendChild(card);
        card.style.display = "block"; // 確保顯示
      });

      // 隱藏不符合篩選的卡片
      cards.forEach((card) => {
        if (!filteredCards.includes(card)) {
          card.style.display = "none";
        }
      });
    }

    filterType.addEventListener("change", filterAndSort);
    sortOption.addEventListener("change", filterAndSort);

    // 初始執行一次
    filterAndSort();

    // 新增卡片功能
    const addBtn = document.getElementById("addAnimalBtn");
    const formDiv = document.getElementById("addAnimalForm");
    const animalForm = document.getElementById("animalForm");

    addBtn.addEventListener("click", () => {
      formDiv.style.display = formDiv.style.display === "none" ? "block" : "none";
    });

    animalForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("animalName").value.trim();
      const type = document.getElementById("animalType").value.trim();
      const age = document.getElementById("animalAge").value.trim();
      const range = document.getElementById("animalRange").value.trim();
      const desc = document.getElementById("animalDesc").value.trim();
      const image = document.getElementById("animalImage").value.trim() || "default.jpg";

      const col = document.createElement("div");
      col.className = "col-md-3 animal-card";
      col.dataset.type = type;
      col.dataset.age = age;
      col.dataset.range = range;

      col.innerHTML = `
        <div class="card">
          <img src="${image}" class="card-img-top" alt="${name}">
          <div class="card-body text-center">
            <h5 class="card-title">${name}</h5>
            <p class="card-text">${desc}</p>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#detailModal"
              data-name="${name}" data-type="${type}" data-age="${age}" data-range="${range}" data-desc="${desc}">
              詳細資訊
            </button>
          </div>
        </div>
      `;

      animalContainer.appendChild(col);
      cards.push(col);
      formDiv.style.display = "none";
      animalForm.reset();
      filterAndSort();
    });

    // 詳細資料Modal設定
    const detailModal = document.getElementById("detailModal");
    detailModal.addEventListener("show.bs.modal", (event) => {
      const button = event.relatedTarget;
      document.getElementById("detailName").textContent = "名稱: " + button.dataset.name;
      document.getElementById("detailType").textContent = "種類: " + button.dataset.type;
      document.getElementById("detailAge").textContent = "年齡: " + button.dataset.age + " 歲";
      document.getElementById("detailRange").textContent = "送養範圍: " + button.dataset.range;
      document.getElementById("detailDesc").textContent = "描述: " + button.dataset.desc;
    });