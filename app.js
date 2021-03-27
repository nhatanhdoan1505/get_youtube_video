const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const urlencode = require("urlencode");
const requests = require("request");
const app = express();
const fs = require("fs");

app.use(cors());
// Express EJS Template
app.set("view engine", "ejs");
app.set("views", "./views");

// Static foler
app.use(express.static(__dirname + "/public"));

// Express body-Parser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(cors());

app.post("/api/keyword", (request, respose) => {
  let endpoint;
  if (request.body.keyword) {
    endpoint = `https://www.youtube.com/resultssearch_query=${urlencode(
      request.body.keyword
    )}`;
    requests(endpoint, (err, res, html) => {
      if (err) {
        console.log(err);
      }
      let start = "var ytInitialData = ";
      let end = "</script>";
      let body = html.slice(html.indexOf(start));
      let result = body.slice(
        body.indexOf(start) + start.length,
        body.indexOf(end) - 1
      );

      let ob = JSON.parse(result);
      let contents =
        ob.contents.twoColumnSearchResultsRenderer.primaryContents
          .sectionListRenderer.contents;
      let video_contents = contents[0].itemSectionRenderer.contents;

      let channels_array = video_contents
        .filter((channel) => channel.channelRenderer)
        .map(channel => channel.channelRenderer)
        .map((channel) => {
          return {
            thumbnail: channel.thumbnail.thumbnails[1].url,
            url:
              channel.navigationEndpoint.commandMetadata.webCommandMetadata
                .url,
          };
        });

      let videos_array = video_contents
        .filter((video) => {
          return video.videoRenderer;
        })
        .map((video) => {
          return video.videoRenderer;
        })
        .map((video) => {
          let channel_thumnail = channels_array.filter(channel => {
            return channel.url === video.ownerText.runs[0].navigationEndpoint.commandMetadata
            .webCommandMetadata.url
          });
          return {
            videoId: video.videoId,
            videoURl:
              video.navigationEndpoint.commandMetadata.webCommandMetadata
                .url,
            thumbnail: video.thumbnail.thumbnails[1].url,
            title: video.title.runs[0].text,
            descriptionSnippet: video.descriptionSnippet.runs[0].text,
            publishedTimeText: video.publishedTimeText.simpleText,
            lengthText: video.lengthText.simpleText,
            viewCountText: video.viewCountText.simpleText,
            channelTitle: video.ownerText.runs[0].text,
            channelUrl:
              video.ownerText.runs[0].navigationEndpoint.commandMetadata
                .webCommandMetadata.url,
            channelThumnail: channel_thumnail[0].thumbnail
          };
        });
      respose.status(200).json(videos_array);
    });
  }
});

const PORT = process.env.PORT || 80;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
