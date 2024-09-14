import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//TODO: build a healthcheck response that simply returns the OK status as json with a message
const healthcheck = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, null, "OK!"));
});

export { healthcheck };
