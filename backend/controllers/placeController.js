const Place = require("../models/Place");
const Review = require("../models/Review");
const axios = require("axios");

// ➕ Add Place (manual upload)
exports.addPlace = async (req, res) => {
  try {
    const { name, description, lat, lng } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    const place = new Place({
      name,
      description,
      location: { lat, lng },
      images
    });

    await place.save();
    res.status(201).json(place);
  } catch (err) {
    res.status(500).json({ message: "Error adding place", error: err.message });
  }
};

// 📋 Get All Places
exports.getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: "Error fetching places", error: err.message });
  }
};

// 🔎 Get Place by ID
exports.getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.json(place);
  } catch (err) {
    res.status(500).json({ message: "Error fetching place", error: err.message });
  }
};

// 🌍 Full Search API (Wikipedia + Unsplash + OSM + Weather + Reviews)
exports.searchPlaceFull = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ message: "Place name is required" });

    // 1️⃣ Wikipedia (description + image)
    let description = "";
    let wikiImage = null;
    try {
      const wikiRes = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`);
      description = wikiRes.data.extract || "No description available";
      wikiImage = wikiRes.data.thumbnail ? wikiRes.data.thumbnail.source : null;
    } catch {
      description = "No description available";
    }

    // 2️⃣ Unsplash (images)
    let images = [];
    try {
      const unsplashRes = await axios.get("https://api.unsplash.com/search/photos", {
        params: {
          query: name,
          client_id: process.env.UNSPLASH_ACCESS_KEY,
          per_page: 4
        }
      });
      images = unsplashRes.data.results.map(img => img.urls.regular);
    } catch {
      images = [];
    }

    // 3️⃣ OpenStreetMap (location)
    let location = null;
    try {
      const osmRes = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: name, format: "json", limit: 1 }
      });
      if (osmRes.data.length > 0) {
        location = {
          lat: osmRes.data[0].lat,
          lng: osmRes.data[0].lon,
          displayName: osmRes.data[0].display_name
        };
      }
    } catch {
      location = null;
    }

    // 4️⃣ OpenWeatherMap (weather)
    let weather = null;
    if (location) {
      try {
        const weatherRes = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
          params: {
            lat: location.lat,
            lon: location.lng,
            appid: process.env.OPENWEATHER_KEY,
            units: "metric"
          }
        });
        weather = {
          temp: weatherRes.data.main.temp,
          feels_like: weatherRes.data.main.feels_like,
          condition: weatherRes.data.weather[0].description
        };
      } catch {
        weather = null;
      }
    }

    // 5️⃣ MongoDB Place & Reviews
    let place = await Place.findOne({ name: { $regex: new RegExp(name, "i") } });
    if (!place) {
      place = new Place({
        name,
        description,
        location,
        images
      });
      await place.save();
    }

    // Fetch only reviews for this place
    let reviews = await Review.find({ placeId: place._id }).populate("userId", "name");
    let summary = { positive: 0, negative: 0, neutral: 0, total: 0 };
    reviews.forEach(r => {
      if (r.sentiment === "Positive") summary.positive++;
      else if (r.sentiment === "Negative") summary.negative++;
      else summary.neutral++;
    });
    summary.total = reviews.length;

    // ✅ Final Response
    res.json({
      name,
      description,
      wikiImage,
      images,
      location,
      weather,
      reviews,
      summary
    });

  } catch (err) {
    res.status(500).json({ message: "Error searching place", error: err.message });
  }
};
