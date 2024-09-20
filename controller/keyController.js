const keyService = require("../service/keyService");

const generateToken = async (req, res) => {
  try {
    const key = await keyService.generateNewKey();
    res.status(201).json("New key generated");
  } catch (error) {
    console.log(`Error generating key : ${error.stack}`);
    throw error;
  }
};

const retrieveKey = async (req, res) => {
  try {
    const key = await keyService.retrieveKey();
    if (!key) {
      res.status(404).json("No available key");
    }
    res.json({ key: key });
  } catch (error) {
    throw error;
  }
};

const fetchInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const key = await keyService.fetchInfo(parseInt(id));
    if (!key) {
      res.status(404).json("No available key");
    }
    res.json({ key: key });
  } catch (error) {
    throw error;
  }
};

const deleteKey = async (req, res) => {
  try {
    const { id } = req.params;
    const key = await keyService.removeKey(parseInt(id));
    if (!key) {
      res.status(404).json("Key not found");
    }
    res.json(`deleted: ${key}`);
  } catch (error) {
    throw error;
  }
};

const unblockKey = async (req, res) => {
  try {
    const { id } = req.params;
    const key = await keyService.unblockKey(parseInt(id));
    if (!key) {
      res.status(404).json("Key not found");
    }
    res.json(JSON.stringify(key));
  } catch (error) {
    throw error;
  }
};

const keepAlive = async (req, res) => {
  try {
    const { id } = req.params;
    const key = await keyService.keepAliveKey(parseInt(id));
    if (!key) {
      res.status(404).json("Key not found");
    }
    res.json(key);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateToken,
  retrieveKey,
  fetchInfo,
  deleteKey,
  unblockKey,
  keepAlive,
};
