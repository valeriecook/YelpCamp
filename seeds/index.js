const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors, imageUrls } = require("./seedHelpers");
const Campground = require("../models/campground");

const author = process.env.AUTHOR_ID;
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Function that takes an array and returns a random value from it
const sample = (array) => array[Math.floor(Math.random() * array.length)];

function generateSeedImages() {
  const numImages = Math.floor(Math.random() * 3) + 1; // 1-3 images
  const shuffledUrls = imageUrls.sort(() => Math.random() - 0.5);
  const seedImageUrls = shuffledUrls.slice(0, numImages);

  // Map each image URL to an object containing the URL and the file path
  const seedImages = seedImageUrls.map((url) => {
    const filePath = url.split("/").pop(); // Extract the file path from the URL
    return { url, filePath };
  });
  return seedImages;
}

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const rand1000 = Math.floor(Math.random() * 1000); // random number for city details
    const price = Math.floor(Math.random() * 30) + 10; // random number between 10 and 40
    const images = generateSeedImages();
    const camp = new Campground({
      location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      author,
      images,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad officiis consequatur, unde illum, velit consectetur vitae cum facere eius nesciunt aspernatur necessitatibus obcaecati, possimus voluptatibus dignissimos nam laborum numquam molestias?",
      price,
      geometry: {
        type: "Point",
        coordinates: [cities[rand1000].longitude, cities[rand1000].latitude]
      }
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
