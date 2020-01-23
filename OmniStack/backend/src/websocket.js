const socketio = require("socket.io");
const parseStringAsArrays = require("./utils/parseStringAsArray");
const calculateDistance = require("./utils/calculateDistance");

const connections = [];

exports.setupWebsocket = server => {
  const io = socketio(server);

  io.on("connection", socket => {
    const { latitude, longitude, techs } = socket.handshake.query;
    // console.log(socket.id);
    // console.log(socket.handshake.query);

    // setTimeout(() => {
    //   socket.emit('message', 'Hello OmniStack');
    // }, 3000);

    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude)
      },
      techas: parseStringAsArrays(techs)
    });
  });
};

exports.findConnections = (coordinates, techs) => {
  return connections.filter(connection => {
    return (
      calculateDistance(coordinates, connection.coordinates) < 10 &&
      connection.techs.some(item => techs.includes(item))
    );
  });
};
