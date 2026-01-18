const { generateGoldReport } = require('../utils/generateGoldReport');

(async () => {
  const params = await generateGoldReport();
  console.log(params);
})();
