import fs from "fs-extra";
import axios from "axios";
import { getImageSize } from "./getImageSize.js";
import { log, time } from "./log.js";

const endTime = time("ended ");

const { writeJSON } = fs;

const INITIAL_ID_XKCD_COMIC = 2650;
const MAX_ID_XKCD_COMIC = 2738;

const indexFileContent = [];

for (
  let comicId = INITIAL_ID_XKCD_COMIC;
  comicId <= MAX_ID_XKCD_COMIC;
  comicId++
) {
  const url = `https://xkcd.com/${comicId}/info.0.json`;
  log(`Fetching ${url}...`);
  const { data } = await axios.get(url);
  const { num: id, news, transcript, img, ...restOfComic } = data;
  log(`Fetched comic #${id}. Getting image dimensions...`);
  const { height, width } = await getImageSize({ url: img });
  log(`Got image dimensions: ${height}x${width}`);
  const comicToStore = {
    id,
    img,
    height,
    width,
    ...restOfComic,
  };
  indexFileContent.push(comicToStore);
  const jsonFile = `./comics/${id}.json`;
  await writeJSON(jsonFile, comicToStore);
  log(`Wrote ${jsonFile}! ✅ \n`);
}
await writeJSON("./comics/index.json", indexFileContent);
log(`Wrote index content! ✅ \n`);
endTime();
