const PercyScript = require("@percy/script");

PercyScript.run(async (page, percySnapshot) => {
  await page.goto("http://localhost:3000/");
  // ensure the page has loaded before capturing a snapshot
  await page.waitFor(".pb-4");
  await percySnapshot("homepage");
});
PercyScript.run(async (page, percySnapshot) => {
  await page.goto(
    "http://localhost:3000/citations_for_doi?doi=10.2139/ssrn.2422269"
  );
  // ensure the page has loaded before capturing a snapshot
  await page.waitFor(10000);
  await percySnapshot("citations_doi");
});
PercyScript.run(async (page, percySnapshot) => {
  await page.goto(
    "http://localhost:3000/citations_for_title?title=Aging Hallmarks: The Benefits of Physical Exercise"
  );
  // ensure the page has loaded before capturing a snapshot
  await page.waitFor(10000);
  await percySnapshot("citations_title");
});
