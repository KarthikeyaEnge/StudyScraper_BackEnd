const { client } = require("../config/mongoconfig");

const getdbdata = async (req, res) => {
  const { user } = req.body;
  const col1 = client.db("myusercreds").collection("userdata");
  const col2 = client.db("myusercreds").collection("usercreds");
  try {
    const data = await col2.findOne({ UserName: user });
    if (data === null) res.status(404).json({ message: "cannot find user" });
    else {
      const sdata = await col1.findOne({ user: user });
      const resdata = {
        user: data.UserName,
        pass: data.Password,
        src: sdata.searchdata,
      };
      res.status(200).json(resdata);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = getdbdata;
