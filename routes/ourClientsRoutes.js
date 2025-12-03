// const express = require("express");
// const router = express.Router();
// const upload = require("../middleware/upload");

// const {
//   createClient,
//   getClients,
//   updateClient,
//   deleteClient,
// } = require("../controllers/ourClientsController");

// // CREATE
// router.post("/", upload.single("image"), createClient);

// // READ ALL
// router.get("/", getClients);

// // UPDATE
// router.put("/:id", upload.single("image"), updateClient);

// // DELETE
// router.delete("/:id", deleteClient);

// module.exports = router;

const express = require("express");
const router = express.Router();

const cloudUpload = require("../middleware/cloudUpload");

// 🔥 Create Cloudinary uploader for Clients folder
const upload = cloudUpload("clients");

const {
  createClient,
  getClients,
  updateClient,
  deleteClient,
} = require("../controllers/ourClientsController");

router.post("/", upload.single("image"), createClient);
router.get("/", getClients);
router.put("/:id", upload.single("image"), updateClient);
router.delete("/:id", deleteClient);

module.exports = router;
