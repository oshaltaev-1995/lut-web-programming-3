  const populationURL = "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/vaerak/statfin_vaerak_pxt_11ra.px";
  const employmentUrl = "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/tyokay/statfin_tyokay_pxt_115b.px";

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

const inittializeCode = async () => {
    const populationBody = await (await fetch("population_query.json")).json();
    const employmentBody = await (await fetch("employment_query.json")).json();

    const [populationData, employmentData] = await Promise.all([
        fetchStatFinData(populationURL, populationBody),
        fetchStatFinData(employmentUrl, employmentBody)
    ]);

    setupTable(populationData, employmentData);
};