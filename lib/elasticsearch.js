import { Client } from '@elastic/elasticsearch';

export async function connectToElasticsearch() {
  const ESS_CLOUD_ID = process.env.cloud_id;
  const ESS_CLOUD_USERNAME = process.env.user;
  const ESS_CLOUD_PASSWORD = process.env.password;

  if (!ESS_CLOUD_ID || !ESS_CLOUD_USERNAME || !ESS_CLOUD_PASSWORD) {
    return 'ERR_ENV_NOT_DEFINED';
  }

  return new Client({
    cloud: {
      id: ESS_CLOUD_ID,
    },
    auth: {
      username: ESS_CLOUD_USERNAME,
      password: ESS_CLOUD_PASSWORD,
    },
  });
}
