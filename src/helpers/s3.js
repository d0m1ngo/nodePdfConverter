const Minio = require("minio");
const config = require("config");

const endPoint = config.get("endPoint");
const port = config.get("AwsPort");
const useSSL = config.get("useSSL");
const accessKey = config.get("accessKey");
const secretKey = config.get("secretKey");

const minioClient = new Minio.Client({
  endPoint,
  port,
  useSSL,
  accessKey,
  secretKey
});

module.exports = minioClient;
