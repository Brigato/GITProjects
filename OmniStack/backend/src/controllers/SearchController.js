const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");

module.exports = {
  async index(request, response) {
    // Buscar todos os devs num raio de 10 km
    // Filtrar por tecnologias
    // console.log(request.query);
    const { techs, latitude, longitude } = request.query;

    const techsArray = parseStringAsArray(techs);

    // console.log(techsArray, techs, latitude, longitude);

    const devs = await Dev.find({
      techs: {
        $in: techsArray
      },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [latitude, longitude]
          },
          $maxDistance: 10000
        }
      }
    });

    return response.json({ devs });
  }
};
