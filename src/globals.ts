/**
 * This file can be used to store global variables that you need to access across multiple places.
 * We've put a few here that we know you will need.
 * Fill in the blank for each one
 */
export const MY_BU_ID = "34177563";
export const BASE_API_URL = "https://spark-se-assessment-api.azurewebsites.net/api";
// You can get this from Gradescope aka x-functions-key
export const TOKEN = "6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ==";
// This is a helper function to generate the headers with the x-functions-key attached
export const GET_DEFAULT_HEADERS = () => {
  var headers = new Headers();
  headers.append("x-functions-key", TOKEN);
  return headers;
};
