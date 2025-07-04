const populationURL = "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/vaerak/statfin_vaerak_pxt_11ra.px";
const employmentUrl = "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/tyokay/statfin_tyokay_pxt_115b.px";

// Функция для отправки POST-запроса
const fetchStatFinData = async (URL, body) => {
    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    return await response.json();
};

// Основной запуск
const inittializeCode = async () => {
    const populationBody = await (await fetch("population_query.json")).json();
    const employmentBody = await (await fetch("employment_query.json")).json();

    const [populationData, employmentData] = await Promise.all([
        fetchStatFinData(populationURL, populationBody),
        fetchStatFinData(employmentUrl, employmentBody)
    ]);

    setupTable(populationData, employmentData);
};

// Отрисовка таблицы
function setupTable(populationData, employmentData) {
    const areaLabels = populationData.dataset.dimension.Alue.category.label;
    const populationValues = populationData.dataset.value;
    const employmentValues = employmentData.dataset.value;

    const tableBody = document.getElementById("table-rows");
    const areaKeys = Object.keys(areaLabels);

    areaKeys.forEach((key, index) => {
        const municipality = areaLabels[key];
        const population = populationValues[index];
        const employed = employmentValues[index];
        const employmentPercentage = ((employed / population) * 100).toFixed(2);

        // Создание строки и ячеек
        const row = document.createElement("tr");

        const tdMunicipality = document.createElement("td");
        tdMunicipality.textContent = municipality;

        const tdPopulation = document.createElement("td");
        tdPopulation.textContent = population;

        const tdEmployed = document.createElement("td");
        tdEmployed.textContent = employed;

        const tdPercentage = document.createElement("td");
        tdPercentage.textContent = `${employmentPercentage}%`;

        // Добавление ячеек в строку
        row.appendChild(tdMunicipality);
        row.appendChild(tdPopulation);
        row.appendChild(tdEmployed);
        row.appendChild(tdPercentage);

        // Условное окрашивание
        if (employmentPercentage > 45) {
            row.classList.add("high");
        } else if (employmentPercentage < 25) {
            row.classList.add("low");
        }
        
        tableBody.appendChild(row);
    });
}

// Инициализация после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
    inittializeCode();
});
