const redis = require("redis");
const bluebird = require("bluebird");

bluebird.promisifyAll(redis);

const client = redis.createClient();

const redisConnect = async () => {
  try {
    await client.connect();
  } catch (err) {
    console.log(err);
  }
};

client.on("error", (error) => {
  console.error("redis error", error);
});

const setSingleCache = async (key, data) => {
  try {
    await client.set(key, data);
    return true;
  } catch (err) {
    console.log("cache set err " + err);
    return false;
  }
};

const setCache = async (key, ex, data) => {
  try {
    await client.setEx(key, ex, JSON.stringify(data));
  } catch (err) {
    console.log(err, "cache set err");
    return err;
  }
};

const getCache = async (key) => {
  try {
    return await client.get(key);
  } catch (err) {
    console.log("hello error", err.message);
    return err;
  }
};

const deleteCache = async (key) => {
  try {
    return await client.del(key);
  } catch (err) {
    return err;
  }
};

const appendCache = async (key, data) => {
  try {
    await client.append(key, JSON.stringify(data));
  } catch (error) {
    console.log(error, "cache set err");
    return error;
  }
};

const getAllData = async (key) => {
  try {
    return await client.get(key);
  } catch (err) {
    return err;
  }
};

module.exports = {
  redisConnect,
  setSingleCache,
  getAllData,
  appendCache,
  setCache,
  getCache,
  deleteCache,
};
