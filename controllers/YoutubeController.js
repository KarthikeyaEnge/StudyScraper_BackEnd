const { google } = require("googleapis");
const wikiController = require("./wikiController");
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API2,
});
const { YoutubeTranscript } = require("youtube-transcript");
const palmController = require("./palmController");
const Ucontroller = async (req, res) => {
  const query = req.body.query.q;
  const sub = req.body.query.subject;
  const chn = req.body.channelname;
  const rated = req.body.rated;
  const chart = rated ? "mostPopular" : "";

  try {
    //console.log(query.split(" ")[2]);
    console.log(query, sub, chn, rated);

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
      q: sub + query,

      type: "video",
      maxResults: 1,
      chart: chart,
      channelId: channelid,
    });

    /* const capresponse = await youtube.captions.list({
      part: "snippet",
      videoId: item.data.items[0].id.videoId,
    });

    const captions = capresponse.data.items;
    console.log(captions); */
    /* const capdata = await youtube.captions.download({
      id: captions[0].id,
      tfmt: "srt",
      tlang: "en",
    });
    console.log(capdata.data); */
    const cap = await YoutubeTranscript.fetchTranscript(
      item.data.items[0].id.videoId
    );
    caption = "";
    cap.map((item) => {
      caption += item.text;
    });
    //console.log(caption);
    const summary = await palmController(caption, "2");
    //print(summary);
    const content = await wikiController(query);

    // console.log(query.split(" ")[2]);
    const vidlist = {
      id: item.data.items[0].id.videoId,
      q: item.config.params.q,
      content: content,
      cap: summary,
    };

    //res.send(vidlist);
    console.log(vidlist);
    res.status(200).send(vidlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = Ucontroller;
