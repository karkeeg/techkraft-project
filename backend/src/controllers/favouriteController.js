const db = require('../config/db');

const getFavourites = (req, res) => {
  const sql = `SELECT property_id FROM favourites WHERE user_id = ?`;
  db.all(sql, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(rows.map(row => row.property_id));
  });
};

const addFavourite = (req, res) => {
  const { propertyId } = req.params;
  const sql = `INSERT INTO favourites (user_id, property_id) VALUES (?, ?)`;
  
  db.run(sql, [req.user.id, propertyId], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ message: 'Already in favourites' });
      }
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Added to favourites', propertyId });
  });
};

const removeFavourite = (req, res) => {
  const { propertyId } = req.params;
  const sql = `DELETE FROM favourites WHERE user_id = ? AND property_id = ?`;
  
  db.run(sql, [req.user.id, propertyId], function (err) {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Removed from favourites', propertyId });
  });
};

module.exports = { getFavourites, addFavourite, removeFavourite };
