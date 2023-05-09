const { google } = require("googleapis");
const wikiController = require("./wikiController");
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API,
});

const Ucontroller = async (req, res) => {
  const query = req.body.query;
  const chn = req.body.channelname;
  const rated = req.body.rated;
  const chart = rated ? "mostPopular" : "";

  console.log(query);
  let channelid = null;
  if (chn) {
    console.log(chn);
    const d = await youtube.search.list({
      part: "snippet",
      type: "channel",
      q: chn,
    });
    channelid = d.data.items[0].id.channelId;
  }

  const item = await youtube.search.list({
    part: "snippet",
    q: query,
    type: "video",
    maxResults: 1,
    chart: chart,
    channelId: channelid,
  });

  const content = await wikiController(query.split(" ")[2]);
  // console.log(query.split(" ")[2]);
  const vidlist = {
    id: item.data.items[0].id.videoId,
    q: item.config.params.q,
    content: content,
  };

  //res.send(vidlist);
  console.log(vidlist);
  res.status(200).send(vidlist);
};

module.exports = Ucontroller;
