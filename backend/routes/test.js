const { logger } = require("../log/logger");
const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");

const test = require("../controllers/test");

router.get("/", async (req, res) => {
  try {
    return res.status(200).send({ message: "hello world! /v2" });
  } catch (err) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
});

router.post("/testdata", isLoggedIn, test.createTestData);
router.get("/testdata/:_id?", isLoggedIn, test.getTestData);
router.put("/testdata/:_id/:field", isLoggedIn, test.updateTestData);
router.delete("/testdata/:_id", isLoggedIn, test.removeTestData);

router.get("/db", test.db);

router.get("/test1", test.test1);

router.post("/redis", test.createRedis);

router.get("/redis", test.getRedis);

router.delete("/redis/:key", test.removeRedis);

router.post("/redis/hash", test.testRedisHash);

router.put("/uids", test.includeUid);
router.put("/uids/archives", test.includeUidinArchive);

router.put(
  "/uids/archives/schools",
  test.includeSchoolIdAndSchoolNameinArchive
);

module.exports = router;
