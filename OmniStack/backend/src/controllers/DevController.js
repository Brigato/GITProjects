const axios = require("axios");
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");
const { findConnections } = require("../websocket");

// index, show, store, update, destroy

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    // return response.send('Hello World');
    // console.log(request.body);
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiResponse = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      const { name = login, avatar_url, bio } = apiResponse.data;

      const techsArray = parseStringAsArray(techs);

      // console.log(name, avatar_url, bio, techsArray);

      const location = {
        type: "Point",
        coordinates: [latitude, longitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });

      // Filtrar conexoes a no maximo 10KM de distancia e que o novo dev tenha
      // pelo menos uma das technologias filtradas
      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      );

      console.log(sendSocketMessageTo);
    }

    // return response.json({ message: "aaa !!!" });
    return response.json(dev);
  },

  async update(request, response) {
    // name, avatar, bio, localizacao
    const { github_username } = request.query;
    const { name, avatar_url, bio, techs, latitude, longitude } = request.body;
    const location = {
      type: "Point",
      coordinates: [latitude, longitude]
    };

    const techsArray = parseStringAsArray(techs);

    let dev = await Dev.findOne({ github_username });

    // console.log(request.body);

    // var query = {'username': req.user.username};
    // request.newData.github_username = request.user.github_username;

    Dev.findOneAndUpdate(
      dev,
      {
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      }
      //   { upsert: true }
      // function(err, doc) {
      //   if (err) return response.send(500, { error: err });
      //   return response.send("Succesfully saved.");
      // }
    );

    return response.json({
      name,
      avatar_url,
      bio,
      techs: techsArray,
      location
    });
  },

  async destroy(request, response) {
    // get id from github_username
    const { github_username } = request.query;

    let dev = await Dev.findOne({ github_username });

    if (dev) {
      await Dev.deleteOne({
        github_username
      });
      return response.json({ message: "User deleted" });
    } else {
      return response.json({ message: "No such user" });
    }
  }
};
