const express = require('express');
const mongodb = require('mongodb');
const { MongoClient } = mongodb;
 
const router = express.Router();
 
const uri =
  'mongodb+srv://johndoo:y7NqqkOyEwu6IyhE@atlascluster.drnm2sy.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster';
 
// Create a new MongoClient
const client = new MongoClient(uri, {useUnifiedTopology: true});
 
const locationStorage = {
  locations: [],
};
 
router.post('/add-location', async (req, res, next) => {
  /* const id = Math.random();
  locationStorage.locations.push({
    id: id,
    address: req.body.address,
    coords: { lat: req.body.lat, lng: req.body.lng },
  });
  console.log(locationStorage.locations); */
 
  try {
    await client.connect();
    const database = client.db('locations');
    const collection = database.collection('user-locations');
    // create a document to be inserted
    const doc = {
      address: req.body.address,
      coords: { lat: req.body.lat, lng: req.body.lng },
    };
    const result = await collection.insertOne(doc);
    res.json({ message: 'Stored location!', locId: result.insertedId });
    console.log(
      `${result.insertedCount} location documents were inserted with the _id: ${result.insertedId}`
    );
 
  } catch (err) {
    console.dir(err);
  } finally {
    // await client.close(); // Commented as throwing some topology errors on mongo connection
  }
});
 
router.get('/location/:locId', async (req, res, next) => {
  // const location = locationStorage.locations.find(loc => loc.id === locationId);
  const locationId = req.params.locId;
  console.log(locationId);
 
  try {
    await client.connect();
    const database = client.db('locations');
    const collection = database.collection('user-locations');
 
    // Query for a movie that has the title 'The Room'
    const query = {
      _id: new mongodb.ObjectId(locationId),
    };
 
    const location = await collection.findOne(query);
    // since this method returns the matched document, not a cursor, print it directly
    console.log(location);
 
    if (!location) {
      res.status(404).json('Not Found!');
      return;
    }
 
    res.json({
      message: 'Retrieved location!',
      coordinates: location.coords,
      address: location.address,
    });
 
  } catch (err) {
    console.dir(err);
  } finally {
    // await client.close(); // Commented as throwing some topology errors on mongo connection
  }
});
 
module.exports = router;
 