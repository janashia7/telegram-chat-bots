import { find } from "geo-tz";
import moment from "moment-timezone";
import logger from "./logger.js";

const timeConvert = (time, lat, lon) => {
  const localTimeZone = find(lat, lon);
  logger.info(localTimeZone, "localtimezone");
  const convert = moment
    .tz(time, "HH:mm", localTimeZone[0])
    .utc()
    .format("HH:mm");
  logger.info(convert, "converted time");
  return convert;
};

// timeConvert("12:50", 42.27, 42.698341);

export default timeConvert;
