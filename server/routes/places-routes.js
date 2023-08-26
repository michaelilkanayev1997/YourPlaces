const express = require("express");

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "one of the most famous sky scrapers in the world!",
    imageUrl:
      "https://www.esbnyc.com/sites/default/files/2020-01/ESB%20Day.jpg",
    address: "20 W 34th St., New York, NY 10001",
    location: {
      lat: 40.7485452,
      lng: -73.9831886,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Emp. State Building",
    description: "one of the most famous sky scrapers in the world!",
    imageUrl:
      "https://www.esbnyc.com/sites/default/files/2020-01/ESB%20Day.jpg",
    address: "20 W 34th St., New York, NY 10001",
    location: {
      lat: 40.7485734,
      lng: -73.9852849,
    },
    creator: "u2",
  },
];

router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid; // {pid:'p1'}

  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  res.json({ place }); // => {place} => { place: place }
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;

  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  res.json({ place }); // => {place} => { place: place }
});

module.exports = router;
